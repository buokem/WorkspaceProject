const path = require('path');
const fs = require('fs').promises;

async function getProperties(req, res) {
    try {
        const id = req.params.id;
        const databaseFilePath = path.join(__dirname, "../../data/database.json");
        const rawContent = await fs.readFile(databaseFilePath, 'utf-8');
        const content = JSON.parse(rawContent);

        const data = content.propertyData.filter(element => element.owner_id === id);

        if (data.length === 0) {
            throw new Error(`Properties with id ${id} doesn't exist`);
        }

        //we have propertyData, we want to add property facility for each propertyData
        data.forEach(pData => {
            let facilities = content.propertyFacility.filter(fc => fc.property_id === pData.property_id);
            pData["Facilities"] = facilities;
        });

        //send to frontend
        console.log(data);
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: err.message });
    }
}

module.exports = getProperties;