const Workspace = require("../../models/Workspace");
const WorkspaceFacility = require("../../models/WorkspaceFacility");
const Property = require("../../models/Property");
const Facility = require("../../models/Facility")

async function editWorkspace(req, res) {
  try {
    console.log(req.files, req.body, req.user);

    const propertyID = req.query.propertyID;
    const userID = req.user.id;

    const property = await Property.findOne({ _id: propertyID, owner_id: userID });

    console.log(property)

    if (!property) return res.status(404).json({ message: "Can't access data" });

    let pictures = null;

    const {
      name,
      desc,
      seats,
      price,
      size,
      lease,
      smoking,
      whiteboard,
      projector,
      microphone,
      available,
      workspace_id
    } = req.body;

    console.log(workspace_id)

    if (req.files.length !== 0) {
      pictures = req.files.map(file => "/" + file.filename);
    }

    const workspace = await Workspace.findOne({ _id: workspace_id, property_id: propertyID });
    if (!workspace) return res.status(404).json({ message: `No workspace with id ${workspace_id}` });

    workspace.name = name;
    workspace.size = Number(size);
    workspace.capacity = Number(seats);
    workspace.rate = Number(price);
    workspace.description = desc;
    workspace.lease = lease;
    workspace.available = available === "on";
    if (pictures) workspace.pictures = pictures;
    workspace.updated_at = new Date();

    await workspace.save();

    await WorkspaceFacility.deleteMany({ workspace_id });

    const workspaceFacilityArray = [];

    if (smoking === "on") {
      const f = await createNewWorkspaceFacility(workspace._id, "Smoking");
      if (f) workspaceFacilityArray.push(f);
    }

    if (projector === "on") {
      const f = await createNewWorkspaceFacility(workspace._id, "Projector");
      if (f) workspaceFacilityArray.push(f);
    }

    if (microphone === "on") {
      const f = await createNewWorkspaceFacility(workspace._id, "Microphone");
      if (f) workspaceFacilityArray.push(f);
    }

    if (whiteboard === "on") {
      const f = await createNewWorkspaceFacility(workspace._id, "Whiteboard");
      if (f) workspaceFacilityArray.push(f);
    }

    if (workspaceFacilityArray.length > 0) {
      await WorkspaceFacility.insertMany(workspaceFacilityArray);
    }

    return res.status(200).json({ message: "Edit successful" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to edit workspace",
      error: err.message || "Server error."
    });
  }

  async function createNewWorkspaceFacility(workspaceID, facilityName) {
    const facility = await Facility.findOne({ name: facilityName });
    if (!facility) return null; 

    console.log(facility)

    return new WorkspaceFacility({
      workspace_id: workspaceID,
      facility_id: facility._id,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}

module.exports = editWorkspace;
