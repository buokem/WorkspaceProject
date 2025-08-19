const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
  name: String
}, { timestamps: true });

module.exports = mongoose.model("Facility", facilitySchema);
