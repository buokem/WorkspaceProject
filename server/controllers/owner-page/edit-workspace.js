const path = require('path');
const fs = require('fs').promises;

async function editWorkspace(req, res) {
    try {
        console.log(req.files, req.body, req.user);

        const propertyID = req.query.propertyID;

        //connect to database
        const databaseFilePath = path.join(__dirname, "../../data/database.json");
        let content = await fs.readFile(databaseFilePath, 'utf-8');
        content = JSON.parse(content);

        //check if they can access
        const propertyFound = content.propertyData.find(p => p.property_id === Number(propertyID) && p.owner_id === req.user.id);

        console.log(propertyFound);
        //no? return 
        if (!propertyFound) return res.status(404).json({ message: "Can't access data" });

        const pictures = null;

        //extract edited body from req.body
        const {
            name,
            desc,
            seats,
            price,
            size,
            lease,
            smoking,
            whiteboard,
            projector,
            microphone,
            available,
            workspace_id
        } = req.body

        //extract new pictures from req.files
        if (req.files.length !== 0) {
            const newArray = req.files.map(file => "/" + file.filename);
            pictures = [...newArray];
        }

        //find workspace with that id
        const workspaceFound = content.workspaceData.findIndex(ws => ws.workspace_id === Number(workspace_id));

        if (workspaceFound === -1) return res.status(404).json({ message: `No workspace with id ${workspace_id}` });

        //fill in edited properties
        const toBeEdited = content.workspaceData[workspaceFound];

        console.log("Before edit: ", toBeEdited);

        toBeEdited.name = name;
        toBeEdited.size = Number(size);
        toBeEdited.capacity = Number(seats);
        toBeEdited.rate = Number(price);
        if (pictures) toBeEdited.pictures = pictures;
        toBeEdited.description = desc;
        toBeEdited.lease = lease;
        toBeEdited.available = available === "on" ? true : false;
        toBeEdited.updated_at = new Date().toISOString();

        console.log("Final:", toBeEdited);

        //grab propertyFacilities without current facility id
        const workspaceFacilityArray = content.workspaceFacility.filter(wsf => wsf.workspace_id !== Number(workspace_id));

        if (smoking === "on") {
            createNewPropertyFacility(Number(workspace_id), 4, workspaceFacilityArray);
        }

        if (projector === "on") {
            createNewPropertyFacility(Number(workspace_id), 5, workspaceFacilityArray);
        }

        if (microphone === "on") {
            createNewPropertyFacility(Number(workspace_id), 6, workspaceFacilityArray);
        }

        if (whiteboard === "on") {
            createNewPropertyFacility(Number(workspace_id), 7, workspaceFacilityArray);
        }

        //write to database

        //workspace -- just slot it in its index
        content.workspaceData[workspaceFound] = toBeEdited;

        //propertyFacility -- replace it
        content.workspaceFacility = [...workspaceFacilityArray];
        
        await fs.writeFile(databaseFilePath, JSON.stringify(content, null, 2), 'utf8');

        console.log("Found it:", workspaceFound);

        return res.status(200).json({
            message: "Edit successful",
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to edit workspace",
            error: err.message || 'Server error.' 
        });
    }

    function createNewPropertyFacility(workspaceID, facilityID, workspaceFacilityArray) {
        const newPropertyFacility = {
            workspace_id: workspaceID,
            facility_id: facilityID,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        workspaceFacilityArray.push(newPropertyFacility);
    }
}

module.exports = editWorkspace