
const express = require('express');

const getCoWorkerPage = require('../../controllers/coworker-page/coWorker-controller');

const router = express.Router();

router.get("/", getCoWorkerPage);


module.exports = router;