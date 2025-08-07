// Searchbtn
document.getElementById("searchBtn").addEventListener("click", function () {
    const input = document.getElementById("searchInput").value;
    if (input.trim() === "") {
        alert("Please enter a keyword to search.");
    } else {
        alert("Searching for: " + input);
    }
});

// LogInbtn
document.getElementById("loginBtn").addEventListener("click", function () {
    alert("Redirecting to Log In page...");
});

//Sign Up btn
document.getElementById("signupBtn").addEventListener("click", function () {
    alert("Redirecting to Sign Up page...");
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