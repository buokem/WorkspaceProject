const express = require('express');
const router = express.Router();
const {upload} = require("../../middleware/multer");

const controller = require('../../controllers/owner-page/create-workspace');
const putController = require('../../controllers/owner-page/edit-workspace');
const deleteController = require('../../controllers/owner-page/delete-workspace')

router.post("/", upload.array("imageInput", 3) ,controller);

router.put("/", upload.array("imageInput", 3), putController);

router.delete("/", deleteController)

module.exports = router;