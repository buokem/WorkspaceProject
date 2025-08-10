
const express = require('express');

const getWorkspaceForm = require('../../controllers/owner-page/workspace-form-controller');

const router = express.Router();

router.get("/", getWorkspaceForm);


module.exports = router;