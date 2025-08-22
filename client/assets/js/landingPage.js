
document.addEventListener('DOMContentLoaded', async () => {
    // get Data
    let appData = await fetchWorkspace('https://watchspaces.onrender.com/api/homepage');

    //build cards
    function buildCards(data) {
        const locationELs = document.querySelectorAll('.location');

        locationELs.forEach((el, i) => {
            el.style.display = 'block';
            if(i >= data.length) {
                el.style.display = 'none';
                return;
            };
            const target = data[i]
            el.querySelector('.card-box').style.backgroundImage = `url(https://watchspaces.onrender.com/pictures${target.pictures[0]})`;
            el.querySelector('h3').innerText = target.name;
            el.querySelector('p').innerText = target.Address
        });
    }

    buildCards(appData);

    //searchLogic
    document.getElementById("searchBtn").addEventListener("click", async function () {
        const input = document.getElementById("searchInput").value;
        if (input.trim() === "") {
            alert("Please enter a keyword to search.");
        } else {
            appData = await fetchWorkspace(`https://watchspaces.onrender.com/api/search?query=${encodeURIComponent(input)}`);
            console.log(appData)
            buildCards(appData);
        }
    });

    // LogInbtn
    document.getElementById("loginBtn").addEventListener("click", function () {
        window.location.href = `/WorkspaceProject/signin-signup.html?type=login`
    });

    //Sign Up btn
    document.getElementById("signupBtn").addEventListener("click", function () {
        window.location.href = `/WorkspaceProject/signin-signup.html?type=signup`
    });

    document.querySelector('.browse-btn').addEventListener("click", () => {
        window.location.href = `/WorkspaceProject/signin-signup.html?type=login`
    });

    document.getElementById("subscribe-form").addEventListener("click", function () {
        const emailInput = document.getElementById("newsletter").value.trim();

        if (emailInput === "") {
            alert("Please enter your email!");
        } else {
            alert("Thank you for subscribing, " + emailInput + "!");
            document.getElementById("newsletter").value = "";
        }
    });

    async function fetchWorkspace(API) {
        try {
            const response = await fetch(API, {credentials:"include"});

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

