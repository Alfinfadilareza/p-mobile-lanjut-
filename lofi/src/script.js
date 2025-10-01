// Aplikasi PDF Scanner dengan Tampilan Lo-Fi
class PDFScannerApp {
    constructor() {
        this.stream = null;
        this.capturedImages = [];
        this.documents = [];
        this.currentView = 'homeView';
        this.isCameraActive = false;
        this.useRearCamera = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadDocuments();
        this.updateRecentDocuments();
    }
    
    initializeElements() {
        // Views
        this.views = {
            scannerView: document.getElementById('scannerView'),
            homeView: document.getElementById('homeView'),
            settingsView: document.getElementById('settingsView')
        };
        
        // Scanner elements
        this.cameraPreview = document.getElementById('cameraPreview');
        this.enableCameraBtn = document.getElementById('enableCameraBtn');
        this.switchCameraBtn = document.getElementById('switchCameraBtn');
        this.captureBtn = document.getElementById('captureBtn');
        this.fileSelectBtn = document.getElementById('fileSelectBtn');
        this.imagesContainer = document.getElementById('imagesContainer');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.createPdfBtn = document.getElementById('createPdfBtn');
        
        // File input
        this.fileInput = document.getElementById('fileInput');
        
        // Home elements
        this.quickScanBtn = document.getElementById('quickScanBtn');
        this.viewHistoryBtn = document.getElementById('viewHistoryBtn');
        this.tutorialBtn = document.getElementById('tutorialBtn');
        this.recentDocuments = document.getElementById('recentDocuments');
        
        // Navigation
        this.navItems = document.querySelectorAll('.nav-item[data-view]');
        this.cameraNavBtn = document.getElementById('cameraNavBtn');
        
        // Modal elements
        this.pdfModal = document.getElementById('pdfModal');
        this.pdfNameInput = document.getElementById('pdfName');
        this.pdfQualitySelect = document.getElementById('pdfQuality');
        this.generatePdfBtn = document.getElementById('generatePdfBtn');
        this.cancelPdfBtn = document.getElementById('cancelPdfBtn');
        this.closePdfModal = document.getElementById('closePdfModal');
        
        // Settings toggles
        this.rearCameraToggle = document.getElementById('rearCameraToggle');
        this.autoDetectToggle = document.getElementById('autoDetectToggle');
        this.highQualityToggle = document.getElementById('highQualityToggle');
        this.a4FormatToggle = document.getElementById('a4FormatToggle');
        this.rateAppBtn = document.getElementById('rateAppBtn');
        this.helpSettingBtn = document.getElementById('helpSettingBtn');
        
        // Toast
        this.toast = document.getElementById('toast');
    }
    
    attachEventListeners() {
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const viewId = item.getAttribute('data-view');
                this.switchView(viewId);
            });
        });
        
        // Camera navigation button (center)
        this.cameraNavBtn.addEventListener('click', () => {
            this.switchView('scannerView');
            if (!this.isCameraActive) {
                this.startCamera();
            }
        });
        
        // Scanner controls
        this.enableCameraBtn.addEventListener('click', () => this.startCamera());
        this.switchCameraBtn.addEventListener('click', () => this.toggleCamera());
        this.captureBtn.addEventListener('click', () => this.captureImage());
        this.fileSelectBtn.addEventListener('click', () => this.fileInput.click());
        this.clearAllBtn.addEventListener('click', () => this.clearAllImages());
        this.createPdfBtn.addEventListener('click', () => this.openPdfModal());
        
        // File input
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Home controls
        this.quickScanBtn.addEventListener('click', () => {
            this.switchView('scannerView');
            if (!this.isCameraActive) {
                this.startCamera();
            }
        });
        
        this.viewHistoryBtn.addEventListener('click', () => {
            this.showToast('Fitur riwayat akan segera hadir');
        });
        
        this.tutorialBtn.addEventListener('click', () => {
            this.showToast('Panduan penggunaan aplikasi');
        });
        
        // Modal controls
        this.generatePdfBtn.addEventListener('click', () => this.generatePDF());
        this.cancelPdfBtn.addEventListener('click', () => this.closeModal());
        this.closePdfModal.addEventListener('click', () => this.closeModal());
        
        // Settings controls
        this.rateAppBtn.addEventListener('click', () => {
            this.showToast('Terima kasih atas rating Anda!');
        });
        
        this.helpSettingBtn.addEventListener('click', () => {
            this.showToast('Bantuan dan panduan penggunaan');
        });
        
        // Close modal when clicking outside
        this.pdfModal.addEventListener('click', (e) => {
            if (e.target === this.pdfModal) {
                this.closeModal();
            }
        });
        
        // Settings toggles
        this.rearCameraToggle.addEventListener('change', () => {
            this.useRearCamera = this.rearCameraToggle.checked;
            if (this.isCameraActive) {
                this.restartCamera();
            }
        });
    }
    
    switchView(viewId) {
        // Hide all views
        Object.values(this.views).forEach(view => {
            view.classList.remove('active');
        });
        
        // Show selected view
        this.views[viewId].classList.add('active');
        this.currentView = viewId;
        
        // Update navigation
        this.navItems.forEach(item => {
            if (item.getAttribute('data-view') === viewId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update camera nav button
        if (viewId === 'scannerView' && this.isCameraActive) {
            this.cameraNavBtn.querySelector('.nav-center-icon').textContent = '📸';
        } else {
            this.cameraNavBtn.querySelector('.nav-center-icon').textContent = '📷';
        }
        
        // Stop camera if not in scanner view
        if (viewId !== 'scannerView' && this.isCameraActive) {
            this.stopCamera();
        }
        
        // Update recent documents if switching to home view
        if (viewId === 'homeView') {
            this.updateRecentDocuments();
        }
    }
    
    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: this.useRearCamera ? 'environment' : 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            const video = document.createElement('video');
            video.srcObject = this.stream;
            video.autoplay = true;
            video.playsInline = true;
            
            this.cameraPreview.innerHTML = '';
            this.cameraPreview.appendChild(video);
            
            this.isCameraActive = true;
            this.enableCameraBtn.style.display = 'none';
            this.switchCameraBtn.disabled = false;
            this.captureBtn.disabled = false;
            
            // Update camera nav button
            this.cameraNavBtn.querySelector('.nav-center-icon').textContent = '📸';
            
            this.showToast('Kamera berhasil diaktifkan');
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showToast('Tidak dapat mengakses kamera', 5000);
        }
    }
    
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.isCameraActive = false;
        this.cameraPreview.innerHTML = `
            <div class="camera-placeholder">
                <div class="placeholder-icon">📷</div>
                <p>Kamera tidak aktif</p>
                <button id="enableCameraBtn" class="btn btn-primary">Aktifkan Kamera</button>
            </div>
        `;
        
        // Re-attach event listener to the new button
        document.getElementById('enableCameraBtn').addEventListener('click', () => this.startCamera());
        
        this.switchCameraBtn.disabled = true;
        this.captureBtn.disabled = true;
        
        // Update camera nav button
        this.cameraNavBtn.querySelector('.nav-center-icon').textContent = '📷';
    }
    
    async toggleCamera() {
        this.useRearCamera = !this.useRearCamera;
        this.restartCamera();
    }
    
    async restartCamera() {
        this.stopCamera();
        // Small delay to ensure camera is fully stopped
        setTimeout(() => this.startCamera(), 300);
    }
    
    captureImage() {
        if (!this.stream) return;
        
        const video = this.cameraPreview.querySelector('video');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageDataURL = canvas.toDataURL('image/jpeg', 0.8);
        this.addImageToCollection(imageDataURL);
        
        this.showToast('Gambar berhasil diambil');
    }
    
    handleFileSelect(event) {
        const files = event.target.files;
        if (files.length === 0) return;
        
        const file = files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const imageDataURL = e.target.result;
            this.addImageToCollection(imageDataURL);
            this.showToast('Gambar berhasil ditambahkan');
        };
        
        reader.readAsDataURL(file);
        
        // Reset file input
        event.target.value = '';
    }
    
    addImageToCollection(imageDataURL) {
        this.capturedImages.push(imageDataURL);
        this.updateImagesView();
        
        // Enable PDF creation if we have images
        if (this.capturedImages.length > 0) {
            this.clearAllBtn.disabled = false;
            this.createPdfBtn.disabled = false;
        }
    }
    
    updateImagesView() {
        if (this.capturedImages.length === 0) {
            this.imagesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🖼️</div>
                    <p>Belum ada gambar</p>
                </div>
            `;
            return;
        }
        
        this.imagesContainer.innerHTML = '';
        
        this.capturedImages.forEach((imageDataURL, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            
            const img = document.createElement('img');
            img.src = imageDataURL;
            img.alt = `Gambar ${index + 1}`;
            
            const imageActions = document.createElement('div');
            imageActions.className = 'image-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'image-action-btn';
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.title = 'Hapus gambar';
            deleteBtn.onclick = () => this.deleteImage(index);
            
            const moveUpBtn = document.createElement('button');
            moveUpBtn.className = 'image-action-btn';
            moveUpBtn.innerHTML = '⬆️';
            moveUpBtn.title = 'Pindah ke atas';
            moveUpBtn.onclick = () => this.moveImage(index, 'up');
            moveUpBtn.disabled = index === 0;
            
            const moveDownBtn = document.createElement('button');
            moveDownBtn.className = 'image-action-btn';
            moveDownBtn.innerHTML = '⬇️';
            moveDownBtn.title = 'Pindah ke bawah';
            moveDownBtn.onclick = () => this.moveImage(index, 'down');
            moveDownBtn.disabled = index === this.capturedImages.length - 1;
            
            imageActions.appendChild(deleteBtn);
            imageActions.appendChild(moveUpBtn);
            imageActions.appendChild(moveDownBtn);
            
            imageItem.appendChild(img);
            imageItem.appendChild(imageActions);
            
            this.imagesContainer.appendChild(imageItem);
        });
    }
    
    deleteImage(index) {
        this.capturedImages.splice(index, 1);
        this.updateImagesView();
        
        if (this.capturedImages.length === 0) {
            this.clearAllBtn.disabled = true;
            this.createPdfBtn.disabled = true;
        }
        
        this.showToast('Gambar dihapus');
    }
    
    moveImage(index, direction) {
        if (direction === 'up' && index > 0) {
            [this.capturedImages[index], this.capturedImages[index - 1]] = 
            [this.capturedImages[index - 1], this.capturedImages[index]];
        } else if (direction === 'down' && index < this.capturedImages.length - 1) {
            [this.capturedImages[index], this.capturedImages[index + 1]] = 
            [this.capturedImages[index + 1], this.capturedImages[index]];
        }
        
        this.updateImagesView();
    }
    
    clearAllImages() {
        if (this.capturedImages.length === 0) return;
        
        if (confirm('Apakah Anda yakin ingin menghapus semua gambar?')) {
            this.capturedImages = [];
            this.updateImagesView();
            this.clearAllBtn.disabled = true;
            this.createPdfBtn.disabled = true;
            this.showToast('Semua gambar telah dihapus');
        }
    }
    
    openPdfModal() {
        this.pdfModal.style.display = 'flex';
        this.pdfNameInput.focus();
    }
    
    closeModal() {
        this.pdfModal.style.display = 'none';
    }
    
    generatePDF() {
        if (this.capturedImages.length === 0) {
            this.showToast('Tidak ada gambar untuk dibuat PDF');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const pdfName = this.pdfNameInput.value.trim() || 'Dokumen Saya';
        const timestamp = new Date().toLocaleString();
        
        this.closeModal();
        
        // Add each image to PDF
        this.capturedImages.forEach((imageDataURL, index) => {
            if (index > 0) {
                pdf.addPage();
            }
            
            const img = new Image();
            img.src = imageDataURL;
            
            img.onload = () => {
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = (img.height * imgWidth) / img.width;
                
                pdf.addImage(imageDataURL, 'JPEG', 0, 0, imgWidth, imgHeight);
                
                if (index === this.capturedImages.length - 1) {
                    pdf.save(`${pdfName}.pdf`);
                    
                    // Add to documents
                    this.addDocument(pdfName, timestamp, this.capturedImages.length);
                    
                    // Reset images
                    this.capturedImages = [];
                    this.updateImagesView();
                    this.clearAllBtn.disabled = true;
                    this.createPdfBtn.disabled = true;
                    
                    this.showToast('PDF berhasil dibuat');
                    
                    // Update recent documents
                    this.updateRecentDocuments();
                }
            };
        });
    }
    
    addDocument(name, timestamp, pageCount) {
        const document = {
            id: Date.now(),
            name: name,
            timestamp: timestamp,
            pageCount: pageCount
        };
        
        this.documents.unshift(document);
        this.saveDocuments();
    }
    
    updateRecentDocuments() {
        if (this.documents.length === 0) {
            this.recentDocuments.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📄</div>
                    <p>Belum ada dokumen</p>
                    <p class="empty-subtitle">Dokumen yang Anda buat akan muncul di sini</p>
                </div>
            `;
            return;
        }
        
        this.recentDocuments.innerHTML = '';
        
        // Show only the 3 most recent documents
        const recentDocs = this.documents.slice(0, 3);
        
        recentDocs.forEach(doc => {
            const documentItem = document.createElement('div');
            documentItem.className = 'document-item';
            documentItem.onclick = () => {
                this.showToast(`Membuka ${doc.name}.pdf`);
            };
            
            documentItem.innerHTML = `
                <div class="document-icon">📄</div>
                <div class="document-info">
                    <div class="document-name">${doc.name}.pdf</div>
                    <div class="document-meta">${doc.timestamp} • ${doc.pageCount} halaman</div>
                </div>
            `;
            
            this.recentDocuments.appendChild(documentItem);
        });
    }
    
    saveDocuments() {
        localStorage.setItem('pdfScannerDocuments', JSON.stringify(this.documents));
    }
    
    loadDocuments() {
        const saved = localStorage.getItem('pdfScannerDocuments');
        if (saved) {
            this.documents = JSON.parse(saved);
        }
    }
    
    showToast(message, duration = 3000) {
        this.toast.textContent = message;
        this.toast.style.display = 'block';
        
        setTimeout(() => {
            this.toast.style.display = 'none';
        }, duration);
    }
}

// Initialize the app when the DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PDFScannerApp();
});