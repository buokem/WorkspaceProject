const fs = require('fs').promises;
const path = require('path');

async function getData(req, res) {
    //get data.json file
    try{
        const databaseFilePath = path.join(__dirname, "../../data/database.json");

        const content = await fs.readFile(databaseFilePath, 'utf-8');
        
        res.json(content);
    }
    catch(err){
        console.error(err);
    }
}

module.exports = getData;