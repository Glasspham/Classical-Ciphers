// Navbar component for Classical Ciphers
function loadNavbar() {
  const navbarHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-navbar fixed-top">
            <div class="container">
                <a class="navbar-brand" href="index.html">
                    <i class="fas fa-key"></i>
                    <span>Classical Ciphers</span>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="index.html">Trang chủ</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="caesar.html">Caesar</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="polybius.html">Polybius</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="playfair.html">Playfair</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="disk.html">Cipher Disk</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="trithemius.html">Trithemius</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `;

  // Insert navbar at the beginning of body
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);

  // Set active class based on current page
  setActiveNavItem();
}

function setActiveNavItem() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });
}

// Load navbar when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  loadNavbar();
});
