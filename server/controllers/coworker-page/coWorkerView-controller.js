const path = require('path');

async function loadWorkspaceView(req, res) {
  try {
    res.sendFile(path.resolve(__dirname, '../../../client/coWorkerView.html'));
    console.log("File sent successfully!");
  }
  catch (err) {
    console.error("Error sending file: ", err);
    res.status(500).send("Server error");
    console.error(err)
  }
}

module.exports = loadWorkspaceView;