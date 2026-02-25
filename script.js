// Wait until the full DOM is loaded
document.addEventListener("DOMContentLoaded", () => {

  // ----------------------
  // Include navbar and footer
  // ----------------------
  const navbarPromise = fetch("navbar.html")
    .then(res => res.text())
    .then(html => document.getElementById("navbar").innerHTML = html);

  const footerPromise = fetch("footer.html")
    .then(res => res.text())
    .then(html => document.getElementById("footer").innerHTML = html);

  // After navbar/footer loaded
  Promise.all([navbarPromise, footerPromise]).then(() => {
    // Highlight active link in navbar
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-links a').forEach(link => {
      if(link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });

    // Attach scroll event to button AFTER DOM exists
    const readMoreBtn = document.getElementById("readMoreBtn");
    const aboutSection = document.getElementById("aboutSection");

    if(readMoreBtn && aboutSection) {
      readMoreBtn.addEventListener("click", () => {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      });
    }
  });

  // ----------------------
  // Article aggregator (optional)
  // ----------------------
  const articlesContainer = document.getElementById("articlesContainer");
  const searchInput = document.getElementById("keywordSearch");
  const searchButton = document.getElementById("searchButton");

  if(articlesContainer) {
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
      } catch(err) {
        console.error(err);
        articlesContainer.innerHTML = "<p>Error fetching articles.</p>";
      }
    }

    // Initial load
    fetchArticles();

    // Live search
    if(searchInput) {
      searchInput.addEventListener("input", () => fetchArticles(searchInput.value));
    }

    // Button search
    if(searchButton) {
      searchButton.addEventListener("click", () => fetchArticles(searchInput ? searchInput.value : ""));
    }
  }
});
