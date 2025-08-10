

const express = require('express');

const getPropertyForm = require('../../controllers/owner-page/property-form-controller');

const router = express.Router();

router.get("/", getPropertyForm);


module.exports = router;