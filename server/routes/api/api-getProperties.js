const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/api-getProperties');

router.get("/:id", controller);


module.exports = router;