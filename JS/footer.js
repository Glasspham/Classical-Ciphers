// Footer component for Classical Ciphers
function loadFooter() {
  const footerHTML = `
            <footer class="bg-footer text-dark py-4 mt-5">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-6">
                            <h5><i class="fas fa-key me-2"></i>Classical Ciphers</h5>
                            <p class="mb-0">Học tập và thực hành các thuật toán mã hóa cổ điển</p>
                            <p class="mb-0">&copy; 2025 Classical Ciphers. Made with ❤️ for education.</p>
                        </div>
                        <div class="col-lg-6 text-lg-end">
                            <p class="mb-0">Developed by
                                <a href="https://github.com/Glasspham" target="_blank" class="btn btn-outline-light btn-sm">
                                    <i class="fab fa-github me-2"></i>
                                    Glasspham
                                </a>
                            </p>
                            <p class="mb-0">
                                <a href="https://github.com/Glasspham/Support-Network" target="_blank" class="text-dark text-decoration-none opacity-75">
                                    <i class="fas fa-code me-1"></i>
                                    Open source Classical Ciphers
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        `;

  // Insert footer before closing body tag
  document.body.insertAdjacentHTML("beforeend", footerHTML);
}

// Load footer when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  loadFooter();
});
