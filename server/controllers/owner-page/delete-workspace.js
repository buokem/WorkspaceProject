const path = require('path');
const fs = require('fs').promises;

async function deleteWorkspace(req, res) {
    try {
        const id = Number(req.body.id);
        const propertyID = req.query.propertyID;

        //connect to database
        const databaseFilePath = path.join(__dirname, "../../data/database.json");
        let content = await fs.readFile(databaseFilePath, 'utf-8');
        content = JSON.parse(content);

        //check if they can access
        const propertyFound = content.propertyData.find(p => p.property_id === Number(propertyID) && p.owner_id === req.user.id);

        console.log(propertyFound);
        //no? return 
        if (!propertyFound) return res.status(404).json({ message: "Can't access data" });

        //remove property with property_id === id from array
        const withoutArray = content.workspaceData.filter(ws => ws.workspace_id !== id);

        //if still same length then nothing was removed
        //send error
        if (withoutArray.length === content.workspaceData.length) {
            console.log("Nothing was deleted");
            return res.status(404).json({
                message: "Property not found"
            });
        }

        //append new array to propertyData
        content.workspaceData = [...withoutArray];

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

module.exports = deleteWorkspace;