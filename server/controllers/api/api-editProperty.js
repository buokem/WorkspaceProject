const path = require('path');
const fs = require('fs').promises;

async function editProperty(req, res){
    try{
        console.log(req.files, req.body, req.user);

        const pictures = null;

        //extract edited body from req.body
        const {
            'p-name': name,
            'p-street': street,
            'p-city': city,
            'p-province': province,
            'p-postal': postal,
            'p-size': size,
            'p-transport': transport,
            'p-available': available,
            'p-parking': parking,
            property_id
        } = req.body;

        //extract new pictures from req.files
        if(req.files.length !== 0){
            const newArray = req.files.map(file => "/"+file.filename);
            pictures = [...newArray];
        }

        console.log(property_id);

        //connect to database
        const databaseFilePath = path.join(__dirname, "../../data/database.json");
        let content = await fs.readFile(databaseFilePath, 'utf-8');
        content = JSON.parse(content);

        //find property with that id
        const propertyFound = content.propertyData.findIndex(p => p.property_id === Number(property_id));

        if(propertyFound === -1) throw new Error(`No property with id: ${property_id}`);

        //fill in edited properties
        const toBeEdited = content.propertyData[propertyFound];

        console.log("Before edit: ", toBeEdited);

        toBeEdited.name = name;
        toBeEdited.Address_line1 = street;
        toBeEdited.city = city;
        toBeEdited.province = province;
        toBeEdited.postal_code = postal;
        toBeEdited.total_area = size;
        toBeEdited.available = available === "on" ? true :  false;
        if(pictures) toBeEdited.pictures = pictures;
        toBeEdited.updatedAt = new Date().toISOString();

        console.log("Final:", toBeEdited);

        //grab propertyFacilities without current facility id
        const propertyFacilityArray = content.propertyFacility.filter(pf => pf.property_id !== Number(property_id));

        //if transport/parking is on, we append
        //if not then it has been removed already
        if(transport === "on"){
            createNewPropertyFacility(Number(property_id), 2, propertyFacilityArray)
        }

        if(parking === "on"){
            createNewPropertyFacility(Number(property_id), 1, propertyFacilityArray)
        }

        console.log(content.propertyFacility, propertyFacilityArray);

        //write to database

        //property -- just slot it in its index
        content.propertyData[propertyFound] = toBeEdited;

        //propertyFacility -- replace it
        content.propertyFacility = [...propertyFacilityArray];
        
        await fs.writeFile(databaseFilePath, JSON.stringify(content, null, 2), 'utf8');

        console.log("Found it:", propertyFound);

        return res.status(200).json({
            message: "Edit successful",
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Failed to edit Property",
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

module.exports = editProperty