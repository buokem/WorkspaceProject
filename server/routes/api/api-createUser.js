const express = require("express");
const router = express.Router();

const createController = require('../../controllers/api/api-createUser');
const verifyController = require('../../controllers/api/api-verifyUser');

router.post('/createuser', createController);
router.post('/verifyuser', verifyController);

module.exports = router;