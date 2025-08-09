
document.addEventListener('DOMContentLoaded', () => {
  const splitURL = window.location.href.split('/');
  let currentAuth = splitURL[splitURL.length - 1];



  const signUpTab = document.getElementById('sign-up-tab');
  const signInTab = document.getElementById('sign-in-tab');
  const signUpForm = document.getElementById('sign-up-form');
  const signInForm = document.getElementById('sign-in-form');


  if (currentAuth === 'login') {
    blockSignUpTab();
  }
  else {
    blockSignInTab();
  }

  signUpTab.addEventListener('click', blockSignInTab);

  signInTab.addEventListener('click', blockSignUpTab);

  //input validation
  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const data = Object.fromEntries(formData.entries());

    // role required
    if (!data.role) {
      alert('Please choose a role');
      return;
    }

    for (const [key, value] of formData.entries()) {
      if (!value || !value.trim()) {
        alert(`${key} is required`);
        return;
      }

      if (key === 'phone') {
        // keep digits only
        const digits = value.replace(/\D/g, '');
        if (digits.length !== 10) {
          alert('Phone must be 10 digits');
          return;
        }
      }

      if (key === 'email') {
        if (!emailRegex.test(value)) {
          alert('Invalid email, try again');
          return;
        }
      }

      if (key === 'password') {
        if (value.length < 8) {
          alert('Password must be at least 8 characters');
          return;
        }
      }
    }

    console.log(data);
    const response = await submitUser(data);
  });

  signInForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
  })


  function blockSignInTab() {
    signUpForm.style.display = 'block';
    signInForm.style.display = 'none';
    signUpTab.classList.add('active');
    signInTab.classList.remove('active');
    currentAuth = "signup";
  }

  function blockSignUpTab() {
    signUpForm.style.display = 'none';
    signInForm.style.display = 'block';
    signInTab.classList.add('active');
    signUpTab.classList.remove('active');
    currentAuth = "login";
  }




  async function submitUser(data) {
    try {
      const response = await fetch(
        `/api/auth/createuser`,
        {
          method: "POST",
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        let error = await response.json();
        error = error.error;
        if (response.status === 409 || response.status === 400 || response.status === 500) {
          alert(error)
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const serverData = await response.json();

      console.log('getting token...')
      const token = serverData.token;
      const role = serverData.user.role;

      //save token  
      console.log('saved token.....')
      localStorage.setItem('watchSpaceToken', token);

      //fetch pages based on their roles
      if (role === "coworker") {
        await fetch("/coworker", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        console.log('redirecting to coworker page')
        return;
      }

      if(role === "owner"){
        await fetch("/owner", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        console.log('redirecting to owner page')
        return;
      }

    }
    catch (err) {
      console.error(err);
    }
  }

})


