const express = require('express');

const router = express.Router();
const controller = require('../../controllers/api/api-homepage')

//normal get
router.get("/", controller)

module.exports = router;