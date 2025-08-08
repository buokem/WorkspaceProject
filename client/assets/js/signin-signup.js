
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
  signUpForm.addEventListener('submit', (e) => {
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
  });

  signInForm.addEventListener('submit', (e)=>{
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
    try{
      const response = await fetch(
        `/api/auth/createUser`,
        {
          method: "POST",
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
    }
    catch(err){
      console.error(err);
    }
  }

})


