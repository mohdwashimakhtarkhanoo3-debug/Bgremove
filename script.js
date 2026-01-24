const fileInput = document.getElementById("fileInput");
const removeBtn = document.getElementById("removeBtn");
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

  // Resize before sending (fast)
  const resizedFile = await resizeImage(file, 1000);

  const apiKey = "frxfoPpbGSakYHBT8uV8igQ1";

  const formData = new FormData();
  formData.append("image_file", resizedFile);
  formData.append("size", "auto");
  formData.append("type", "product");
  formData.append("format", "png");

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": sandbox_sk_pr_wow_5bc39e6506292b82cc14caa32e606476b948c2b8
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

    toggleButtons.style.display = "flex";
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

// Resize function
function resizeImage(file, maxWidth) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const resizedFile = new File([blob], file.name, { type: "image/jpeg" });
        resolve(resizedFile);
      }, "image/jpeg", 0.9);
    };
    img.src = URL.createObjectURL(file);
  });
}
