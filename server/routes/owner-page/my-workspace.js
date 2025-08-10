
const express = require('express');

const getMyWorkSpacePage = require('../../controllers/owner-page/myworkspace-controller');

const router = express.Router();

router.get("/", getMyWorkSpacePage);


module.exports = router;