const fs = require('fs').promises;
const path = require('path');


async function getAuthPage(req, res) {
    try {
        res.sendFile(path.resolve(__dirname, '../../../client/signin-signup.html'));
        console.log("File sent successfully!");
    }
    catch (err) {
        console.error("Error sending file: ", err);
        res.status(500).send("Server error");
    }
}

module.exports = getAuthPage