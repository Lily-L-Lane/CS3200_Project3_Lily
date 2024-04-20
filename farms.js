import { MongoClient } from "mongodb";
import { createClient } from "redis";

let EXPIRATION_TIME = 60; // 60 seconds

async function getFarmsFromCache(climateType) {
  const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  let key = `farms:${climateType}`;

  const exists = await client.get(key + ":cached");

  try {
    if (exists) {
      let farms = [];

      const farmKeys = await client.lRange(key, 0, -1);
      for (let farmKey of farmKeys) {
        farms.push(await client.hGetAll(farmKey));
      }

      return farms;
    } else {
      return null;
    }
  } finally {
    await client.disconnect();
  }
}

async function saveFarmsToCache(climateType, farms) {
  const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  let key = `farms:${climateType}`;

  try {
    for (let farm of farms) {
      const farmKey = `farm:${climateType}:${farm._id.$oid}`;
      const res = await client.hSet(
        farmKey,
        Object.entries(farm).flatMap(([key, value]) => [key, JSON.stringify(value)])
      );
      await client.rPush(key, farmKey);
    }
    await client.set(key + ":cached", 1, { EX: EXPIRATION_TIME }); // 60 seconds cache
    console.log("🧸 farms saved to cache total", farms.length);
  } finally {
    await client.disconnect();
  }
}

async function getFarmsFromMongo(climateType) {
  const filter = {
    "region_id.climate.climateType": climateType,
  };

  const client = await MongoClient.connect("mongodb://localhost:27017/");
  const coll = client.db("CS3200_P2_IrrigationSolutions").collection("Farms");
  const cursor = coll.find(filter);
  const farms = await cursor.toArray();
  await client.close();

  return farms;
}

// Returns the list of farms for a climateType, checking first in the cache
async function getFarms(climateType) {
  let farms = [];
  console.log("Checking if the resource is in the cache", climateType);
  farms = await getFarmsFromCache(climateType);
  if (!farms) {
    console.log(
      "🚫 Resource not found in the cache, checking mongo",
      climateType
    );
    farms = await getFarmsFromMongo(climateType);
    console.log("Resource found in mongo", climateType, farms.length);

    await saveFarmsToCache(climateType, farms);
  } else {
    console.log("👍 Resource found in the cache", climateType, farms.length);
  }
  return farms;
}

let userClimate = "Savanna Climate";
(async () => {
  // Cleanup the cache
  async function cleanupCache() {
    const client = await createClient()
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();

    const exists = await client.flushAll();
    console.log("☠️ Cache cleaned", exists);

    await client.disconnect();
  }

  let before = performance.now();
  await cleanupCache();
  console.log("🧹 Cache cleaned in", performance.now() - before);

  before = performance.now();
  // Get the farms for the first time (not in cache)
  await getFarms(userClimate);
  console.log("🚀 farms fetched from mongo in", performance.now() - before);

  before = performance.now();
  // Get the farms for the second time, it should be in the cache
  await getFarms(userClimate);
  console.log("⚽️ farms fetched from cache in", performance.now() - before);
})();

// module.exports = { getFarms };