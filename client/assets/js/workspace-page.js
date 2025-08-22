document.addEventListener('DOMContentLoaded', () => {
  const addWorkspaceBtn = document.querySelector('#add-workspace-btn');
  addWorkspaceBtn.addEventListener('click', () => {
    window.location.href = '/workspace-form';
  });

  getPropertyWorkspace();
});

async function getPropertyById() {
  const url = window.location.href.split('/');
  const id = url[url.length - 1];

  try {
    const token = localStorage.getItem('watchSpaceToken');
    const response = await fetch(`/api/property-workspace/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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

async function getPropertyWorkspace() {
  const workspaceData = await getPropertyById();

  const availableWorkspace = workspaceData.filter((p) => p.available);

  const contentContainer = document.getElementById('content');
  const workspaceCountEl = document.getElementById('property-count');
  workspaceCountEl.innerText = `${availableWorkspace.length} Workspaces Available`;

  availableWorkspace.forEach((wP) => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
                <div class="card-image">
                    <img src=${wP.pictures[0]} alt="">
                </div>
                <div class="card-content">
                    <div class="content-part-1">
                        <div class="price-holder content-holder">
                            <p>$<span>${wP.rate}</span></p>
                            <span class="extra-text">per hour</span>
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
                                <span><pre>${wP.size} </pre></span>
                                <span>sq ft</span>
                            </div>
                            <div class="ws-seats">
                                <svg width="18" height="18" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4">
                                    <circle cx="22" cy="20" r="8" />
                                    <circle cx="42" cy="20" r="8" />
                                    <rect x="14" y="36" width="36" height="16" rx="4" />
                                    <text x="50" y="60" fill="currentColor" font-size="12">#</text>
                                </svg>
                                <span>${wP.capacity} seats</span>
                            </div>
                        </div>
                        <button class="rounded-button edit-btn">
                            Edit
                        </button>
                    </div>
                </div>
            `;

    card.querySelector('.edit-btn').addEventListener('click', () => {
      window.location.href = `/workspace-form/${wP.workspace_id}`;
    });

    contentContainer.append(card);
  });
}

async function fetchApi(API) {
  try {
    const response = await fetch(API, {credentials:'include'});

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
}
