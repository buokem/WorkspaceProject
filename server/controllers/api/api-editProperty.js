const Property = require("../../models/Property");
const PropertyFacility = require("../../models/PropertyFacility");
const Facility = require("../../models/Facility");

async function editProperty(req, res) {
  try {
    console.log(req.files, req.body, req.user);

    let pictures = null;

    // Destructure edited body
    const {
      "p-name": name,
      "p-street": street,
      "p-city": city,
      "p-province": province,
      "p-postal": postal,
      "p-size": size,
      "p-transport": transport,
      "p-available": available,
      "p-parking": parking,
      property_id,
    } = req.body;

    // Extract new pictures
    if (req.files && req.files.length !== 0) {
      pictures = req.files.map(file => "/" + file.filename);
    }

    // Find property by property_id
    const property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({ message: `No property with id: ${property_id}` });
    }

    // Update fields
    property.name = name;
    property.Address_line1 = street;
    property.city = city;
    property.province = province;
    property.postal_code = postal;
    property.total_area = size;
    property.available = available === "on";
    if (pictures) property.pictures = pictures;
    property.updated_at = new Date();

    await property.save();

    // --- Handle PropertyFacility ---
    // Remove all existing facilities for this property
    await PropertyFacility.deleteMany({ property_id });

    // Add new facilities if needed
    const propertyFacilityArray = [];

    if (transport === "on") {
      const transportFacility = await Facility.findOne({ name: "Public Transport" });
      if (transportFacility) {
        propertyFacilityArray.push(
          new PropertyFacility({
            property_id,
            facility_id: transportFacility._id,
            created_at: new Date(),
            updated_at: new Date(),
          })
        );
      }
    }

    if (parking === "on") {
      const parkingFacility = await Facility.findOne({ name: "Parking" });
      if (parkingFacility) {
        propertyFacilityArray.push(
          new PropertyFacility({
            property_id,
            facility_id: parkingFacility._id,
            created_at: new Date(),
            updated_at: new Date(),
          })
        );
      }
    }

    if (propertyFacilityArray.length > 0) {
      await PropertyFacility.insertMany(propertyFacilityArray);
    }

    return res.status(200).json({ message: "Edit successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to edit Property",
      error: err.message || "Server error.",
    });
  }
}

module.exports = editProperty;
