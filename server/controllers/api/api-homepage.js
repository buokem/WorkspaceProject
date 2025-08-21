const Property = require("../../models/Property");
const Workspace = require("../../models/Workspace");

async function getFourData(req, res) {
  try {
    const workspaces = await Workspace.find().limit(4);

    if (!workspaces || workspaces.length === 0) {
      return res.status(404).json({ message: "No workspaces found" });
    }

    const propertyIds = workspaces.map(ws => ws._id);
    const properties = await Property.find({ _id: { $in: propertyIds } });

    // Map property_id → Address_line1
    const pMap = new Map();
    properties.forEach(p => {
      pMap.set(p._id, p.Address_line1);
    });

    const result = workspaces.map(ws => ({
      ...ws.toObject(),
      Address: pMap.get(ws._id) || "",
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get data", error: err.message });
  }
}

module.exports = getFourData;
