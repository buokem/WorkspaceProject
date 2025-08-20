document.getElementById('logout-btn').addEventListener('click', function() {
  localStorage.clear();
  sessionStorage.clear();
  document.cookie = '';
  window.location.href = '/'; // Adjust path as needed
});