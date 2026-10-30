export function initializeTheme() {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function applySystemTheme() {
    document.documentElement.classList.toggle("dark", media.matches);
    document.documentElement.style.colorScheme = media.matches ? "dark" : "light";
  }

  applySystemTheme();
  media.addEventListener("change", applySystemTheme);

  return () => media.removeEventListener("change", applySystemTheme);
}
