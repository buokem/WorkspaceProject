const fs = require('fs').promises;
const path = require('path');

async function getWorkspaceById(req, res) {
  try {
    const id = parseInt(req.params.id);

    const databaseFilePath = path.join(__dirname, "../../data/database.json");
    const rawContent = await fs.readFile(databaseFilePath, 'utf-8');
    const content = JSON.parse(rawContent);

    //get workspace data
    const data = content.workspaceData.find(element => element.workspace_id === id);
    if (!data) {
      throw new Error(`Workspace with ID ${id} doesn't exist`);
    }

    //get property id of workspace
    const propertyID = data.property_id;

    //get workspace address
    let address;
    for(const item of content.propertyData){
      if(item.property_id === propertyID){
        address = `${item.Address_line1 }, ${item.city}, ${item.province}, ${item.postal_code}`;
      }
    }

    //get workspace facilities
    const wsFacility = []
    for(const item of content.workspaceFacility){
      if(item.workspace_id === id){
        wsFacility.push(item.facility_id);
      }
    }

    //get property facilities
    const pFacility = []
    for(const item of content.propertyFacility){
      if(item.property_id === propertyID){
        pFacility.push(item.facility_id);
      }
    }

    //append to data Object
    data["address"] = address;
    data["wsFacility"] = wsFacility;
    data["pFacility"] = pFacility;

    //send to frontend
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
}

module.exports = getWorkspaceById;