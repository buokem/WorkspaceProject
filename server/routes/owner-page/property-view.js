

const express = require('express');

const getPropertyViewPage = require('../../controllers/owner-page/property-view-controller');

const router = express.Router();

router.get('/:id', getPropertyViewPage);


module.exports = router;