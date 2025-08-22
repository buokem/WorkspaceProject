
const property_id = window.location.pathname.split('/')[2];

document.addEventListener('DOMContentLoaded', async () => {
  const propertyNameEl = document.querySelector('#property-name');
  const viewWorkspaceBtn = document.querySelector('#view-workspace');

  const userInfo = JSON.parse(sessionStorage.getItem("watchspaceUser"));

  const userName = userInfo.email.split("@")[0];
  document.getElementById("coworker-name").innerText = userName;
  document.getElementById("initial").innerText = userName[0].toUpperCase();

  const theProperty = await getPropertyById();
  propertyNameEl.innerText = theProperty.name;

  const mainImage = document.querySelector('.main-image');
  mainImage.style.backgroundImage = `url(${theProperty.pictures[0]})`;

  document.querySelectorAll('.sub-image').forEach((el, i) => {
    el.style.backgroundImage = `url(${theProperty.pictures[i]})`;

    el.addEventListener('click', (e) => {
      mainImage.style.backgroundImage = e.currentTarget.style.backgroundImage;
    });
  });

  document.getElementById("view-workspace").addEventListener('click', async (e) => {
    window.location.href = `/my-workspace/${property_id}`
  })

  const tagParent = document.querySelector('.details-block .tag-holder');

  const detailMap = {
    total_area: 'Total Area: {1}',
    num_rooms: 'Rooms: {1}',
    available: 'Available',
  };

  ['total_area', 'num_rooms', 'available'].forEach((field) => {
    const div = document.createElement('div');
    div.classList.add('tag');
    div.innerHTML = `
              <span class ="tag-text">${detailMap[field].replace(
                '{1}',
                theProperty[field],
              )}</span>
          `;
    tagParent.appendChild(div);
  });

  viewWorkspaceBtn.addEventListener('click', () => {
    const propertyId = getPropertyIdFromPath();
    window.location.href = `/my-workspace/${propertyId}`;
  })
});

function getPropertyIdFromPath() {
  const url = window.location.href.split('/');
  const id = url[url.length - 1];
  return id;
}

async function getPropertyById() {
  const id = getPropertyIdFromPath();

  try {
    const token = localStorage.getItem('watchSpaceToken');
    const response = await fetch(`https://watchspaces.onrender.com/api/property/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials:'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
}
