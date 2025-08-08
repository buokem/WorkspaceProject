
const path = require('path')

async function getLandingPage(req, res) {
    try{
        res.sendFile(path.resolve(__dirname, '../../../client/index.html'));
        console.log("File sent successfully!");
    }
    catch(err){
        console.error("Error sending file: ", err);
        res.status(500).send("Server error");
    }
}


module.exports = getLandingPage

