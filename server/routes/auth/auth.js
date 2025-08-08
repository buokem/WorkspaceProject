const express = require('express');
const router = express.Router();
const controller = require('../../controllers/auth/auth-controller')

router.get('/:mode', controller);

module.exports = router;