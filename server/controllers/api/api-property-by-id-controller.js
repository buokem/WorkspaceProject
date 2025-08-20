const Property = require("../../models/Property");

async function getPropertyById(req, res) {
  try {
    const id = req.params.id;

    // Tìm property theo property_id
    const property = await Property.findOne({ _id: id });

    if (!property) {
      return res
        .status(404)
        .json({ error: `Property with ID ${id} doesn't exist` });
    }

    // Gửi về frontend
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error." });
  }
}

module.exports = getPropertyById;
