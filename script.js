const fileInput = document.getElementById("fileInput");
const removeBtn = document.getElementById("removeBtn");
const result = document.getElementById("result");
const downloadBtn = document.getElementById("downloadBtn");
const status = document.getElementById("status");
const loader = document.getElementById("loader");
const fileName = document.getElementById("fileName");

let resultUrl = "";

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  fileName.innerText = file ? file.name : "No file chosen";
});

removeBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Please select an image");

  status.innerText = "";
  loader.style.display = "block";
  downloadBtn.style.display = "none";
  result.innerHTML = "";

  const apiKey = "frxfoPpbGSakYHBT8uV8igQ1"; // <-- Yahan apni API key daalo

  const formData = new FormData();
  formData.append("image_file", file);

  // HD options
  formData.append("size", "auto");   // HD quality
  formData.append("type", "product"); // best cut
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

    result.innerHTML = `<img src="${resultUrl}" alt="Result">`;
    downloadBtn.style.display = "block";
    status.innerText = "Background removed successfully in HD!";
  } catch (error) {
    loader.style.display = "none";
    status.innerText = "Error: Something went wrong.";
    console.error(error);
  }
});

downloadBtn.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = resultUrl;
  a.download = "bg_removed_hd.png";
  a.click();
});
