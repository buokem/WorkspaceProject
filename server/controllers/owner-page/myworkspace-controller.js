
const path = require('path')

async function getMyWorkspacePage(req, res) {
    console.log("requested")
    try{
        res.sendFile(path.resolve(__dirname, '../../../client/my-workspace.html'));
        console.log("File sent successfully!");
    }
    catch(err){
        console.error("Error sending file: ", err);
        res.status(500).send("Server error");
        console.error(err)
    }
}


module.exports = getMyWorkspacePage

