const mongoose = require("mongoose");

const workspaceFacilitySchema = new mongoose.Schema({
  workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
  facility_id: { type: mongoose.Schema.Types.ObjectId, ref: "Facility" }
}, { timestamps: true });

module.exports = mongoose.model("WorkspaceFacility", workspaceFacilitySchema);
