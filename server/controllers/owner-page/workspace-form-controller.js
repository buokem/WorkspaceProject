
const path = require('path')

async function getWorkspaceForm(req, res) {
    console.log("requested")
    try{
        res.sendFile(path.resolve(__dirname, '../../../client/workspace-form.html'));
        console.log("File sent successfully!");
    }
    catch(err){
        console.error("Error sending file: ", err);
        res.status(500).send("Server error");
        console.error(err)
    }
}


module.exports = getWorkspaceForm

