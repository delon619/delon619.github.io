// Global State
const app = {
    step: 1,
    layout: null,
    photos: [],
    stream: null,
    facingMode: 'user',
    filters: {
        brightness: 100,
        contrast: 100,
        blackwhite: false
    },
    eventInfo: {
        title: 'phome',
        date: new Date().toISOString().split('T')[0]
    }
};

// Layout Configurations
const layouts = {
    'strip-3': { name: 'Strip 3', width: 600, height: 1800, photos: 3, type: 'strip' },
    'strip-4': { name: 'Strip 4', width: 600, height: 2400, photos: 4, type: 'strip' },
    '4r-land-2': { name: '4R Land 2', width: 1800, height: 1200, photos: 2, type: 'grid', cols: 2, rows: 1 },
    '4r-land-3': { name: '4R Land 3', width: 1800, height: 1200, photos: 3, type: 'grid', cols: 3, rows: 1 },
    '4r-land-4': { name: '4R Land 4', width: 1800, height: 1200, photos: 4, type: 'grid', cols: 2, rows: 2 },
    '4r-port-2': { name: '4R Port 2', width: 1200, height: 1800, photos: 2, type: 'grid', cols: 1, rows: 2 },
    '4r-port-3': { name: '4R Port 3', width: 1200, height: 1800, photos: 3, type: 'grid', cols: 1, rows: 3 },
    '4r-port-4': { name: '4R Port 4', width: 1200, height: 1800, photos: 4, type: 'grid', cols: 2, rows: 2 },
    'collage': { name: 'Collage', width: 1500, height: 1500, photos: 3, type: 'collage' },
    'square-4': { name: 'Square 4', width: 1500, height: 1500, photos: 4, type: 'grid', cols: 2, rows: 2 }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('eventDate').value = app.eventInfo.date;
});

// Step Navigation
function showStep(step) {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`step${i}`).classList.add('hidden');
    }
    document.getElementById(`step${step}`).classList.remove('hidden');
    app.step = step;
    document.getElementById('stepInfo').textContent = `Step ${step} of 4`;
}

// Layout Selection
function selectLayout(layoutId) {
    app.layout = layoutId;
    app.photos = [];
    
    document.querySelectorAll('.layout-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.layout-card').classList.add('selected');
    
    setTimeout(() => {
        document.getElementById('maxPhotos').textContent = layouts[layoutId].photos;
        renderPhotoGrid();
        showStep(2);
    }, 300);
}

// Camera Functions
async function startCamera() {
    try {
        app.stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: app.facingMode, width: 1280, height: 720 },
            audio: false
        });
        
        const video = document.getElementById('video');
        video.srcObject = app.stream;
        
        document.getElementById('placeholder').classList.add('hidden');
        document.getElementById('captureBtn').disabled = false;
        document.getElementById('switchBtn').disabled = false;
        
        showNotification('✅ Kamera berhasil diaktifkan!');
    } catch (error) {
        showNotification('❌ Gagal mengakses kamera: ' + error.message);
    }
}

async function switchCamera() {
    app.facingMode = app.facingMode === 'user' ? 'environment' : 'user';
    if (app.stream) {
        app.stream.getTracks().forEach(track => track.stop());
    }
    await startCamera();
}

async function capturePhoto() {
    const layout = layouts[app.layout];
    if (app.photos.length >= layout.photos) {
        showNotification(`⚠️ Maksimal ${layout.photos} foto untuk layout ini!`);
        return;
    }
    
    // Countdown
    const countdown = document.getElementById('countdown');
    const number = document.getElementById('countdownNumber');
    countdown.classList.remove('hidden');
    
    for (let i = 3; i > 0; i--) {
        number.textContent = i;
        await sleep(1000);
    }
    
    countdown.classList.add('hidden');
    
    // Capture
    const video = document.getElementById('video');
    const canvas = document.getElementById('captureCanvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
    
    app.photos.push(canvas.toDataURL('image/jpeg', 0.95));
    renderPhotoGrid();
    
    showNotification('✅ Foto berhasil diambil!');
    
    if (app.photos.length === layout.photos) {
        document.getElementById('nextToEditor').disabled = false;
    }
}

function uploadPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const layout = layouts[app.layout];
    if (app.photos.length >= layout.photos) {
        showNotification(`⚠️ Maksimal ${layout.photos} foto!`);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        app.photos.push(e.target.result);
        renderPhotoGrid();
        
        if (app.photos.length === layout.photos) {
            document.getElementById('nextToEditor').disabled = false;
        }
        
        showNotification('✅ Foto berhasil diupload!');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function renderPhotoGrid() {
    const layout = layouts[app.layout];
    const grid = document.getElementById('photoGrid');
    grid.innerHTML = '';
    
    document.getElementById('currentPhoto').textContent = app.photos.length;
    
    for (let i = 0; i < layout.photos; i++) {
        const slot = document.createElement('div');
        slot.className = 'photo-slot';
        
        if (app.photos[i]) {
            slot.innerHTML = `
                <img src="${app.photos[i]}" alt="Photo ${i + 1}">
                <div class="slot-actions">
                    <button class="slot-btn" onclick="deletePhoto(${i})" title="Delete">🗑️</button>
                </div>
            `;
        } else {
            slot.innerHTML = `<span class="slot-number">${i + 1}</span>`;
        }
        
        grid.appendChild(slot);
    }
}

function deletePhoto(index) {
    app.photos.splice(index, 1);
    renderPhotoGrid();
    document.getElementById('nextToEditor').disabled = app.photos.length < layouts[app.layout].photos;
}

// Editor Functions
function goToEditor() {
    const layout = layouts[app.layout];
    if (app.photos.length < layout.photos) {
        showNotification('⚠️ Lengkapi semua foto terlebih dahulu!');
        return;
    }
    
    showStep(3);
    updatePreview();
}

function applyFilters() {
    app.filters.brightness = document.getElementById('brightness').value;
    app.filters.contrast = document.getElementById('contrast').value;
    app.filters.blackwhite = document.getElementById('blackwhite').checked;
    
    document.getElementById('brightnessVal').textContent = app.filters.brightness;
    document.getElementById('contrastVal').textContent = app.filters.contrast;
    
    updatePreview();
}

function resetFilters() {
    app.filters = { brightness: 100, contrast: 100, blackwhite: false };
    document.getElementById('brightness').value = 100;
    document.getElementById('contrast').value = 100;
    document.getElementById('blackwhite').checked = false;
    document.getElementById('brightnessVal').textContent = 100;
    document.getElementById('contrastVal').textContent = 100;
    updatePreview();
}

function updatePreview() {
    app.eventInfo.title = document.getElementById('eventTitle').value;
    app.eventInfo.date = document.getElementById('eventDate').value;
    
    const canvas = document.getElementById('previewCanvas');
    renderCanvas(canvas);
}

// Canvas Rendering
async function renderCanvas(canvas) {
    const layout = layouts[app.layout];
    const ctx = canvas.getContext('2d');
    
    canvas.width = layout.width;
    canvas.height = layout.height;
    
    // Background - Full Black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border (inner area for photos)
    const border = 40;
    const footerHeight = 100;
    
    // Photos area - di atas
    const contentTop = border;
    const contentHeight = canvas.height - border - footerHeight - border;
    const contentWidth = canvas.width - 2 * border;
    
    if (layout.type === 'strip') {
        await renderStripLayout(ctx, layout, border, contentTop, contentWidth, contentHeight);
    } else if (layout.type === 'grid') {
        await renderGridLayout(ctx, layout, border, contentTop, contentWidth, contentHeight);
    } else if (layout.type === 'collage') {
        await renderCollageLayout(ctx, layout, border, contentTop, contentWidth, contentHeight);
    }
    
    // Footer with white text on black background - di bawah foto, tengah vertikal dan horizontal
    const footerY = contentTop + contentHeight + ((canvas.height - (contentTop + contentHeight) - border) / 2);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 24px Ailerons, "Futura", "Century Gothic", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(app.eventInfo.title.toUpperCase(), canvas.width / 2, footerY - 15);
    
    if (app.eventInfo.date) {
        const [year, month, day] = app.eventInfo.date.split('-');
        ctx.font = '400 24px Ailerons, "Futura", "Century Gothic", sans-serif';
        ctx.letterSpacing = '1px';
        ctx.fillText(`${day}.${month}.${year}`, canvas.width / 2, footerY + 20);
    }
}

async function renderStripLayout(ctx, layout, x, y, width, height) {
    const gap = 30;
    const frameHeight = (height - gap * (layout.photos - 1)) / layout.photos;
    
    for (let i = 0; i < layout.photos; i++) {
        const frameY = y + i * (frameHeight + gap);
        
        if (app.photos[i]) {
            await drawPhoto(ctx, app.photos[i], x, frameY, width, frameHeight);
        }
    }
}

async function renderGridLayout(ctx, layout, x, y, width, height) {
    const gap = 30;
    const frameWidth = (width - gap * (layout.cols - 1)) / layout.cols;
    const frameHeight = (height - gap * (layout.rows - 1)) / layout.rows;
    
    for (let i = 0; i < layout.photos; i++) {
        const col = i % layout.cols;
        const row = Math.floor(i / layout.cols);
        const frameX = x + col * (frameWidth + gap);
        const frameY = y + row * (frameHeight + gap);
        
        if (app.photos[i]) {
            await drawPhoto(ctx, app.photos[i], frameX, frameY, frameWidth, frameHeight);
        }
    }
}

async function renderCollageLayout(ctx, layout, x, y, width, height) {
    const gap = 30;
    const largeWidth = width * 0.6;
    const smallWidth = width - largeWidth - gap;
    const smallHeight = (height - gap) / 2;
    
    // Large photo
    if (app.photos[0]) {
        await drawPhoto(ctx, app.photos[0], x, y, largeWidth, height);
    }
    
    // Small photos
    for (let i = 1; i < 3; i++) {
        const smallY = y + (i - 1) * (smallHeight + gap);
        
        if (app.photos[i]) {
            await drawPhoto(ctx, app.photos[i], x + largeWidth + gap, smallY, smallWidth, smallHeight);
        }
    }
}

async function drawPhoto(ctx, photoSrc, x, y, width, height) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            ctx.save();
            
            // Clip to frame
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.clip();
            
            // Apply filters
            const brightness = app.filters.brightness / 100;
            const contrast = (app.filters.contrast - 100) / 100;
            
            if (app.filters.blackwhite) {
                ctx.filter = `brightness(${brightness}) contrast(${1 + contrast}) grayscale(100%)`;
            } else {
                ctx.filter = `brightness(${brightness}) contrast(${1 + contrast})`;
            }
            
            // Draw image (cover fit)
            const scale = Math.max(width / img.width, height / img.height);
            const imgWidth = img.width * scale;
            const imgHeight = img.height * scale;
            const imgX = x + (width - imgWidth) / 2;
            const imgY = y + (height - imgHeight) / 2;
            
            ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
            
            ctx.restore();
            resolve();
        };
        img.src = photoSrc;
    });
}

// Export Functions
function goToExport() {
    showStep(4);
    const canvas = document.getElementById('finalCanvas');
    renderCanvas(canvas);
}

function downloadImage(format) {
    const canvas = document.getElementById('finalCanvas');
    const link = document.createElement('a');
    const timestamp = Date.now();
    
    if (format === 'png') {
        link.download = `phome-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
    } else {
        link.download = `phome-${timestamp}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
    }
    
    link.click();
    showNotification(`✅ Berhasil download ${format.toUpperCase()}!`);
}

// Reset
function resetApp() {
    if (app.stream) {
        app.stream.getTracks().forEach(track => track.stop());
    }
    
    app.step = 1;
    app.layout = null;
    app.photos = [];
    app.stream = null;
    app.filters = { brightness: 100, contrast: 100, blackwhite: false };
    
    document.querySelectorAll('.layout-card').forEach(card => card.classList.remove('selected'));
    document.getElementById('placeholder').classList.remove('hidden');
    document.getElementById('captureBtn').disabled = true;
    document.getElementById('switchBtn').disabled = true;
    document.getElementById('nextToEditor').disabled = true;
    
    showStep(1);
}

// Utilities
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

console.log('🎉 Phome PhotoBox Studio - Ready!');
