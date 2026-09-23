let config;
let index = 0;

const startScreen = document.getElementById("startScreen");
const show = document.getElementById("show");
const showTitle = document.getElementById("showTitle");
const image = document.getElementById("slideImage");
const title = document.getElementById("slideTitle");
const caption = document.getElementById("slideCaption");
const counter = document.getElementById("counter");
const player = document.getElementById("scPlayer");

function soundCloudEmbed(trackUrl, autoplay=true) {
  const url = encodeURIComponent(trackUrl);
  return "https://w.soundcloud.com/player/?url=" + url +
    "&color=%23ff5500&auto_play=" + (autoplay ? "true" : "false") +
    "&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false";
}

function renderSlide(newIndex) {
  index = (newIndex + config.slides.length) % config.slides.length;
  const slide = config.slides[index];

  image.classList.remove("visible");
  const preload = new Image();
  preload.onload = () => {
    image.src = slide.image;
    image.alt = slide.title || "";
    requestAnimationFrame(() => image.classList.add("visible"));
  };
  preload.src = slide.image;

  title.textContent = slide.title || "";
  caption.textContent = slide.caption || "";
  counter.textContent = `${index + 1} / ${config.slides.length}`;

  if (slide.soundcloud) {
    // Reloading the single iframe switches tracks and stops the previous one.
    player.src = soundCloudEmbed(slide.soundcloud, true);
  } else {
    player.src = "about:blank";
  }
}

async function init() {
  const response = await fetch("slideshow.json");
  if (!response.ok) throw new Error("Could not load slideshow.json");
  config = await response.json();
  showTitle.textContent = config.title || "Soundshow";

  document.getElementById("startBtn").addEventListener("click", () => {
    startScreen.classList.add("hidden");
    show.classList.remove("hidden");
    renderSlide(0);
  });

  document.getElementById("prevBtn").addEventListener("click", () => renderSlide(index - 1));
  document.getElementById("nextBtn").addEventListener("click", () => renderSlide(index + 1));

  document.addEventListener("keydown", e => {
    if (show.classList.contains("hidden")) return;
    if (e.key === "ArrowLeft") renderSlide(index - 1);
    if (e.key === "ArrowRight") renderSlide(index + 1);
  });
}

init().catch(err => {
  startScreen.innerHTML = `<h1>Soundshow</h1><p>${err.message}</p>
  <p>Run this folder through a local web server or GitHub Pages; browsers do not allow fetch() from a file:// page.</p>`;
});
