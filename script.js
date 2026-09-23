const siteHeader = document.getElementById("siteHeader");

function handleHeaderScroll() {
  if (window.scrollY > 50) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", handleHeaderScroll, {
  passive: true
});

handleHeaderScroll();


const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

function closeMobileMenu() {
  menuToggle.classList.remove("active");
  mobileMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

menuToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");

  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));

  document.body.style.overflow = isOpen ? "hidden" : "";
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});


const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});


const counters = document.querySelectorAll("[data-count]");

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 1500;
      const start = performance.now();

      function updateCounter(currentTime) {
        const progress = Math.min(
          (currentTime - start) / duration,
          1
        );

        const easedProgress = 1 - Math.pow(1 - progress, 3);

        element.textContent = Math.floor(
          easedProgress * target
        ).toLocaleString("pl-PL");

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
      observer.unobserve(element);
    });
  },
  {
    threshold: 0.7
  }
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});


function updateOpeningStatus() {
  const now = new Date();

  const warsawTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Warsaw",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(now);

  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Warsaw",
    weekday: "short"
  }).format(now);

  const [hours, minutes] = warsawTime.split(":").map(Number);
  const currentMinutes = hours * 60 + minutes;

  let openingMinutes;
  let closingMinutes;

  if (day === "Sun") {
    openingMinutes = null;
    closingMinutes = null;
  } else if (day === "Sat") {
    openingMinutes = 9 * 60;
    closingMinutes = 15 * 60;
  } else {
    openingMinutes = 9 * 60;
    closingMinutes = 20 * 60;
  }

  const isOpen =
    openingMinutes !== null &&
    currentMinutes >= openingMinutes &&
    currentMinutes < closingMinutes;

  document.body.dataset.open = isOpen ? "true" : "false";
}

updateOpeningStatus();
setInterval(updateOpeningStatus, 60000);