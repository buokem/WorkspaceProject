const Property = require("../../models/Property");
const PropertyFacility = require("../../models/PropertyFacility");
const Facility = require("../../models/Facility");

async function createProperty(req, res) {
  try {
    // Pictures array (relative paths)
    const pictures = req.files.map(file => "/" + file.filename);

    // Extract owner_id from req.user
    const owner_id = req.user.id;

    // Destructure body
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
    } = req.body;

    // Build property document
    const propertyData = new Property({
      owner_id,
      name,
      Address_line1: street,
      city,
      province,
      postal_code: postal,
      total_area: size,
      num_rooms: 4,
      available: available === "on",
      pictures,
    });

    // Save property
    await propertyData.save();
    const propertyID = propertyData._id;

    // Facilities
    const propertyFacilityArray = [];

    if (transport === "on") {
      const transportFacility = await Facility.findOne({ name: "Public Transport" });
      if (transportFacility) {
        propertyFacilityArray.push(
          new PropertyFacility({
            property_id: propertyID,
            facility_id: transportFacility._id,
          })
        );
      }
    }

    if (parking === "on") {
      const parkingFacility = await Facility.findOne({ name: "Parking" });
      if (parkingFacility) {
        propertyFacilityArray.push(
          new PropertyFacility({
            property_id: propertyID,
            facility_id: parkingFacility._id,
          })
        );
      }
    }

    if (propertyFacilityArray.length > 0) {
      await PropertyFacility.insertMany(propertyFacilityArray);
    }

    return res.status(201).json({
      message: "Property Created",
      property_id: propertyID,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to create Property",
      error: err.message || "Server error.",
    });
  }
}

module.exports = createProperty;
