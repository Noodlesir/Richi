const button = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  button.textContent = theme === "light" ? "Dark mode" : "Light mode";
}

let saved = null;
try { saved = localStorage.getItem("richi-theme"); } catch (e) {}
applyTheme(saved || "dark");

button.addEventListener("click", () => {
  const next = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(next);
  try { localStorage.setItem("richi-theme", next); } catch (e) {}
});