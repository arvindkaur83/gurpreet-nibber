// ======= HTML Include Function =======
function includeHTML(elementId, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => document.getElementById(elementId).innerHTML = data)
    .then(() => {
      highlightActive();
      setupMobileMenu(); // ensure mobile toggle works after navbar is loaded
    })
    .catch(err => console.error(err));
}

// ======= Highlight Active Menu Link =======
function highlightActive() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// ======= Include Navbar and Footer =======
includeHTML("navbar", "navbar.html");
includeHTML("footer", "footer.html");

// ======= Articles Section =======
const searchInput = document.getElementById("keywordSearch");
const articlesContainer = document.getElementById("articlesContainer");

async function fetchArticles(query = "") {
  if (!articlesContainer) return; // skip if not on articles page
  const response = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
  const articles = await response.json();

  articlesContainer.innerHTML = "";

  if (articles.length === 0) {
    articlesContainer.innerHTML = "<p>No articles found.</p>";
    return;
  }

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3><a href="${article.link}" target="_blank">${article.title}</a></h3>
      <p>${article.summary}</p>
      <small>${article.source} | ${article.published}</small>
    `;
    articlesContainer.appendChild(card);
  });
}

// Load all articles initially
fetchArticles();

// Live search while typing
if (searchInput) {
  searchInput.addEventListener("input", () => fetchArticles(searchInput.value));
}

// Search button click
const searchButton = document.getElementById("searchButton");
if (searchButton) {
  searchButton.addEventListener("click", () => fetchArticles(searchInput.value));
}

// ======= Mobile Navbar Toggle =======
function setupMobileMenu() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("nav-active");
    navToggle.classList.toggle("toggle");
  });
}
