document.addEventListener('DOMContentLoaded', () => {
  getProperty();

  const idValue = getQueryParamId();
  document.getElementById('add-property').addEventListener('click', (e) => {
    window.location.href = `/property-form?type=create&ownerId=${idValue}`;
  });
});

function getQueryParamId() {
  const urlParams = new URLSearchParams(window.location.search);
  const idValue = urlParams.get('id');
  return idValue;
}

async function getProperty() {
  const idValue = getQueryParamId();

  const appData = await fetchApi(`api/getproperties/${idValue}`);

  const availableProperty = appData.dataWithFacilities;
  const userInfo = appData.user;

  const userName = userInfo.email.split("@")[0];
  document.getElementById("coworker-name").innerText = userName;
  document.getElementById("initial").innerText = userName[0].toUpperCase();
 
  sessionStorage.setItem("watchspaceUser", JSON.stringify(userInfo));

  const contentContainer = document.getElementById('content');
  const propertyCountEl = document.getElementById('property-count');
  propertyCountEl.innerText = `${availableProperty.length} Properties Available`;

  availableProperty.forEach((property, i) => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <div class="card-image">
          <img src=${property.pictures[0]} alt="">
      </div>
      <div class="card-content">
          <div class="content-part-1">
              <div class="address-holder content-holder">
                  <p>${property.Address_line1}</p>
                  <span class="extra-text">${property.city}, ${property.province}, ${property.postal_code}</span>
              </div>
          </div>
          <div class="content-part-2 justify-content-center">
              <button class="rounded-button view-detail-btn">
                  View Details
              </button>
          </div>
      </div>
      <div class="options">
        <div class="option-control">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="option-control">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4ZM15 5C15 6.65685 13.6569 8 12 8C10.3431 8 9 6.65685 9 5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5ZM12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11ZM15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12ZM11 19C11 18.4477 11.4477 18 12 18C12.5523 18 13 18.4477 13 19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19ZM12 22C13.6569 22 15 20.6569 15 19C15 17.3431 13.6569 16 12 16C10.3431 16 9 17.3431 9 19C9 20.6569 10.3431 22 12 22Z"/>
          </svg>
        </div>
        
        <ul class="dd-menu hide">
          <li><button class="edit-btn" id="edit-btn" data-id=${property._id}>Edit</button></li>
          <li><button class="delete-btn" id="delete-btn" data-id=${property._id}>Delete</button></li>
        </ul>
      </div>
    `;

    const ddMenu = card.querySelector('.dd-menu');

    card.addEventListener('click', async (e) => {
      if (e.target.matches('.view-detail-btn')) {
        window.location.href = `property-view/${property._id}`;
        return;
      }

      if (e.target.matches('#option-control')) {
        ddMenu.classList.toggle('hide');
        return;
      }

      if (e.target.matches('#edit-btn')) {
        const id = e.target.dataset.id;
        const propertyData = availableProperty.find(
          (p) => p._id === id,
        );
        console.log(propertyData);
        sessionStorage.setItem('propertyData', JSON.stringify(propertyData));
        window.location.href = `/property-form?type=edit&ownerId=${idValue}`;
      }

      if (e.target.matches('#delete-btn')) {
        const id = e.target.dataset.id;

        const confirmed = confirm('Are you sure you want to delete this?');

        if (confirmed) {
          const res = await fetchApi('/api/createProperty', 'DELETE', { id });

          console.log(res);

          if (res.message.toLowerCase().trim() === 'delete successful') {
            window.location.href = `/owner?id=${idValue}`;
          }
        }
      }
    });

    card.style.animationDelay = `${i * 0.1}s`;
    card.classList.add('show');

    contentContainer.append(card);
  });
}

async function fetchApi(API, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    };

    if (method !== 'GET' && body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(API, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
}
