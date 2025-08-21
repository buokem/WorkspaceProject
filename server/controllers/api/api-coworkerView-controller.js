const Workspace = require("../../models/Workspace");
const WorkspaceFacility = require("../../models/WorkspaceFacility");
const PropertyFacility = require("../../models/PropertyFacility");

async function getWorkspaceById(req, res) {
  try {
    const workspaceId = req.params.id;

    const workspace = await Workspace.findById(workspaceId).populate("property_id");
    if (!workspace) {
      return res.status(404).json({ error: `Workspace with ID ${workspaceId} doesn't exist` });
    }
    
    const property = workspace.property_id;
    const address = `${property.Address_line1}, ${property.city}, ${property.province}, ${property.postal_code}`;
    const wsFacilities = await WorkspaceFacility.find({ workspace_id: workspace._id }).populate("facility_id");
    const pFacilities = await PropertyFacility.find({ property_id: property._id }).populate("facility_id");
    const result = {
      ...workspace.toObject(),
      address,
      wsFacility: wsFacilities.map(f => f.facility_id.name),
      pFacility: pFacilities.map(f => f.facility_id.name),
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = getWorkspaceById;
