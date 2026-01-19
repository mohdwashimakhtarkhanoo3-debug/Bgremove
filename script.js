const fileInput = document.getElementById("fileInput");
const removeBtn = document.getElementById("removeBtn");
const result = document.getElementById("result");
const downloadBtn = document.getElementById("downloadBtn");
const status = document.getElementById("status");

let resultUrl = "";

removeBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Please select an image");

  status.innerText = "Processing...";

  const apiKey = "frxfoPpbGSakYHBT8uV8igQ1"; // <-- Yahan apni API key daalo

  const formData = new FormData();
  formData.append("image_file", file);

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey
      },
      body: formData
    });

    if (!response.ok) {
      status.innerText = "Error: API request failed.";
      return;
    }

    const blob = await response.blob();
    resultUrl = URL.createObjectURL(blob);

    result.innerHTML = `<img src="${resultUrl}" alt="Result">`;
    downloadBtn.style.display = "block";
    status.innerText = "Background removed successfully!";
  } catch (error) {
    status.innerText = "Error: Something went wrong.";
    console.error(error);
  }
});

downloadBtn.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = resultUrl;
  a.download = "bg_removed.png";
  a.click();
});