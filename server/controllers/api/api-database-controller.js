const Facility = require("../../models/Facility");
const Property = require("../../models/Property");
const Workspace = require("../../models/Workspace");
const User = require("../../models/User");
const PropertyFacility = require("../../models/PropertyFacility");
const WorkspaceFacility = require("../../models/WorkspaceFacility");

async function getData(req, res) {
  try {
    const facilities = await Facility.find();
    const properties = await Property.find();
    const workspaces = await Workspace.find();
    const propertyFacilities = await PropertyFacility.find();
    const workspaceFacilities = await WorkspaceFacility.find();
    const user = req.user

    const data = {
      facilityData: facilities,
      propertyData: properties,
      workspaceData: workspaces,
      propertyFacility: propertyFacilities,
      workspaceFacility: workspaceFacilities,
      userInfo: user
    };

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error." });
  }
}

module.exports = getData;
