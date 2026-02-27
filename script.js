// ===== Wait for DOM =====
document.addEventListener("DOMContentLoaded", () => {

  // ===== Include Navbar and Footer =====
  includeHTML("navbar", "navbar.html").then(() => {
    highlightActive();          // Highlight current page
    attachHomeScrollBtn();      // Home page scroll
    attachAboutScrollBtn();     // About page scroll
    attachArticlesScrollBtn();  // Articles page scroll
    attachContactScrollBtn();   // Contact page scroll
  });

  includeHTML("footer", "footer.html");

  // ===== Include HTML helper =====
  function includeHTML(elementId, file) {
    return fetch(file)
      .then(res => {
        if (!res.ok) throw new Error(`Could not fetch ${file}`);
        return res.text();
      })
      .then(data => document.getElementById(elementId).innerHTML = data)
      .catch(err => console.error(err));
  }

  // ===== Highlight current page link =====
  function highlightActive() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  }

  // ===== Home Page Scroll =====
  function attachHomeScrollBtn() {
    const exploreBtn = document.querySelector(".hero button");
    const firstSection = document.querySelector(".page-content");
    const navbar = document.getElementById("navbar");

    if (!exploreBtn || !firstSection) {
      setTimeout(attachHomeScrollBtn, 50);
      return;
    }

    exploreBtn.addEventListener("click", () => {
      const navbarHeight = navbar?.offsetHeight || 0;
      window.scrollTo({
        top: firstSection.offsetTop - navbarHeight,
        behavior: "smooth"
      });
    });
  }

  // ===== About Page Scroll =====
  function attachAboutScrollBtn() {
    const readMoreBtn = document.getElementById("readMoreBtn");
    const aboutSection = document.getElementById("aboutSection");

    if (!readMoreBtn || !aboutSection) {
      setTimeout(attachAboutScrollBtn, 50);
      return;
    }

    readMoreBtn.addEventListener("click", () => {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ===== Articles Page Scroll =====
  function attachArticlesScrollBtn() {
    const viewArticlesBtn = document.getElementById("viewArticlesBtn");
    const articlesSection = document.getElementById("articlesSection") || document.getElementById("articlesContainer");

    if (!viewArticlesBtn || !articlesSection) {
      setTimeout(attachArticlesScrollBtn, 50);
      return;
    }

    viewArticlesBtn.addEventListener("click", () => {
      articlesSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ===== Contact Page Scroll =====
  function attachContactScrollBtn() {
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    const contactSection = document.getElementById("contactSection");
    const navbar = document.getElementById("navbar");

    if (!sendMessageBtn || !contactSection) {
      setTimeout(attachContactScrollBtn, 50);
      return;
    }

    sendMessageBtn.addEventListener("click", () => {
      const navbarHeight = navbar?.offsetHeight || 0;
      window.scrollTo({
        top: contactSection.offsetTop - navbarHeight,
        behavior: "smooth"
      });
    });
  }

  // ===== News Articles Fetch =====
  const searchInput = document.getElementById("keywordSearch");
  const articlesContainer = document.getElementById("articlesContainer");

  if (searchInput && articlesContainer) {
    async function fetchArticles(query = "") {
      try {
        const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
        const articles = await res.json();

        articlesContainer.innerHTML = "";

        if (!articles.length) {
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

    fetchArticles();
    searchInput.addEventListener("input", () => fetchArticles(searchInput.value));

    const searchButton = document.getElementById("searchButton");
    if (searchButton) searchButton.addEventListener("click", () => fetchArticles(searchInput.value));
  }

  // ===== Contact Form Submission (Message Page) =====
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const contact = document.getElementById("contact").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      // ===== Validation =====
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(name)) {
        alert("Name should contain only alphabets and spaces.");
        return;
      }

      const contactRegex = /^\+?\d{1,15}$/;
      if (!contactRegex.test(contact)) {
        alert("Contact number should contain only digits and optional '+' with max 15 digits.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (message.length < 5) {
        alert("Message should be at least 5 characters long.");
        return;
      }

      try {
        await db.collection("messages").add({
          name: name,
          contact: contact,
          email: email,
          message: message,
          timestamp: new Date()
        });

        alert("Message sent successfully!");
        contactForm.reset();

        // Redirect to Home page
        window.location.href = "index.html";

      } catch (error) {
        console.error("Error saving message:", error);
        alert("Error sending message. Please try again.");
      }
    });
  }

});
