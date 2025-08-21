document.getElementById('logout-btn').addEventListener('click', function() {
  localStorage.clear();
  sessionStorage.clear();
  document.cookie.split(';').forEach(function(cookie) {
    document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
  });
  window.location.href = '/'; // Adjust path as needed
});