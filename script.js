// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {

  // ===== Include Navbar and Footer =====
  includeHTML("navbar", "navbar.html").then(() => {
    highlightActive();       // Highlight current page
    attachAboutScrollBtn(); // About page scroll
    attachArticlesScrollBtn(); // Articles page scroll
    attachContactScrollBtn();  // Contact page scroll
  });

  includeHTML("footer", "footer.html");

  // ===== Function to include HTML into placeholders =====
  function includeHTML(elementId, file) {
    return fetch(file)
      .then(response => {
        if (!response.ok) throw new Error(`Could not fetch ${file}`);
        return response.text();
      })
      .then(data => document.getElementById(elementId).innerHTML = data)
      .catch(err => console.error(err));
  }

  // ===== Highlight the current menu link =====
  function highlightActive() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      if(link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  }

  // ===== Scroll Button for About Page =====
  function attachAboutScrollBtn() {
    const readMoreBtn = document.getElementById("readMoreBtn");
    const aboutSection = document.getElementById("aboutSection");

    if(readMoreBtn && aboutSection) {
      readMoreBtn.addEventListener("click", () => {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  // ===== Scroll Button for Articles Page =====
  function attachArticlesScrollBtn() {
    const viewArticlesBtn = document.getElementById("viewArticlesBtn");
    const articlesSection = document.getElementById("articlesSection");

    if(viewArticlesBtn && articlesSection) {
      viewArticlesBtn.addEventListener("click", () => {
        articlesSection.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  // ===== Scroll Button for Contact Page =====
  function attachContactScrollBtn() {
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    const contactSection = document.getElementById("contactSection");

    if(sendMessageBtn && contactSection) {
      sendMessageBtn.addEventListener("click", () => {
        contactSection.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  // ===== News Articles Fetch (if applicable) =====
  const searchInput = document.getElementById("keywordSearch");
  const articlesContainer = document.getElementById("articlesContainer");

  if(searchInput && articlesContainer) {
    async function fetchArticles(query="") {
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
        articlesContainer.innerHTML = "<p>Error loading articles.</p>";
        console.error(err);
      }
    }

    // Initial load
    fetchArticles();

    // Search on typing
    searchInput.addEventListener("input", () => {
      fetchArticles(searchInput.value);
    });

    // Search on button click
    const searchButton = document.getElementById("searchButton");
    if(searchButton) {
      searchButton.addEventListener("click", () => {
        fetchArticles(searchInput.value);
      });
    }
  }

});
