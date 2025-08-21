const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  name: String,
  Address_line1: String,
  city: String,
  province: String,
  postal_code: String,
  total_area: Number,
  num_rooms: Number,
  available: Boolean,
  pictures: [String]
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);
