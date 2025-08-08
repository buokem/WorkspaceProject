const signUpTab = document.getElementById('sign-up-tab');
const signInTab = document.getElementById('sign-in-tab');
const signUpForm = document.getElementById('sign-up-form');
const signInForm = document.getElementById('sign-in-form');

signUpTab.addEventListener('click', () => {
  signUpForm.style.display = 'block';
  signInForm.style.display = 'none';
  signUpTab.classList.add('active');
  signInTab.classList.remove('active');
});

signInTab.addEventListener('click', () => {
  signUpForm.style.display = 'none';
  signInForm.style.display = 'block';
  signInTab.classList.add('active');
  signUpTab.classList.remove('active');
});
