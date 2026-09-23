let config = null;
let index = 0;

const loader = document.getElementById("loader");
const readyScreen = document.getElementById("readyScreen");
const show = document.getElementById("show");
const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const status = document.getElementById("status");
const showTitle = document.getElementById("showTitle");
const slideCount = document.getElementById("slideCount");
const image = document.getElementById("slideImage");
const title = document.getElementById("slideTitle");
const caption = document.getElementById("slideCaption");
const counter = document.getElementById("counter");
const player = document.getElementById("scPlayer");

function soundCloudEmbed(trackUrl, autoplay=true) {
  return "https://w.soundcloud.com/player/?url=" + encodeURIComponent(trackUrl) +
    "&color=%23ff5500&auto_play=" + (autoplay ? "true" : "false") +
    "&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false";
}

function validateConfig(data) {
  if (!data || typeof data !== "object") throw new Error("The file does not contain a JSON object.");
  if (!Array.isArray(data.slides) || data.slides.length === 0)
    throw new Error("This JSON file has no slides.");
  data.slides.forEach((slide, i) => {
    if (!slide || typeof slide !== "object") throw new Error(`Slide ${i+1} is invalid.`);
    if (!slide.image) throw new Error(`Slide ${i+1} has no image.`);
  });
  return data;
}

async function openFile(file) {
  status.textContent = "";
  if (!file) return;
  try {
    const text = await file.text();
    config = validateConfig(JSON.parse(text));
    showTitle.textContent = config.title || "Soundshow";
    slideCount.textContent = `${config.slides.length} slide${config.slides.length === 1 ? "" : "s"} loaded from ${file.name}`;
    loader.classList.add("hidden");
    show.classList.add("hidden");
    readyScreen.classList.remove("hidden");
  } catch (err) {
    status.textContent = "Could not open Soundshow: " + err.message;
  }
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
  preload.onerror = () => {
    image.alt = "Could not load slide image";
  };
  preload.src = slide.image;

  title.textContent = slide.title || "";
  caption.textContent = slide.caption || "";
  counter.textContent = `${index + 1} / ${config.slides.length}`;

  player.src = slide.soundcloud ? soundCloudEmbed(slide.soundcloud, true) : "about:blank";
}

function backToLoader() {
  player.src = "about:blank";
  show.classList.add("hidden");
  readyScreen.classList.add("hidden");
  loader.classList.remove("hidden");
  fileInput.value = "";
}

fileInput.addEventListener("change", e => openFile(e.target.files[0]));

["dragenter","dragover"].forEach(type => dropZone.addEventListener(type, e => {
  e.preventDefault();
  dropZone.classList.add("dragover");
}));
["dragleave","drop"].forEach(type => dropZone.addEventListener(type, e => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
}));
dropZone.addEventListener("drop", e => openFile(e.dataTransfer.files[0]));

document.getElementById("startBtn").addEventListener("click", () => {
  readyScreen.classList.add("hidden");
  show.classList.remove("hidden");
  renderSlide(0);
});
document.getElementById("chooseAnotherBtn").addEventListener("click", backToLoader);
document.getElementById("exitBtn").addEventListener("click", backToLoader);
document.getElementById("prevBtn").addEventListener("click", () => renderSlide(index - 1));
document.getElementById("nextBtn").addEventListener("click", () => renderSlide(index + 1));

document.addEventListener("keydown", e => {
  if (show.classList.contains("hidden")) return;
  if (e.key === "ArrowLeft") renderSlide(index - 1);
  if (e.key === "ArrowRight") renderSlide(index + 1);
});
