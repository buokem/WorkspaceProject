//install dependencies
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

//import files
//routers
const getOwnerPageRouter = require('./routes/owner-page/owner');
const getPropertyFormRouter = require('./routes/owner-page/property-form');
const getWorkspaceFormRouter = require('./routes/owner-page/workspace-form');
const getPropertyViewRouter = require('./routes/owner-page/property-view');
const getMyWorkSpaceRouter = require('./routes/owner-page/my-workspace');
const getCoWorkerPageRouter = require('./routes/coworker-page/coWorker');
const getCoWorkerViewPageRouter = require('./routes/coworker-page/coWorkerView');
const getHomePageRouter = require('./routes/home-page/homePageRouter');
const getAuthPageRouter = require('./routes/auth/auth');
const getWorkspacesForPropertyRouter = require('./routes/api/api-getworkspaces');

const getCoWorkerByID = require('./routes/api/api-coWorkerView');
const getPropertyById = require('./routes/api/api-propertyById');
const getPropertyWorkspace = require('./routes/api/api-propertyWorkspace');
const getDatabaseRouter = require('./routes/api/api-database');
const getWorkspacesHomePage = require('./routes/api/api-homepage');
const getSearchHomePage = require('./routes/api/api-search');
const createUserRouter = require('./routes/api/api-createUser');
const createWorkspaceRouter = require('./routes/owner-page/create-workspace');
const createPropertyRouter = require('./routes/api/api-createProperty');
const getPropertiesForOwnerRouter = require('./routes/api/api-getProperties');

const { auth } = require('./middleware/auth-middleware');

//middleware to parseJSON
app.use(express.json());

//middleware to parse cookies
app.use(cookieParser());

const allowedOrigins = new Set([
   'https://buokem.github.io', 
]);

app.use(cors({
  origin(origin, cb) {
    // allow tools and local file:// with no origin
    if (!origin) return cb(null, true);
    const ok = allowedOrigins.some(a => origin.startsWith(a));
    cb(ok ? null : new Error('CORS blocked'), ok);
  },
  credentials: true // set true only if you use cookies
}));

//middleware to set the static folder
//app.use(express.static(path.join(__dirname, '../client/assets')));
app.use(express.static(path.join(__dirname, './pictures')));

// Health route for Render
app.get('/', (_req, res) => res.status(200).send('OK'));

//middleware for api's
app.use('/api/database', auth({roles:['coworker', 'owner']}), getDatabaseRouter);
app.use('/api/coworkerview', auth({roles:['coworker', 'owner']}), getCoWorkerByID);
app.use('/api/property', auth({roles:['owner']}), getPropertyById);
app.use('/api/property-workspace', auth({roles:['owner']}), getPropertyWorkspace);
app.use('/api/homepage', getWorkspacesHomePage);
app.use('/api/search', getSearchHomePage);
app.use('/api/auth', createUserRouter);
app.use('/api/createworkspace',auth({roles:['owner']}), createWorkspaceRouter);
app.use('/api/createProperty', auth({roles:['owner']}),createPropertyRouter);
app.use('/api/getproperties', auth({roles:['owner']}), getPropertiesForOwnerRouter);
app.use('/api/getworkspaces', auth({roles:['owner']}), getWorkspacesForPropertyRouter);

//middleware for pages
//home pages
// app.use('/', getHomePageRouter);

// //sign in page
// app.use('/authentication', getAuthPageRouter);

// //coworker pages
// app.use('/coworker', auth({roles:['coworker']}), getCoWorkerPageRouter);
// app.use('/workspace-view', auth({roles:['coworker', 'owner']}), getCoWorkerViewPageRouter);

// //owner pages
// app.use('/owner', auth({roles:['owner']}), getOwnerPageRouter);
// app.use('/property-view', auth({roles:['owner']}), getPropertyViewRouter);
// app.use('/my-workspace', auth({roles:['owner']}), getMyWorkSpaceRouter);

// //create and edit 
// app.use('/property-form', auth({roles:['owner']}), getPropertyFormRouter);
// app.use('/workspace-form', auth({roles:['owner']}), getWorkspaceFormRouter);

console.log('🚀 ~ process.env.MONGO_URI:', process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected successfully!");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error (event):", err);
});

db.once("open", () => {
  console.log("MongoDB connection opened!");
});

// todo disconnect

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT,'0.0.0.0' ,() => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Disconnect when app turn off
const gracefulExit = async () => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected gracefully");
  server.close(() => process.exit(0));
};

process.on("SIGINT", gracefulExit);   // Ctrl+C
process.on("SIGTERM", gracefulExit);  // Heroku, Docker stop
