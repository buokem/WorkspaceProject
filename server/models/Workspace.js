const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
  property_id: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  name: String,
  size: Number,
  capacity: Number,
  rate: Number,
  pictures: [String],
  description: String,
  available: Boolean,
  reviews: Number
}, { timestamps: true });

module.exports = mongoose.model("Workspace", workspaceSchema);
