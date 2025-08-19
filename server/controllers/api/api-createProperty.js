const path = require('path');
const crypto = require('crypto');
const fs = require('fs').promises;

async function createProperty(req, res) {
    try {
        console.log(req.files, req.body, req.user);

        //connect to database
        const databaseFilePath = path.join(__dirname, "../../data/database.json");
        let content = await fs.readFile(databaseFilePath, 'utf-8');
        content = JSON.parse(content);

        //set propertyID using length of propertyData array
        const propertyID = crypto.randomUUID();

        //create array of pictures path
        const pictures = req.files.map(file => "/"+file.filename);

        //extract owner_id using id from req.user
        const owner_id = req.user.id;

        const {
            'p-name': name,
            'p-street': street,
            'p-city': city,
            'p-province': province,
            'p-postal': postal,
            'p-size': size,
            'p-transport': transport,
            'p-available': available,
            'p-parking': parking
        } = req.body;

        //build data
        const propertyData = {
            property_id: propertyID,
            owner_id: owner_id,
            name: name,
            Address_line1: street,
            city: city,
            province: province,
            postal_code: postal,
            total_area: size,
            num_rooms: 4,
            available: available === 'on' ? true : false,
            pictures: pictures,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        //build facilityArray
        const propertyFacilityArray = [];

        if (transport === "on") {
            createNewPropertyFacility(propertyID, 2, propertyFacilityArray);
        }

        if (parking === "on") {
            createNewPropertyFacility(propertyID, 1, propertyFacilityArray);
        }

        //write to database
        content.propertyData.push(propertyData);

        if (propertyFacilityArray.length !== 0) {
            propertyFacilityArray.forEach(pf => content.propertyFacility.push(pf));
        }

        await fs.writeFile(databaseFilePath, JSON.stringify(content, null, 2), 'utf8');

        return res.status(201).json({
            message: "Property Created",
        })

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to create Property",
            error: err.message || 'Server error.' 
        });
    }


    function createNewPropertyFacility(propertyID, facilityID, propertyFacilityArray) {
        const newPropertyFacility = {
            property_id: propertyID,
            facility_id: facilityID,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        propertyFacilityArray.push(newPropertyFacility);
    }

}


module.exports = createProperty;