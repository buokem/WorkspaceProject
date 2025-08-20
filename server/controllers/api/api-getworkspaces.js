const Property = require("../../models/Property");
const Workspace = require("../../models/Workspace");
const WorkspaceFacility = require("../../models/WorkspaceFacility");

async function getWorkspacesForProperty(req, res) {
  try {
    console.log(req.user, req.query);
    const property_id = req.query.propID;
    const owner_id = req.user.id;

    // Tìm property theo property_id và owner_id
    const property = await Property.findOne({ _id: property_id, owner_id });

    if (!property) {
      return res.status(404).json({ message: "Cannot access workspaces" });
    }

    // Lấy tất cả workspace thuộc property này
    const workspaces = await Workspace.find({ property_id });

    if (!workspaces || workspaces.length === 0) {
      return res.status(200).json({ workspaces: [], message: "No workspace found. Please create one." });
    }

    // Thêm facilities và thông tin địa chỉ property cho từng workspace
    const dataWithFacilities = await Promise.all(
      workspaces.map(async ws => {
        const facilities = await WorkspaceFacility.find({ workspace_id: ws.workspace_id });
        return {
          ...ws.toObject(),
          Facilities: facilities,
          address: property.Address_line1,
          city: property.city,
          province: property.province,
          postal_code: property.postal_code,
        };
      })
    );

    return res.status(200).json({ workspaces: dataWithFacilities });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch workspaces", error: err.message });
  }
}

module.exports = getWorkspacesForProperty;
