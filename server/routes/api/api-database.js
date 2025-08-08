const express = require('express');
const router = express.Router();

const controller = require('../../controllers/api/api-database-controller')

router.get("/", controller);

module.exports = router;