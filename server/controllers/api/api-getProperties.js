const Property = require("../../models/Property");
const PropertyFacility = require("../../models/PropertyFacility");

async function getProperties(req, res) {
  try {
    const ownerId = req.params.id;
    const user = req.user;

    const properties = await Property.find({ owner_id: ownerId });

    if (!properties || properties.length === 0) {
      return res
        .status(404)
        .json({ error: `Properties with owner id ${ownerId} don't exist` });
    }

    const dataWithFacilities = await Promise.all(
      properties.map(async property => {
        const facilities = await PropertyFacility.find({ property_id: property._id }).populate('facility_id');
        return {
          ...property.toObject(),
          Facilities: facilities,
        };
      })
    );

    res.json({dataWithFacilities, user});
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
}

module.exports = getProperties;
