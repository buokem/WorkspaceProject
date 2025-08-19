const path = require('path');
const fs = require('fs').promises;

async function deleteProperty(req, res) {
    try {
        const id = Number(req.body.id);

        //connect to database
        const databaseFilePath = path.join(__dirname, "../../data/database.json");
        let content = await fs.readFile(databaseFilePath, 'utf-8');
        content = JSON.parse(content);

        //remove property with property_id === id from array
        const withoutArray = content.propertyData.filter(p => p.property_id !== id);

        //if still same length then nothing was removed
        //send error
        if (withoutArray.length === content.propertyData.length) {
            console.log("Nothing was deleted");
            return res.status(404).json({
                message: "Property not found"
            });
        }

        //append new array to propertyData
        content.propertyData = [...withoutArray];

        //save to db
        await fs.writeFile(databaseFilePath, JSON.stringify(content, null, 2), 'utf8');

        return res.status(200).json({
            message: "Delete successful",
        });

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to delete Property",
            error: err.message || 'Server error.' 
        });
    }

}

module.exports = deleteProperty