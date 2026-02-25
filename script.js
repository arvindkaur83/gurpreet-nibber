// ================================
// script.js - Gurpreet Singh Nibber
// ================================

// Load HTML content into placeholders
function includeHTML(elementId, file) {
  return fetch(file)
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
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// Scroll button event (for Read More)
function addScrollListener() {
  const readMoreBtn = document.getElementById("readMoreBtn");
  const aboutSection = document.getElementById("aboutSection");

  if (readMoreBtn && aboutSection) {
    readMoreBtn.addEventListener("click", () => {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    });
  }
}

// ================================
// DOM Ready
// ================================
document.addEventListener("DOMContentLoaded", () => {

  // 1️⃣ Include navbar and footer first
  Promise.all([
    includeHTML("navbar", "navbar.html"),
    includeHTML("footer", "footer.html")
  ]).then(() => {
    // 2️⃣ Attach scroll button listener after includes are done
    addScrollListener();
  });

  // ================================
  // 3️⃣ Article aggregator (if present)
  // ================================
  const searchInput = document.getElementById("keywordSearch");
  const articlesContainer = document.getElementById("articlesContainer");
  const searchButton = document.getElementById("searchButton");

  // Only run if container exists (avoids errors on non-articles pages)
  if (articlesContainer) {

    async function fetchArticles(query = "") {
      try {
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
      } catch (err) {
        console.error(err);
        articlesContainer.innerHTML = "<p>Error fetching articles.</p>";
      }
    }

    // Initial load
    fetchArticles();

    // Live search (optional)
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        fetchArticles(searchInput.value);
      });
    }

    // Search button click
    if (searchButton) {
      searchButton.addEventListener("click", () => {
        fetchArticles(searchInput ? searchInput.value : "");
      });
    }
  }
});
