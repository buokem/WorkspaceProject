document.addEventListener('DOMContentLoaded', () => {
  getProperty();
});

async function getProperty() {
  const appData = JSON.parse(await fetchApi('api/database'));
  const { propertyData } = appData;
  console.log(propertyData);

  const availableProperty = propertyData.filter(p => p.available);

  const contentContainer = document.getElementById('content');
  const propertyCountEl = document.getElementById('property-count');
  propertyCountEl.innerText = `${availableProperty.length} Properties Available`;

  availableProperty.forEach(property => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <div class="card-image">
          <img src=${'ws.pictures[0]'} alt="">
      </div>
      <div class="card-content">
          <div class="content-part-1">
              <div class="address-holder content-holder">
                  <p>${property.Address_line1}</p>
                  <span class="extra-text">${property.city}, ${property.province}, ${property.postal_code}</span>
              </div>
          </div>
          <div class="content-part-2 justify-content-center">
              <button class="rounded-button view-details" id="view-detail-btn">
                  View Details
              </button>
          </div>
      </div>
    `;

    card.querySelector('#view-detail-btn').addEventListener('click', () => {
      window.location.href = `property-view/${property.property_id}`;
    })

    contentContainer.append(card);
  });
}

async function fetchApi(API) {
  try {
    const response = await fetch(API);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
}
