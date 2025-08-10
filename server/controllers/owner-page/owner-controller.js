
const path = require('path')

async function getOwnerPage(req, res) {
    console.log("requested")
    try{
        res.sendFile(path.resolve(__dirname, '../../../client/owner-main.html'));    
        console.log("File sent successfully!");
    }
    catch(err){
        console.error("Error sending file: ", err);
        res.status(500).send("Server error");
        console.error(err)
    }
}


module.exports = getOwnerPage

