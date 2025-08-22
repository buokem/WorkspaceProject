const urlParams = new URLSearchParams(window.location.search);

const typeValue = urlParams.get('type');
const idValue = urlParams.get('ownerId');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_NO_OF_FILES = 3;
const MAX_SIZE = 2 * 1024 * 1024;
let property_id = "";

document.addEventListener('DOMContentLoaded', (e) => {
    const form = document.querySelector('.form');
    const input = document.getElementById('imageInput');
    const preview = document.getElementById('preview');
    const thumbBox = document.querySelectorAll('.thumb-box');

    if(typeValue === "edit") {
        //get then delete sessionStorage reference
        const propertyData = JSON.parse(sessionStorage.getItem("propertyData"));
        console.log(propertyData);

        //clear when you submit form
        //sessionStorage.removeItem("propertyData");

        //build form with pre-filled Data
        property_id = propertyData._id
        document.getElementById("p-name").value = propertyData.name;
        document.getElementById("p-street").value = propertyData.Address_line1;
        document.getElementById("p-city").value = propertyData.city;
        document.getElementById("p-province").value = propertyData.province;
        document.getElementById("p-postal").value = propertyData.postal_code;
        document.getElementById("p-size").value = propertyData.total_area;
        preview.style.backgroundImage = `url("${propertyData.pictures[0]}")`

        if(propertyData.Facilities.length !== 0) {
            propertyData.Facilities.forEach(fc => {
                if(fc.facility_id.name === 'Parking'){
                    document.getElementById("p-parking").checked = true; 
                }
                if(fc.facility_id.name === 'Public Transport') {
                    document.getElementById("p-transport").checked = true; 
                }
            })
        }

        propertyData.pictures.forEach((pic, i) => {
            thumbBox[i].style.backgroundImage = `url("${propertyData.pictures[i]}")`
        })

        document.getElementById("p-available").checked = propertyData.available   
    }

    //edit valid files
    input.addEventListener('change', (e) => {
        //clear all preview boxes first
        preview.style.backgroundImage = 'none';
        thumbBox.forEach(t => t.style.backgroundImage = 'none')

        //grab files from file Element
        const inputEl = e.currentTarget;
        const picked = Array.from(inputEl.files);

        //filter files using size and extension type
        const filtered = picked.filter(f => {
            if (!ALLOWED_MIME_TYPES.includes(f.type)) {
                alert(`Unsupported file type: ${f.name}`);
                return false;
            }
            if (f.size > MAX_SIZE) {
                alert(`File too big: ${f.name}`);
                return false;
            }
            return true;
        });

        //accept first 3 and remove the rest
        if (filtered.length > MAX_NO_OF_FILES) {
            alert(`Max upload of ${MAX_NO_OF_FILES} files; extra files removed`);
        }

        const finalList = filtered.slice(0, MAX_NO_OF_FILES);

        const dt = new DataTransfer();

        //put image of files as backgroundImage of elements
        finalList.forEach((f, i) => {
            if (i === 0) {
                const url = URL.createObjectURL(f);
                preview.style.backgroundImage = `url("${url}")`;
                thumbBox[i].style.backgroundImage = `url("${url}")`;

                setTimeout(()=>{
                    URL.revokeObjectURL(url);
                }, 1000)
            }
            else {
                const url = URL.createObjectURL(f);
                thumbBox[i].style.backgroundImage = `url("${url}")`
                setTimeout(()=>{
                    URL.revokeObjectURL(url);
                }, 1000)
            }
            dt.items.add(f);
        });

        //save files
        inputEl.files = dt.files;
        console.log(inputEl.files, finalList);
    });

    //switch preview image
    form.addEventListener('click', (e) => {
        if (e.target.matches('.thumb-box')) {
            const thumbBoxEl = e.target;
            const imageURL = thumbBoxEl.style.backgroundImage;

            if (imageURL.startsWith('url')) {
                preview.style.backgroundImage = imageURL;
            }
        }
    });

    //submission logic
    form.addEventListener('submit', async (e) => {
        try {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            
            //add checkboxes if not present in formData
            if(!formData.has("p-parking")){
                formData.append('p-parking', 'off')
            }

            if(!formData.has("p-transport")){
                formData.append("p-transport", "off")
            }

            if(!formData.has("p-available")){
                formData.append("p-available", "off")
            }

            //iterate through the form inputs
            for (let [key, value] of formData.entries()) {
                if (typeof value === "string" && value.trim() === "") {
                    alert('All fields must be filled');
                    return;
                }
                if(key === "imageInput" && value.name.trim() === ""){
                    if(typeValue !== "edit") {
                        alert("No pictures, please add at least one");
                        return;
                    }
                }
            }

            if(typeValue === "edit") {
                //clear session storage here, no longer using it
                console.log("not sending...");
                formData.append("property_id", property_id)
                for(let [key, value] of formData.entries()){
                    console.log(key, value)
                }
                const editResponse = await createProperty(formData, "PUT");

                if(editResponse.message.toLowerCase().trim() === "edit successful"){
                    window.location.href = `/owner?id=${idValue}`
                }
                else{
                    alert("Failed to edit property, please try again")
                }

                return;
            }

            const serverResponse = await createProperty(formData, "POST");

            console.log(serverResponse);

            if(serverResponse.message.toLowerCase() === "property created"){
                window.location.href = `/owner?id=${idValue}`;
            }
            else{
                alert("Failed to create property, please try again")
            }

        }
        catch (err) {
            console.error('Post failed:', err.message);
        }
    });

    async function createProperty(propertyData, method){
        try{
            console.log("creating Property")
            const response = await fetch(
                `/api/createProperty`,
                {
                    method: `${method}`,
                    body: propertyData,
                    credentials:"include"
                }
            );

            if(!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();

            return data;
        }
        catch(err){
            console.error("Err is:", err.message);
        }
    }
})
