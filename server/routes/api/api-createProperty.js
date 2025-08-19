const express = require('express');

const router = express.Router();
const controller = require('../../controllers/api/api-createProperty');
const putController = require('../../controllers/api/api-editProperty');
const deleteController = require('../../controllers/api/api-deleteProperty');
const {upload} = require('../../middleware/multer');

router.post("/", upload.array('imageInput', 3), controller);

router.put("/", upload.array("imageInput", 3), putController);

router.delete("/", deleteController);

module.exports = router;