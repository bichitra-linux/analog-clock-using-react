// Mobile-only warning for desktop users
(function () {
  function showDesktopWarning() {
    var warning = document.getElementById('desktop-warning');
    if (warning) warning.classList.add('show');
  }

  var isMobileOrTablet =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) ||
    window.innerWidth <= 1024;

  // Check if running in Capacitor
  var isCapacitor =
    window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'ionic:' ||
    (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1);

  if (
    !isMobileOrTablet &&
    !isCapacitor &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    document.addEventListener('DOMContentLoaded', showDesktopWarning);
  }
})();
