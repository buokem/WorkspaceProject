const fs = require('fs').promises;
const path = require('path');

async function getPropertyWorkspaceById(req, res) {
  try {
    const property_id = parseInt(req.params.id);

    const databaseFilePath = path.join(__dirname, "../../data/database.json");
    const rawContent = await fs.readFile(databaseFilePath, 'utf-8');
    const content = JSON.parse(rawContent);

    //get workspace data
    const data = content.workspaceData.filter(element => element.property_id === property_id);
    if (!data) {
      throw new Error(`Workspace with ID ${property_id} doesn't exist`);
    }

    //send to frontend
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
}

module.exports = getPropertyWorkspaceById;