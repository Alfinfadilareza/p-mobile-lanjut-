
document.addEventListener("DOMContentLoaded", () => {
  const views = document.querySelectorAll(".view");
  const bottomNav = document.getElementById("bottomNav");

  // === Elemen utama ===
  const homeView = document.getElementById("homeView");
  const scannerView = document.getElementById("scannerView");
  const previewView = document.getElementById("previewView");
  const resultView = document.getElementById("resultView");

  // Kamera
  const enableCameraBtn = document.getElementById("enableCameraBtn");
  const captureBtn = document.getElementById("captureBtn");
  const cameraPreview = document.getElementById("cameraPreview");

  // Preview
  const previewImage = document.getElementById("previewImage");
  const backBtn = document.getElementById("backBtn");
  const backToCameraBtn = document.getElementById("backToCameraBtn");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const saveImageBtn = document.getElementById("saveImageBtn");
  const rotateImageBtn = document.getElementById("rotateImageBtn");
  const cropImageBtn = document.getElementById("cropImageBtn");

  // Hasil
  const finalImage = document.getElementById("finalImage");
  const downloadBtn = document.getElementById("downloadBtn");
  const shareBtn = document.getElementById("shareBtn");
  const backToPreviewBtn = document.getElementById("backToPreviewBtn");

  // Variabel global
  let currentStream = null;
  let currentFilter = "none";
  let rotation = 0;
  let isCropping = false;
  let cropStart = null;
  let cropRect = null;
  let overlayCanvas = null;
  let overlayCtx = null;
  let finalImageData = null;

  // === Fungsi bantu: tampilkan view ===
  function showView(id) {
    views.forEach(v => v.classList.add("hidden"));
    document.getElementById(id)?.classList.remove("hidden");

    // sembunyikan bottom nav di halaman non-home
    if (["scannerView", "previewView", "resultView"].includes(id)) {
      bottomNav?.classList.add("hidden");
    } else {
      bottomNav?.classList.remove("hidden");
    }
  }

  // === Navigasi antar view ===
  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      showView(btn.dataset.view);
    });
  });

  // === Aktifkan kamera ===
  enableCameraBtn?.addEventListener("click", async () => {
    try {
      if (currentStream) currentStream.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      currentStream = stream;

      cameraPreview.innerHTML = "";
      const video = document.createElement("video");
      video.autoplay = true;
      video.playsInline = true;
      video.srcObject = stream;
      video.className = "w-full h-full object-cover rounded-2xl";
      cameraPreview.appendChild(video);
    } catch (err) {
      alert("Gagal membuka kamera: " + err.message);
    }
  });

  // === Tangkap gambar ===
  captureBtn?.addEventListener("click", () => {
    const video = cameraPreview.querySelector("video");
    if (!video) return alert("Kamera belum aktif!");

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    previewImage.src = canvas.toDataURL("image/png");
    previewImage.style.filter = "none";
    previewImage.style.transform = "none";
    rotation = 0;
    currentFilter = "none";

    currentStream.getTracks().forEach(t => t.stop());
    showView("previewView");
  });

  // === Navigasi tombol ===
  backBtn?.addEventListener("click", () => showView("homeView"));
  backToCameraBtn?.addEventListener("click", () => showView("scannerView"));
  backToPreviewBtn?.addEventListener("click", () => showView("previewView"));

  // === Filter ===
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter || "none";
      previewImage.style.filter = currentFilter;
    });
  });

  // === Rotasi ===
  rotateImageBtn?.addEventListener("click", () => {
    rotation = (rotation + 90) % 360;
    previewImage.style.transform = `rotate(${rotation}deg)`;
  });

  // === Crop Gambar ===
  cropImageBtn?.addEventListener("click", () => {
    if (isCropping) return;
    isCropping = true;

    overlayCanvas = document.createElement("canvas");
    overlayCanvas.width = previewImage.clientWidth;
    overlayCanvas.height = previewImage.clientHeight;
    overlayCanvas.style.position = "absolute";
    overlayCanvas.style.left = previewImage.offsetLeft + "px";
    overlayCanvas.style.top = previewImage.offsetTop + "px";
    overlayCanvas.style.zIndex = "999";
    overlayCanvas.style.cursor = "crosshair";

    overlayCtx = overlayCanvas.getContext("2d");
    previewImage.parentElement.appendChild(overlayCanvas);

    overlayCanvas.addEventListener("mousedown", startCrop);
    overlayCanvas.addEventListener("mousemove", drawCrop);
    overlayCanvas.addEventListener("mouseup", finishCrop);
  });

  function startCrop(e) {
    const rect = overlayCanvas.getBoundingClientRect();
    cropStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function drawCrop(e) {
    if (!cropStart) return;
    const rect = overlayCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = x - cropStart.x;
    const h = y - cropStart.y;

    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    overlayCtx.strokeStyle = "red";
    overlayCtx.lineWidth = 2;
    overlayCtx.setLineDash([5]);
    overlayCtx.strokeRect(cropStart.x, cropStart.y, w, h);
    cropRect = { x: cropStart.x, y: cropStart.y, width: w, height: h };
  }

  function finishCrop() {
    if (!cropRect) return cleanupCrop();

    const img = previewImage;
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    const sx = cropRect.width < 0 ? cropRect.x + cropRect.width : cropRect.x;
    const sy = cropRect.height < 0 ? cropRect.y + cropRect.height : cropRect.y;
    const sw = Math.abs(cropRect.width);
    const sh = Math.abs(cropRect.height);

    const canvas = document.createElement("canvas");
    canvas.width = sw * scaleX;
    canvas.height = sh * scaleY;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      img,
      sx * scaleX,
      sy * scaleY,
      sw * scaleX,
      sh * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    previewImage.src = canvas.toDataURL("image/png");
    cleanupCrop();
  }

  function cleanupCrop() {
    isCropping = false;
    cropStart = null;
    cropRect = null;
    overlayCanvas?.remove();
    overlayCanvas = null;
  }

  // === Simpan Gambar ===
  saveImageBtn?.addEventListener("click", () => {
    const img = previewImage;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.filter = currentFilter;

    // Terapkan rotasi manual
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();

    finalImageData = canvas.toDataURL("image/png");
    finalImage.src = finalImageData;
    showView("resultView");
  });

  // === Unduh sebagai PDF ===
  downloadBtn?.addEventListener("click", () => {
    if (!finalImageData) return alert("Belum ada gambar untuk diunduh.");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const img = new Image();
    img.src = finalImageData;
    img.onload = () => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const x = (pageWidth - w) / 2;
      const y = (pageHeight - h) / 2;
      pdf.addImage(img, "PNG", x, y, w, h);
      pdf.save(`hasil-edit-${Date.now()}.pdf`);
    };
  });

  // === Bagikan ===
  shareBtn?.addEventListener("click", async () => {
    if (!finalImageData) return alert("Belum ada gambar untuk dibagikan.");
    if (!navigator.share) return alert("Browser tidak mendukung fitur berbagi.");

    const blob = await (await fetch(finalImageData)).blob();
    const file = new File([blob], "hasil-edit.png", { type: blob.type });
    await navigator.share({
      title: "Hasil Edit Gambar",
      text: "Lihat hasil editanku!",
      files: [file],
    });
  });

  // Tampilan awal
  showView("homeView");
});
