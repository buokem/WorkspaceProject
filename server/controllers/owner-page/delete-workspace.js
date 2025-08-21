const Workspace = require("../../models/Workspace");
const WorkspaceFacility = require("../../models/WorkspaceFacility");
const Property = require("../../models/Property");

async function deleteWorkspace(req, res) {
  try {
    const workspaceID = req.body.id;
    const propertyID = req.query.propertyID;
    const userID = req.user.id;

    console.log(workspaceID, propertyID)

    const property = await Property.findOne({ _id: propertyID, owner_id: userID });
    if (!property) return res.status(404).json({ message: "Can't access data" });

    const deleted = await Workspace.findOneAndDelete({ _id: workspaceID, property_id: propertyID });
    if (!deleted) return res.status(404).json({ message: "Workspace not found" });

    await WorkspaceFacility.deleteMany({ workspace_id: workspaceID });

    return res.status(200).json({ message: "Delete successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to delete Workspace",
      error: err.message || "Server error."
    });
  }
}

module.exports = deleteWorkspace;
