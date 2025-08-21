const urlParams = new URLSearchParams(window.location.search);

const typeValue = urlParams.get('type');
const idValue = urlParams.get('id');
const workspace_id = urlParams.get('ws')

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_NO_OF_FILES = 3;
const MAX_SIZE = 2 * 1024 * 1024;

document.addEventListener('DOMContentLoaded', async (e) => {
  const form = document.querySelector('.form');
  const input = document.getElementById('imageInput');
  const preview = document.getElementById('preview');
  const thumbBox = document.querySelectorAll('.thumb-box');

  if (typeValue === "edit") {
    //get then delete sessionStorage reference
    const workspaceData = JSON.parse(sessionStorage.getItem("workspaceData"));
    console.log(workspaceData);

    //clear when you submit form
    //sessionStorage.removeItem("propertyData");

    //build form with pre-filled Data
    document.getElementById("name").value = workspaceData.name;
    document.getElementById("desc").value = workspaceData.description;
    document.getElementById("capacity").value = workspaceData.capacity;
    document.getElementById("price").value = workspaceData.rate;
    document.getElementById("size").value = workspaceData.size;
    document.getElementById("lease").value = workspaceData.lease || 4;
    preview.style.backgroundImage = `url("${workspaceData.pictures[0]}")`

    if (workspaceData.Facilities.length !== 0) {
      workspaceData.Facilities.forEach(fc => {
        if (fc.facility_id.name === "Smoking") {
          document.getElementById("smoking").checked = true;
        }
        if (fc.facility_id.name === "Projector") {
          document.getElementById("projector").checked = true;
        }
        if (fc.facility_id.name === "Microphone") {
          document.getElementById("microphone").checked = true;
        }
        if (fc.facility_id.name === "Whiteboard") {
          document.getElementById("whiteboard").checked = true;
        }
      })
    }

    workspaceData.pictures.forEach((pic, i) => {
      thumbBox[i].style.backgroundImage = `url("${pic}")`
    })

    document.getElementById("available").checked = workspaceData.available
  }

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

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000)
      }
      else {
        const url = URL.createObjectURL(f);
        thumbBox[i].style.backgroundImage = `url("${url}")`
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000)
      }
      dt.items.add(f);
    });

    //save files
    inputEl.files = dt.files;
    console.log(inputEl.files, finalList);
  });

  form.addEventListener('click', (e) => {
    if (e.target.matches('.thumb-box')) {
      const thumbBoxEl = e.target;
      const imageURL = thumbBoxEl.style.backgroundImage;

      if (imageURL.startsWith('url')) {
        preview.style.backgroundImage = imageURL;
      }
    }
  });


  form.addEventListener('submit', async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);

      //add checkboxes if not present in formData
      if (!formData.has("projector")) {
        formData.append('projector', 'off')
      }

      if (!formData.has("microphone")) {
        formData.append("microphone", "off")
      }

      if (!formData.has("smoking")) {
        formData.append("smoking", "off")
      }

      if (!formData.has("whiteboard")) {
        formData.append("whiteboard", "off")
      }

      if (!formData.has("available")) {
        formData.append("available", "off")
      }

      //iterate through the form inputs
      for (let [key, value] of formData.entries()) {
        if (typeof value === "string" && value.trim() === "") {
          alert('All fields must be filled');
          return;
        }
        if (key === "imageInput" && value.name.trim() === "") {
          if (typeValue !== "edit") {
            alert("No pictures, please add at least one");
            return;
          }
        }

        console.log(key, value)
      }

      if (typeValue === "edit") {
        //clear session storage here, no longer using it
        console.log("not sending...");
        formData.append("workspace_id", workspace_id)
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        const editResponse = await createWorkspace(formData, "PUT");

        if (editResponse.message.toLowerCase().trim() === "edit successful") {
          window.location.href = `/my-workspace/${idValue}`
        }
        else {
          alert("Failed to edit workspace, please try again")
        }

        return;
      }

      //create workspace

      const serverResponse = await createWorkspace(formData, "POST");

      console.log(serverResponse);

      //back to workspace listing
      if (serverResponse.message.toLowerCase() === "workspace created") {
        window.location.href = `/my-workspace/${idValue}`;
      }
      else {
        alert("Failed to create workspace, please try again")
      }

    }
    catch (err) {
      console.error('Post failed:', err.message);
    }
  });

  async function createWorkspace(propertyData, method) {
    try {
      console.log("creating workspace")
      const response = await fetch(
        `/api/createworkspace?propertyID=${idValue}`,
        {
          method: `${method}`,
          body: propertyData
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      return data;
    }
    catch (err) {
      console.error("Err is:", err.message);
    }
  }
})

document.querySelector('#submit-btn').addEventListener('click', async (e) => {

});
