const express = require('express');
const router = express.Router();

const controller = require('../../controllers/home-page/homePageController');

router.get("/", controller)

module.exports = router;