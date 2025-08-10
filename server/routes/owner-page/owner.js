
const express = require('express');

const getOwnerPage = require('../../controllers/owner-page/owner-controller');

const router = express.Router();

router.get("/", getOwnerPage);


module.exports = router;