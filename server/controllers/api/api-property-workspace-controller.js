const Workspace = require("../../models/Workspace");

async function getPropertyWorkspaceById(req, res) {
  try {
    const property_id = req.params.id; // giữ type string giống property_id trong DB

    // Tìm tất cả workspace của property này
    const workspaces = await Workspace.find({ property_id });

    if (!workspaces || workspaces.length === 0) {
      return res
        .status(404)
        .json({ error: `Workspaces for property ID ${property_id} don't exist` });
    }

    // Gửi về frontend
    res.json(workspaces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error." });
  }
}

module.exports = getPropertyWorkspaceById;
