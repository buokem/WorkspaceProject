const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/api-getworkspaces')

router.get("/", controller);

module.exports = router;

