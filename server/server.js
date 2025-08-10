//install dependencies
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

//import files
//routers
const getCoWorkerPageRouter = require('./routes/coworker-page/coWorker');
const getCoWorkerViewPageRouter = require('./routes/coworker-page/coWorkerView');
const getHomePageRouter = require('./routes/home-page/homePageRouter');
const getAuthPageRouter = require('./routes/auth/auth')

const getCoWorkerByID = require('./routes/api/api-coWorkerView');
const getDatabaseRouter = require('./routes/api/api-database');
const getWorkspacesHomePage = require('./routes/api/api-homepage');
const getSearchHomePage = require('./routes/api/api-search');
const createUserRouter = require('./routes/api/api-createUser');

const {auth} = require('./middleware/auth-middleware');


//middleware to parseJSON
app.use(express.json());

//middleware to parse cookies
app.use(cookieParser());

//middleware to set the static folder
app.use(express.static(path.join(__dirname, '../client/assets')));
app.use(express.static(path.join(__dirname, './pictures')));

//middleware for api's
app.use('/api/database', auth({roles:['coworker']}), getDatabaseRouter);
app.use('/api/coworkerview', auth({roles:['coworker']}), getCoWorkerByID);
app.use('/api/homepage', getWorkspacesHomePage);
app.use('/api/search', getSearchHomePage);
app.use('/api/auth', createUserRouter);


//middleware for pages
app.use('/coworker', auth({roles:['coworker']}), getCoWorkerPageRouter);
app.use('/coworkerview', auth({roles:['coworker']}), getCoWorkerViewPageRouter);
app.use('/', getHomePageRouter);

app.use('/authentication', getAuthPageRouter);

//app.use('/owner, auth({roles:['owner']}), getOwnerPageRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT,'0.0.0.0' ,() => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
//who's committing