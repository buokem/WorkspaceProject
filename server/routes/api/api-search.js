const express = require('express');
const router = express.Router();

const controller = require('../../controllers/api/api-search')

router.get("/", controller)

module.exports = router