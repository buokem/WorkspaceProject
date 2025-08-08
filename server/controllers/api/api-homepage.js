const fs = require('fs').promises;
const path = require('path');

async function getFourData(req, res) {
    //get data.json file
    try{
        const databaseFilePath = path.join(__dirname, "../../data/database.json");

        let content = await fs.readFile(databaseFilePath, 'utf-8');
        content = JSON.parse(content);

        //get address for each property
        const pMap = new Map();
        let properties = content["propertyData"];
        properties.forEach(p => {
            if(!pMap.has(p.property_id)){
                pMap.set(p.property_id, p.Address_line1)
            }
        });

        //get four workspace data and append their address to it
        let workspaces = content["workspaceData"].slice(0, 4);
        workspaces.forEach(el => {
            el["Address"] = pMap.get(el.property_id);
        });

        res.json(workspaces);
    }
    catch(err){
        console.error(err);
    }
}

module.exports = getFourData;