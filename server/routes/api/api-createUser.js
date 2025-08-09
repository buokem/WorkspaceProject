const express = require("express");
const router = express.Router();

const createController = require('../../controllers/api/api-createUser');

router.post('/createuser', createController);
//router.post('/verifyuser, verifyController)

module.exports = router;