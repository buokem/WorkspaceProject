
document.addEventListener('DOMContentLoaded', async ()=> {

    const appData = await getData();

    console.log(appData)

    const userInfo = JSON.parse(sessionStorage.getItem("watchspaceUser"));

    const userName = userInfo.email.split("@")[0];
    document.getElementById("coworker-name").innerText = userName;
    document.getElementById("initial").innerText = userName[0].toUpperCase();

    const facilityName = {
        "Parking": [
            "Parking",
            `<svg width="24" height="24" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4">
                <rect x="4" y="4" width="56" height="56" />
                <text x="18" y="44" fill="currentColor" font-size="36" font-family="Arial, sans-serif">P</text>
            </svg>` 
        ],
        "Public Transport": [
            "Public Transport",
            `<svg width="24" height="24" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4">
                <rect x="4" y="16" width="56" height="32" />
                <circle cx="18" cy="52" r="6" />
                <circle cx="46" cy="52" r="6" />
                <rect x="20" y="24" width="24" height="12" />
            </svg>` 
        ],
        "WiFi":[
            "Wi-Fi",
            ''
        ],
        "Smoking":[
            "Smoking",
            `<svg width="24" height="24" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4">
                <rect x="2" y="28" width="40" height="8" />
                <rect x="42" y="28" width="12" height="8" fill="currentColor" />
                <path d="M54 24c0 4-4 4-4 0s4-4 4 0
                    M58 20c0 4-4 4-4 0s4-4 4 0" />
            </svg>`
        ],
        "Projector":[
            "Projector",
            `<svg width="24" height="24" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4">
                <rect x="2" y="16" width="44" height="32" />
                <circle cx="54" cy="32" r="6" />
                <rect x="46" y="26" width="4" height="12" fill="currentColor" />
            </svg>`
        ],
        "Microphone":[
            "Microphone",
            `<svg width="24" height="24" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4">
                <rect x="26" y="12" width="12" height="28" rx="6" />
                <line x1="32" y1="40" x2="32" y2="54" />
                <line x1="22" y1="54" x2="42" y2="54" />
            </svg>`
        ],
        "Whiteboard":[
            "WhiteBoard",
            `<svg width="24" height="24" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4">
                <rect x="4" y="8" width="48" height="32" />
                <line x1="16" y1="44" x2="16" y2="60" />
                <line x1="36" y1="44" x2="36" y2="60" />
            </svg>`
        ],
        seat:`<svg width="24" height="24" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4">
            <circle cx="22" cy="20" r="8" />
            <circle cx="42" cy="20" r="8" />
            <rect x="14" y="36" width="36" height="16" rx="4" />
            <text x="50" y="60" fill="currentColor" font-size="12">#</text>
        </svg>`,
        size: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <!-- square outline -->
            <rect x="3" y="3" width="18" height="18" />
            <!-- diagonal measurement arrow -->
            <path d="M7 17 L17 7" />
            <polyline points="14,7 17,7 17,10" />
            <polyline points="7,14 7,17 10,17" />
        </svg>`,
    }

    document.getElementById('phone').href = `tel:+${appData.phone}`
    const mainImage = document.querySelector('.main-image')

    document.querySelector('.content-title').innerText = appData["name"];
    document.querySelector('.description-block p').innerText = appData["description"];
    mainImage.style.backgroundImage = `url(${appData["pictures"][0]})`;

    //build images
    document.querySelectorAll('.sub-image').forEach((el, i)=> {
        el.style.backgroundImage =  `url(${appData["pictures"][i]})`;

        el.addEventListener("click", (e)=> {
            mainImage.style.backgroundImage = e.currentTarget.style.backgroundImage;
        });
    });

    //build overview tags
    const overViewTags = document.querySelectorAll('.overview-block .tag');
    overViewTags[0].querySelector('.tag-icon').innerHTML = facilityName["seat"];
    overViewTags[0].querySelector('.tag-text').innerText = `${appData["capacity"]} seater`;
    if(appData["pFacility"].includes("Parking")) {
        overViewTags[1].querySelector('.tag-icon').innerHTML = facilityName["Parking"][1];
    }
    else{
        overViewTags[1].style.display = 'none';
    }
    if(appData["wsFacility"].includes("Smoking")) {
        overViewTags[2].querySelector('.tag-icon').innerHTML = facilityName["Smoking"][1];
    }
    else{
        overViewTags[2].style.display = "none";
    }

    //build address tags;
    const addressParts = document.querySelectorAll('.address-part');
    const splitAddress = appData["address"].split(',');

    addressParts.forEach((part, i) => {
        part.innerText = splitAddress[i].trim();
    });

    //build other tags;
    const otherTags = document.querySelectorAll('.details-block .tag');
    otherTags[0].querySelector('.tag-icon').innerHTML = facilityName["size"];
    otherTags[0].querySelector('.tag-text').innerText = `${appData["size"]} sq ft`;

    const tagParent = document.querySelector('.details-block .tag-holder');

    for(let i = 0; i<appData["pFacility"].length; i++) {
        const target = appData["pFacility"][i];
        createTag(tagParent, target)   
    }

    for(let i =0; i<appData["wsFacility"].length; i++) {
        const target = appData["wsFacility"][i];

        createTag(tagParent, target)
    }


    function createTag(parent, target) {
        const div = document.createElement('div');
        div.classList.add('tag');

        div.innerHTML = 
        `
            <span class="tag-icon">${facilityName[target][1]}</span>
            <span class ="tag-text">${facilityName[target][0]}</span>
        `
        parent.appendChild(div)
    }

    
    async function getData() {
        const url = window.location.href.split('/');
        const id = url[url.length - 1];

        try {
            const token = localStorage.getItem('watchSpaceToken');
            const response = await fetch(
                `/api/coworkerview/${id}`,
                {
                    method: "GET",
                    headers:{
                        'Content-Type': "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    credentials:"include"
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();

            return data;
        } catch (err) {
            console.error('Fetch failed:', err.message);
        }
    }

})