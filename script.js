const fileInput = document.getElementById("fileInput");
const removeBtn = document.getElementById("removeBtn");
const result = document.getElementById("result");
const downloadBtn = document.getElementById("downloadBtn");
const status = document.getElementById("status");
const loader = document.getElementById("loader");
const fileName = document.getElementById("fileName");

const toggleButtons = document.querySelector(".toggleButtons");
const beforeBtn = document.getElementById("beforeBtn");
const afterBtn = document.getElementById("afterBtn");

const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");

let resultUrl = "";
let beforeUrl = "";

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  fileName.innerText = file ? file.name : "No file chosen";
  if (file) {
    beforeUrl = URL.createObjectURL(file);
    beforeImg.src = beforeUrl;
  }
});

removeBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Please select an image");

  status.innerText = "";
  loader.style.display = "block";
  downloadBtn.style.display = "none";
  toggleButtons.style.display = "none";
  beforeImg.style.display = "none";
  afterImg.style.display = "none";

  const apiKey = "frxfoPpbGSakYHBT8uV8igQ1"; // <-- API key

  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");
  formData.append("type", "product");
  formData.append("format", "png");

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey
      },
      body: formData
    });

    loader.style.display = "none";

    if (!response.ok) {
      const err = await response.json();
      status.innerText = "Error: " + (err.errors ? err.errors[0].title : "API request failed.");
      return;
    }

    const blob = await response.blob();
    resultUrl = URL.createObjectURL(blob);
    afterImg.src = resultUrl;

    // show toggle buttons
    toggleButtons.style.display = "flex";

    // show After image by default
    showAfter();

    downloadBtn.style.display = "block";
    status.innerText = "Background removed successfully!";
  } catch (error) {
    loader.style.display = "none";
    status.innerText = "Error: Something went wrong.";
    console.error(error);
  }
});

function showBefore() {
  beforeImg.style.display = "block";
  afterImg.style.display = "none";
}

function showAfter() {
  beforeImg.style.display = "none";
  afterImg.style.display = "block";
}

beforeBtn.addEventListener("click", showBefore);
afterBtn.addEventListener("click", showAfter);

downloadBtn.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = resultUrl;
  a.download = "bg_removed_hd.png";
  a.click();
});
