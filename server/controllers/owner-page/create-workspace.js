const Workspace = require("../../models/Workspace");
const WorkspaceFacility = require("../../models/WorkspaceFacility");
const Property = require("../../models/Property");
const Facility = require("../../models/Facility");

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
    if (smoking === "on") {
      const f = await createNewWorkspaceFacility(newWorkspace._id, "Smoking");

      if (f) workspaceFacilityArray.push(f);
    }

    if (projector === "on") {
      const f = await createNewWorkspaceFacility(newWorkspace._id, "Projector");
      if (f) workspaceFacilityArray.push(f);
    }

    if (microphone === "on") {
      const f = await createNewWorkspaceFacility(newWorkspace._id, "Microphone");
      if (f) workspaceFacilityArray.push(f);
    }

    if (whiteboard === "on") {
      const f = await createNewWorkspaceFacility(newWorkspace._id, "Whiteboard");
      if (f) workspaceFacilityArray.push(f);
    }

    if (workspaceFacilityArray.length > 0) {
      console.log(workspaceFacilityArray)
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

  async function createNewWorkspaceFacility(workspaceID, facilityName) {
    const facility = await Facility.findOne({ name: facilityName });
    console.log(facility);
    if (!facility) return null; // or throw error if you want strict

    return new WorkspaceFacility({
      workspace_id: workspaceID,
      facility_id: facility._id,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

}

module.exports = createWorkspace;
