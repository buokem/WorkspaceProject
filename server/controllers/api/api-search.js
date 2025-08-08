const fs = require('fs').promises;
const path = require('path');

async function getSearchData(req, res) {

    try{
        const searchQuery = req.query.query;
        const databaseFilePath = path.join(__dirname, "../../data/database.json");
        
        let content = await fs.readFile(databaseFilePath, 'utf-8');
        content = JSON.parse(content);

        //get address for each property
        const pMap = new Map();
        let properties = content["propertyData"];
        properties.forEach(p => {
            if(!pMap.has(p.property_id)){
                pMap.set(p.property_id, `${p.Address_line1}, ${p.city}, ${p.province}`)
            }
        });

        let workspaces = content["workspaceData"];
        let searchResult = [];
        workspaces.forEach(el => {
            el["Address"] = pMap.get(el.property_id);
            //if workspace name has search string, return workspace
            if(el.name.toLowerCase().includes(searchQuery.toLowerCase())) searchResult.push(el);
            else if(el["Address"].toLowerCase().includes(searchQuery.toLowerCase())) searchResult.push(el);
        });

        if(searchResult.length > 4) {
            searchResult = searchResult.slice(0, 4);
        }


        res.json(searchResult);
    }
    catch(err) {
        console.error(err);
    }
    
}

module.exports = getSearchData