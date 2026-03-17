/* THEME ICONS */

lucide.createIcons();

const toggle = document.getElementById("themeToggle");
const icon = document.getElementById("themeIcon");

function updateIcon(theme) {
  // Remove old SVG inside the toggle
  themeIcon.innerHTML = "";
  // Set new icon name on the <i>
  themeIcon.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
  // Re-render Lucide icon inside that container
  lucide.createIcons({ parent: themeIcon });
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateIcon(theme);
}

const saved = localStorage.getItem("theme");

if (saved) {
  setTheme(saved);
} else {
  setTheme(
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );
}

toggle.onclick = () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
};

/* FADE */

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

document.querySelectorAll(".fade").forEach((el) => {
  observer.observe(el);
});
