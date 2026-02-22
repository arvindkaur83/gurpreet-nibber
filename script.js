// Load HTML content into placeholders
function includeHTML(elementId, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => document.getElementById(elementId).innerHTML = data)
    .then(() => highlightActive())
    .catch(err => console.error(err));
}

// Highlight the current menu link
function highlightActive() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    if(link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// Call includes
includeHTML("navbar", "navbar.html");
includeHTML("footer", "footer.html");
