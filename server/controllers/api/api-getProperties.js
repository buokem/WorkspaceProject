const Property = require("../../models/Property");
const PropertyFacility = require("../../models/PropertyFacility");

async function getProperties(req, res) {
  try {
    const ownerId = req.params.id;

    // Lấy tất cả property của owner
    const properties = await Property.find({ owner_id: ownerId });

    if (!properties || properties.length === 0) {
      return res
        .status(404)
        .json({ error: `Properties with owner id ${ownerId} don't exist` });
    }

    // Lấy property facilities cho mỗi property
    const dataWithFacilities = await Promise.all(
      properties.map(async property => {
        const facilities = await PropertyFacility.find({ property_id: property._id }).populate('facility_id');
        return {
          ...property.toObject(),
          Facilities: facilities,
        };
      })
    );

    console.log(dataWithFacilities);
    res.json(dataWithFacilities);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
}

module.exports = getProperties;
