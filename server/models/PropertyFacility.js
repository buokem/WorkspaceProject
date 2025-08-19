const mongoose = require("mongoose");

const propertyFacilitySchema = new mongoose.Schema({
  property_id: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  facility_id: { type: mongoose.Schema.Types.ObjectId, ref: "Facility" }
}, { timestamps: true });

module.exports = mongoose.model("PropertyFacility", propertyFacilitySchema);
