const path = require('path');
const fs = require('fs').promises;

async function getWorkspacesForProperty(req, res) {
    console.log(req.user, req.query);
    const property_id = Number(req.query.propID);
    const owner_id = req.user.id;

    //connect database
    const databaseFilePath = path.join(__dirname, "../../data/database.json");
    const rawContent = await fs.readFile(databaseFilePath, 'utf-8');
    const content = JSON.parse(rawContent);

    //find property with that id and also with the same owner id
    const propertyFound = content.propertyData.find(p => p.property_id === property_id && p.owner_id === owner_id);

    console.log(propertyFound);

    if(!propertyFound) return res.status(404).json({
        message: "Cannot access workspaces"
    });

    const workspaces = content.workspaceData.filter(ws => ws.property_id === property_id);
    
    console.log(workspaces);

    workspaces.forEach(ws => {
        let facilities = content.workspaceFacility.filter(fc => fc.workspace_id === ws.workspace_id);
        ws["Facilities"] = facilities;
        ws["address"] = propertyFound.Address_line1;
        ws["city"] = propertyFound.city;
        ws["province"] = propertyFound.province;
        ws["postal_code"] = propertyFound.postal_code
    });


    //if no workspace, i want you to redirect them to create a workspace
    return res.status(200).json({workspaces});

}

module.exports = getWorkspacesForProperty