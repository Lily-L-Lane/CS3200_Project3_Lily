This is my implementation of nodeExpress CS3200_Project3.
The UML: UML Diagram.
Document: Answers the questions 1-3 for assignment Project3.
The application:
  bin:
    www: the implementation on local port
    CS3200_P3_JSON.json:  the json database from mongo
    farms.js: implementation of the cache, redis, and mongo. Gets the farms from mongo and puts them into cache. Also runs the query that returns farms from specified climate.
  routes: 
    index.js: gets data from farms.js and exports them to app.js
  views:
    index.ejs: html display of the application website page
app.js: application
package-lock.json: package lock
package.json: package.json
