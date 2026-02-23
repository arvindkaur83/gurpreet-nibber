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
// added for aggregator
const searchInput = document.getElementById("keywordSearch");
const articlesContainer = document.getElementById("articlesContainer");

async function fetchArticles(query="") {
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

// Search on typing
searchInput.addEventListener("input", () => {
  fetchArticles(searchInput.value);
});
