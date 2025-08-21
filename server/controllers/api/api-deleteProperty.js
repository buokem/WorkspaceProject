const Property = require("../../models/Property");

async function deleteProperty(req, res) {
  try {
    const id = req.body.id;

    if (!id) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    const deleted = await Property.findOneAndDelete({ _id: id });

    if (!deleted) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    return res.status(200).json({
      message: "Delete successful",
      deletedProperty: deleted,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to delete Property",
      error: err.message || "Server error.",
    });
  }
}

module.exports = deleteProperty;
