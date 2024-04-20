# CS3200_Project3 - NodeExpress Implementation

This repository contains the implementation of a NodeExpress application for CS3200_Project3.

## Contents

- **Business Requirements Document**: Business Requirements Document
- **UML**: UML Diagram pdf for clarity
- **Redis UML model functionalilty**: Answers to questions 1-3 for assignment Project3
- **CS3200 Project 3 Results**: output shown on terminal and redis insight

## Application Structure

### bin
- **www**: Implementation on local port
- **CS3200_P3_JSON.json**: JSON database from MongoDB
- **farms.js**: Implementation of caching, Redis, and MongoDB. Retrieves farms from MongoDB and stores them in the cache. Also runs the query that returns farms from specified climates. Essentially, the node implementation will be found here.

### routes
- **index.js**: Retrieves data from `farms.js` and exports it to `app.js`

### views
- **index.ejs**: HTML display of the application website page

- **app.js**: Main application file
- **package-lock.json**: Package lock file
- **package.json**: Package.json
