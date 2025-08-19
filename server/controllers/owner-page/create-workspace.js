const fs = require('fs').promises;
const path = require('path');


async function createWorkspace(req, res) {
    try {
        console.log(req.files, req.body, req.query, req.user);
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

        //set propertyID using length of propertyData array
        const workspaceID = content.workspaceData.length + 1;

        //create array of pictures path
        const pictures = req.files.map(file => "/"+file.filename);

        //create new workspaceData 
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
        } = req.body

        const createdWorkspace = {
            workspace_id: Number(workspaceID),
            property_id: Number(propertyID),
            name: name,
            size: Number(size),
            capacity: Number(seats),
            rate: Number(price),
            pictures: pictures,
            description: desc,
            available: available === "on" ? true : false,
            lease,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        //create new workspaceFacilities
        const workspaceFacilityArray = [];

        if (smoking === "on") {
            createNewPropertyFacility(workspaceID, 4, workspaceFacilityArray);
        }

        if (projector === "on") {
            createNewPropertyFacility(workspaceID, 5, workspaceFacilityArray);
        }

        if (microphone === "on") {
            createNewPropertyFacility(workspaceID, 6, workspaceFacilityArray);
        }

        if (whiteboard === "on") {
            createNewPropertyFacility(workspaceID, 7, workspaceFacilityArray);
        }

        //write to db
        content.workspaceData.push(createdWorkspace)

        if (workspaceFacilityArray.length !== 0) {
            workspaceFacilityArray.forEach(wsf => content.workspaceFacility.push(wsf))
        }

        await fs.writeFile(databaseFilePath, JSON.stringify(content, null, 2), 'utf8');

        return res.status(201).json({
            message: "Workspace Created",
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to create Workspace",
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

module.exports = createWorkspace