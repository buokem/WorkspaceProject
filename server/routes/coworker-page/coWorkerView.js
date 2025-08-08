const express = require('express');
const router = express.Router();

const controller = require('../../controllers/coworker-page/coWorkerView-controller');

router.get('/:id', controller)

module.exports = router;