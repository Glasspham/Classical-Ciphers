// Classical Ciphers - Main JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Initialize animations
  initializeAnimations();

  // Initialize smooth scrolling
  initializeSmoothScrolling();

  // Initialize scroll spy for navbar
  initializeScrollSpy();
});

// Initialize page animations
function initializeAnimations() {
  // Animate cipher cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe cipher cards and feature items
  const animatedElements = document.querySelectorAll(".cipher-card, .feature-item");
  animatedElements.forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });
}

// Initialize smooth scrolling for anchor links
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Initialize scroll spy for navbar
function initializeScrollSpy() {
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.style.backgroundColor = "rgba(0, 123, 255, 0.95)";
      navbar.style.backdropFilter = "blur(10px)";
    } else {
      navbar.style.backgroundColor = "";
      navbar.style.backdropFilter = "";
    }
  });
}

// Utility function for smooth scrolling
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Common cipher functions for all pages
const CipherUtils = {
  // Clean text by removing non-alphabetic characters and converting to uppercase
  cleanText: function (text) {
    return text.replace(/[^A-Za-z]/g, "").toUpperCase();
  },

  // Format text into groups of 5 characters
  formatOutput: function (text) {
    return text.match(/.{1,5}/g)?.join(" ") || text;
  },

  // Show result with animation
  showResult: function (elementId, result, isSuccess = true) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = result;
      element.className = `alert ${isSuccess ? "alert-success" : "alert-danger"}`;
      element.style.display = "block";
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";

      setTimeout(() => {
        element.style.transition = "all 0.3s ease";
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, 100);
    }
  },

  // Copy text to clipboard
  copyToClipboard: function (text) {
    navigator.clipboard
      .writeText(text)
      .then(
        function () {
          this.showToast("Đã sao chép vào clipboard!", "success");
        }.bind(this)
      )
      .catch(
        function (err) {
          console.error("Could not copy text: ", err);
          this.showToast("Không thể sao chép!", "error");
        }.bind(this)
      );
  },

  // Show toast notification
  showToast: function (message, type = "success") {
    // Remove existing toast
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerHTML = `
            <div class="toast-content ${type}">
                <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
                <span>${message}</span>
            </div>
        `;

    // Add styles
    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;

    const toastContent = toast.querySelector(".toast-content");
    toastContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            background: ${type === "success" ? "#28a745" : "#dc3545"};
        `;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  },
};

// Add CSS for animations if not already present
if (!document.querySelector("#cipher-animations")) {
  const style = document.createElement("style");
  style.id = "cipher-animations";
  style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
  document.head.appendChild(style);
}
