const Workspace = require("../../models/Workspace");
const WorkspaceFacility = require("../../models/WorkspaceFacility");
const Property = require("../../models/Property");

async function createWorkspace(req, res) {
  try {
    console.log(req.files, req.body, req.query, req.user);

    const propertyID = req.query.propertyID;

    const property = await Property.findOne({ _id: propertyID, owner_id: req.user.id });
    if (!property) return res.status(404).json({ message: "Can't access data" });

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
    } = req.body;

    const pictures = req.files.map(file => "/" + file.filename);

    const newWorkspace = new Workspace({
      workspace_id: Date.now(),
      property_id: propertyID,
      name,
      size: Number(size),
      capacity: Number(seats),
      rate: Number(price),
      pictures,
      description: desc,
      available: available === "on",
      lease,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newWorkspace.save();

    const workspaceFacilityArray = [];
    if (smoking === "on") workspaceFacilityArray.push(createNewWorkspaceFacility(newWorkspace.workspace_id, 4));
    if (projector === "on") workspaceFacilityArray.push(createNewWorkspaceFacility(newWorkspace.workspace_id, 5));
    if (microphone === "on") workspaceFacilityArray.push(createNewWorkspaceFacility(newWorkspace.workspace_id, 6));
    if (whiteboard === "on") workspaceFacilityArray.push(createNewWorkspaceFacility(newWorkspace.workspace_id, 7));

    if (workspaceFacilityArray.length > 0) {
      await WorkspaceFacility.insertMany(workspaceFacilityArray);
    }

    return res.status(201).json({ message: "Workspace Created" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to create Workspace",
      error: err.message || "Server error."
    });
  }

  function createNewWorkspaceFacility(workspaceID, facilityID) {
    return {
      workspace_id: workspaceID,
      facility_id: facilityID,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}

module.exports = createWorkspace;
