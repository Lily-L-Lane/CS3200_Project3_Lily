let express = require('express');
let router = express.Router();
const { getFarms } = require("./farms.js");

/* GET home page. */
router.get('/', async function(req, res) {
        // Get farms data
        const farms = await getfarms();

        // Log farms count
        console.log("route / called - farms", farms.length);

        // Render index page with farms data
        const values = { 
            title: "Irrigation Solutions for Farms", 
            farms,
        }
        res.render('index', values);
});

module.exports = router;