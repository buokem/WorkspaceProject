//install dependencies
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

//import files
//routers
const getCoWorkerPageRouter = require('./routes/coworker-page/coWorker');
const getDatabaseRouter = require('./routes/api/api-database');
const getCoWorkerViewPageRouter = require('./routes/coworker-page/coWorkerView');
const getCoWorkerByID = require('./routes/api/api-coWorkerView');

//middleware to parseJSON
app.use(express.json());

//middleware to set the static folder
app.use(express.static(path.join(__dirname, '../client/assets')));
app.use(express.static(path.join(__dirname, './pictures')));

//middleware for api's
app.use('/api/database', getDatabaseRouter);
app.use('/api/coworkerview', getCoWorkerByID);

//middleware for pages
app.use('/coworker', getCoWorkerPageRouter);
app.use('/coworkerview', getCoWorkerViewPageRouter);
//app.use('/', getHomePageRouter);
//app.use('/owner, getOwnerPageRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT,'0.0.0.0' ,() => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});