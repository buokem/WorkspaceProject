document.addEventListener('DOMContentLoaded', async () => {
    //change this to get token
    let appData = await fetchApi('api/database');

    appData = JSON.parse(appData);

    const {workspaceData, propertyData, facilityData, workspaceFacility, propertyFacility} = appData;

    const workspaceMap = createWorkspaceMap(workspaceData);

    const propertyFacilityMap = createPropertyFacilityMap(propertyFacility);

    const workspaceFacilityMap = createWorkspaceFacilityMap(workspaceFacility);
    
    let cardParent = grabHtmlByID('content');
    let searchInput = grabHtmlByID(`search-input`);
    let seatInput = grabHtmlByID('seat-input');
    let publicTransportSelect = grabHtmlByID('public-transport-select');
    let smokingSelect = grabHtmlByID('smoking-select');
    let availableSelect = grabHtmlByID('available-select');
    let parkingSelect = grabHtmlByID('parking-select');
    let minPrice = grabHtmlByID('min-price');
    let maxPrice = grabHtmlByID('max-price');
    let minSize = grabHtmlByID('min-size');
    let maxSize = grabHtmlByID('max-size');
    let leaseSelect = grabHtmlByID('lease-select');
    const filterTab = document.querySelector('.filter-tab');

    buildCards(workspaceData, cardParent);

    function propertyFilter(properties,searchInput,checkedFacilities,propertyFacilityMap) {
        // 1) Text‐search
        const term = searchInput.trim().toLowerCase();
        //if searchInput is an empty string, return all properties, else match string with full address of each property and return only matches
        const matched = term === ''
            ? properties
            : properties.filter(p =>
                (`${p.Address_line1} ${p.city} ${p.province}`).toLowerCase().includes(term)
            );

        //if matched is an empty array, just return [];
        if(matched.length === 0){
            return [];
        }

        // Else, we extract just the IDs from the returned array
        const matchedIds = matched.map(p => p.property_id);

        // 2) Facility filter: if no checked boxes, return all matched IDs array
        if (!checkedFacilities.length) {
            return matchedIds;
        }

        //Build an array that contains a set of each property with a particular facility(in this case -- parking and publicTransport)
        const facilitySets = checkedFacilities.map(fid =>
            new Set(propertyFacilityMap.get(fid) || [])//fallback to empty array if key isn't in propertyFacilityMap
        );

        // Keep only IDs that appear in *every* facility set (intersection of both sets)
        return matchedIds.filter(id =>
            facilitySets.every(set => set.has(id))
        );
    }

    function createWorkspaceMap(workspaces){
        //we create a map of property -> workspaces
        const workspaceMap = new Map();

        workspaces.forEach(ws => {
            const key = ws.property_id
            //create map key if map doesn't have such key
            if(!workspaceMap.has(key)) {
                workspaceMap.set(key, [])
            }

            workspaceMap.get(key).push(ws)
        });

        return workspaceMap;
    }

    function createWorkspaceFacilityMap(workspaceFacility) {
        const workspaceFacilityMap = new Map();

        workspaceFacility.forEach(pf => {
            const key = pf.facility_id

            if(!workspaceFacilityMap.has(key)){
                workspaceFacilityMap.set(key, [])
            }

            workspaceFacilityMap.get(key).push(pf.workspace_id)
        });

        return workspaceFacilityMap;
    }

    function createPropertyFacilityMap(propertyFacility) {
        const propertyFaciltyMap = new Map();

        propertyFacility.forEach(pf => {
            const key = pf.facility_id

            if(!propertyFaciltyMap.has(key)){
                propertyFaciltyMap.set(key, [])
            }

            propertyFaciltyMap.get(key).push(pf.property_id)
        });

        return propertyFaciltyMap;
    }

    function getWorkspaceOfProperties(propertyIDs) {
        const matchedWorkspaces = [];

        propertyIDs.forEach(id => {
            const arr = workspaceMap.get(id) || [];
            // push each element from arr into matchedWorkspaces:
            matchedWorkspaces.push(...arr);
        });

        return matchedWorkspaces;
    }

    //for size and price
    function filterRange(data, min, max, property) {
        if(min === "") min = 0;
        if(max === "") max = Infinity;

        min = Number(min);
        max = Number(max);

        return data.filter(ws => {
            return ws[property] >= min && ws[property] <= max 
        });
    }

    //for seats
    function filterValue(data, val, property) {
        //change input to number
        val = Number(val);

        return data.filter(ws => {
            return ws[property] >= val
        });
    }

    //for lease
    function filterDropDown(data, selectParent, property){
        if(selectParent.selectedIndex !== 0) {
            const selectedOption = selectParent.options[selectParent.selectedIndex];
            const minNumber = parseInt(selectedOption.dataset.min);
            const maxNumber = parseInt(selectedOption.dataset.max);

            return data.filter(ws => {
                return ws[property] >= minNumber && ws[property] <= maxNumber
            });
        }
        return data;
    }

    //for facilities
    function filterChecks(data, checkboxes){
        if(checkboxes.length !== 0){
            const facilitySets = checkboxes.map(fid => {
                new Set(workspaceFacilityMap.get(fid) || []);
            });
            return data.filter(ws => {
                return facilitySets.every(set => ws.workspace_id)
            });
        }
        return data
    }

    //filter workspaces
    function filterWorkspaces(workspaces, checkboxes){
        //filter price
        const filteredPrice = filterRange(workspaces, minPrice.value, maxPrice.value, 'rate');
        console.log(filteredPrice);
        if(filteredPrice.length === 0) return[];

        //filter size
        const filteredSize = filterRange(filteredPrice, minSize.value, maxSize.value, 'size');
        console.log(filteredSize);
        if(filteredSize.length === 0) return[];

        //filter seats
        const filteredSeats = filterValue(filteredSize, seatInput.value, 'capacity');
        console.log(filteredSeats);
        if(filteredSeats.length === 0) return [];

        //filter lease
        const filteredDD = filterDropDown(filteredSeats, leaseSelect, 'lease_period');
        console.log(filteredDD);
        if(filteredDD.length === 0) return [];

        //filter checks
        const filteredChecks = filterChecks(filteredDD, checkboxes);
        console.log(filteredChecks)
        if(filteredChecks.length === 0) return [];

        //return last
        return filteredChecks;
    }


    function grabHtmlByID(id){
        return document.getElementById(id)
    }

    function buildCards(data, parent){
        parent.innerHTML = ``
        //no items match your search
        data.forEach(ws => {
            const workspaceProperty = propertyData.find(p => p.property_id === ws.property_id);
            const div = document.createElement('div')
            div.classList.add('card');
            div.innerHTML =
            `
                <div class="card-image">
                    <img src=${ws.pictures[0]} alt="">
                </div>
                <div class="card-content">
                    <div class="content-part-1">
                        <div class="price-holder content-holder">
                            <p>$<span>${ws.rate}</span></p>
                            <span class="extra-text">per hour</span>
                        </div>
                        <div class="address-holder content-holder">
                            <p>${workspaceProperty.Address_line1}</p>
                            <span class="extra-text">${workspaceProperty.city}, ${workspaceProperty.province}, ${workspaceProperty.postal_code}</span>
                        </div>
                    </div>
                    <div class="content-part-2">
                        <div class="ws-desc">
                            <div class="ws-size">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <!-- square outline -->
                                    <rect x="3" y="3" width="18" height="18" />
                                    <!-- diagonal measurement arrow -->
                                    <path d="M7 17 L17 7" />
                                    <polyline points="14,7 17,7 17,10" />
                                    <polyline points="7,14 7,17 10,17" />
                                </svg>
                                <span><pre>${ws.size} </pre></span>
                                <span>sq ft</span>
                            </div>
                            <div class="ws-seats">
                                <svg width="18" height="18" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4">
                                    <circle cx="22" cy="20" r="8" />
                                    <circle cx="42" cy="20" r="8" />
                                    <rect x="14" y="36" width="36" height="16" rx="4" />
                                    <text x="50" y="60" fill="currentColor" font-size="12">#</text>
                                </svg>
                                <span>${ws.capacity}</span>
                                <span>seats</span>
                            </div>
                        </div>
                        <button class="rounded-button view-details" data-id=${ws.workspace_id}>
                            View Details
                        </button>
                    </div>
                </div>
            `
            parent.appendChild(div);
        })
    }

    
    async function getCoWorkerView(id){
        await fetchApi(`/coworkerview/${id}`);
    }

    //event listeners
    filterTab.addEventListener('click', (e)=> {
        if(e.target.matches('#filter-btn')){
            const propertyCheckboxes = [];
            const workspaceCheckboxes = [];
            //check which checkboxes where checked
            if(parkingSelect.checked){
                propertyCheckboxes.push(1);
            }
            if(publicTransportSelect.checked){
                propertyCheckboxes.push(2);
            }
            if(smokingSelect.checked){
                workspaceCheckboxes.push(4);
            }
            //filter properties first
            const selectedProperties = propertyFilter(propertyData, searchInput.value, propertyCheckboxes, propertyFacilityMap);
            //get all workspaces that are in those filtered properties
            const selectedWorkspaces = getWorkspaceOfProperties(selectedProperties);
            //filter workspaces
            const filteredWorkspaces = filterWorkspaces(selectedWorkspaces, workspaceCheckboxes);

            buildCards(filteredWorkspaces, cardParent);

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth' 
            });

            console.log(selectedProperties, selectedWorkspaces, filteredWorkspaces);
        }
    });

    document.addEventListener('click', (e) => {
        if(e.target.matches('.view-details')){
            const id = e.target.dataset.id;
            getCoWorkerView(id);
        }
    })

    //api's
    //get coWorkerData
    async function fetchApi(API) {
        try {
            const token = localStorage.getItem('watchSpaceToken');
            const response = await fetchData(API, token);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();

            return data;
        } catch (err) {
            console.error('Fetch failed:', err.message);
        }
    }

    async function fetchData(route, token) {
        const response = await fetch(
            route,
            {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }
        );
        return response
    }
})

