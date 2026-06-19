const TELEGRAM_URL = "https://web.telegram.org/";

document.documentElement.classList.add("js-enabled");

const progressBar = document.querySelector("[data-progress-bar]");
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const floatingCta = document.querySelector("[data-floating-cta]");
const heroSection = document.querySelector(".hero");
const revealItems = document.querySelectorAll(".reveal");
const staggerItems = document.querySelectorAll(".stagger-item");
const faqItems = document.querySelectorAll("[data-faq-item]");
const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];
const navLinksForMobile = document.querySelectorAll("[data-desktop-nav] a");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setTelegramTargets() {
  document.querySelectorAll('a[href="https://web.telegram.org/"]').forEach((link) => {
    link.setAttribute("href", TELEGRAM_URL);
  });
}

function updateScrollProgress() {
  if (!progressBar) {
    return;
  }

  const scrollTop = window.scrollY;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
}

function updateHeaderState() {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function openMobileMenu() {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Menü bezárása");
  mobileMenu.hidden = false;
  mobileMenu.removeAttribute("hidden");
  mobileMenu.setAttribute("aria-hidden", "false");
  mobileMenu.classList.add("is-open");
  document.body.classList.add("menu-open");
}

function closeMobileMenu() {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Menü megnyitása");
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
  mobileMenu.hidden = true;
}

function toggleMobileMenu() {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  if (isExpanded) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function setupMobileMenu() {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  closeMobileMenu();

  menuToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMobileMenu();
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  navLinksForMobile.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 920) {
        closeMobileMenu();
      }
    });
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 920) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });
}

function setupRevealAnimations() {
  if (prefersReducedMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });

  staggerItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 80}ms`;
  });
}

function setupFaqAccordion() {
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) {
        return;
      }

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });
}

function setupFloatingCta() {
  if (!floatingCta || !heroSection) {
    return;
  }

  if (prefersReducedMotion.matches) {
    const toggleImmediateVisibility = () => {
      floatingCta.classList.toggle("is-visible", window.scrollY > heroSection.offsetHeight * 0.6);
    };

    toggleImmediateVisibility();
    window.addEventListener("scroll", toggleImmediateVisibility, { passive: true });
    return;
  }

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        floatingCta.classList.toggle("is-visible", !entry.isIntersecting);
      });
    },
    {
      threshold: 0.2
    }
  );

  heroObserver.observe(heroSection);
}

function setupExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    if (!link.hasAttribute("rel")) {
      link.setAttribute("rel", "noreferrer");
    }
  });
}

function init() {
  setTelegramTargets();
  setupExternalLinks();
  setupMobileMenu();
  setupRevealAnimations();
  setupFaqAccordion();
  setupFloatingCta();
  updateScrollProgress();
  updateHeaderState();

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

init();
