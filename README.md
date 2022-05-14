# FE-Database

This is repository of database API for Farmer Connect Web App and Mobile application.<br>
This server works as data provider for both mobile app and web app.<br>
In this project authentication is done through API key which must be passed in header.<br>
This Server is developed using NodeJs, ExpressJs and mongoDB is used as database.

<hr>
This server starts on port 5000 and can be started using <strong>'node app.js'</strong> command
This project contains 3 main folders 
<ol>
  <li>models:
  <p>This folder contains schema for all the collections in database</p>
  </li>
  <li>controllers:
  <p>The files inside this folder contains all the supporting or helper functions or functions to fetch data from mongoDB database using mongoose library</p>
  </li>  
  <li> routes:
  <p>The folder contains files for all routes that are handled by this server</p>
  </li>
</ol>
app.js file contains all the code to connect to all other files and mongoDB database.

To Run this server you need to have <i>.env</i> file which contains all credentials.

<a href="http://162.240.33.255:5000/"> http://162.240.33.255:5000/ </a> This is the url of this Database API
