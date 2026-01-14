/**
 * PixelView - Professional Image Gallery
 * Vanilla JS (Option B)
 */

// --------------------------------------------
// Helpers
// --------------------------------------------
function unsplash(id) {
    // Stable Unsplash format + crop; helps reduce blank loads
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function makePlaceholderDataUrl(label = 'Image') {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
            <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stop-color="#4361ee" stop-opacity="0.35" />
                    <stop offset="1" stop-color="#7c3aed" stop-opacity="0.35" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g)" />
            <g fill="#ffffff" opacity="0.9" font-family="Segoe UI, Arial" text-anchor="middle">
                <text x="600" y="450" font-size="48" font-weight="700">${escapeHtml(label)}</text>
                <text x="600" y="515" font-size="20" opacity="0.85">PixelView</text>
            </g>
        </svg>
    `.trim();
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// --------------------------------------------
// Image Data (mutable so delete works)
// --------------------------------------------
let images = [
    // Nature
    { id: 1, src: unsplash('photo-1506905925346-21bda4d32df4'), title: 'Mountain Peak', category: 'nature' },
    { id: 2, src: unsplash('photo-1507003211169-0a1dd7228f2d'), title: 'Forest Trail', category: 'nature' },
    { id: 3, src: unsplash('photo-1433086966358-54859d0ed716'), title: 'Waterfall', category: 'nature' },
    { id: 4, src: unsplash('photo-1470071459604-3b5ec3a7fe05'), title: 'Misty Valley', category: 'nature' },

    // City
    { id: 5, src: unsplash('photo-1477959858617-67f85cf4f1df'), title: 'Chicago Night', category: 'city' },
    { id: 6, src: unsplash('photo-1480714378408-67cf0d13bc1b'), title: 'City Streets', category: 'city' },
    { id: 7, src: unsplash('photo-1514565131-fce0801e5785'), title: 'Skyline Glow', category: 'city' },
    { id: 8, src: unsplash('photo-1449034446853-66c86144b0ad'), title: 'Modern Arch', category: 'city' },

    // Cricket
    { id: 9, src: unsplash('photo-1531415074968-bc2d63cc2058'), title: 'Cricket Action', category: 'cricket' },
    { id: 10, src: unsplash('photo-1584715040504-71748dbe0bdc'), title: 'Batsman Ready', category: 'cricket' },
    { id: 11, src: unsplash('photo-1540747913346-19e32dc3e97e'), title: 'Stadium Lights', category: 'cricket' },
    { id: 12, src: unsplash('photo-1587053142037-c0e8e27ac91d'), title: 'Field View', category: 'cricket' },

    // Companies
    { id: 13, src: unsplash('photo-1497366216548-37526070297c'), title: 'Corporate Office', category: 'companies' },
    { id: 14, src: unsplash('photo-1497366811353-6870744d04b2'), title: 'Meeting Room', category: 'companies' },
    { id: 15, src: unsplash('photo-1486406146926-c627a92ad1ab'), title: 'Business Tower', category: 'companies' },
    { id: 16, src: unsplash('photo-1554469384-e58fac16e23a'), title: 'Startup Space', category: 'companies' },

    // Travel
    { id: 17, src: unsplash('photo-1500530855697-b586d89ba3ee'), title: 'Road Trip', category: 'travel' },
    { id: 18, src: unsplash('photo-1501785888041-af3ef285b470'), title: 'Adventure Trail', category: 'travel' },
    { id: 19, src: unsplash('photo-1476514525535-07fb3b4ae5f1'), title: 'Ocean Escape', category: 'travel' },
    { id: 20, src: unsplash('photo-1491553895911-0055eca6402d'), title: 'Cabin Stay', category: 'travel' },

    // Animals
    { id: 21, src: unsplash('photo-1546182990-dffeafbe841d'), title: 'Cat Portrait', category: 'animals' },
    { id: 22, src: unsplash('photo-1518791841217-8f162f1e1131'), title: 'Dog Close-up', category: 'animals' },
    { id: 23, src: unsplash('photo-1508672019048-805c876b67e2'), title: 'Wildlife', category: 'animals' },
    { id: 24, src: unsplash('photo-1517849845537-4d257902454a'), title: 'Puppy Eyes', category: 'animals' },

    // Food
    { id: 25, src: unsplash('photo-1504674900247-0877df9cc836'), title: 'Breakfast', category: 'food' },
    { id: 26, src: unsplash('photo-1490645935967-10de6ba17061'), title: 'Fresh Salad', category: 'food' },
    { id: 27, src: unsplash('photo-1504754524776-8f4f37790ca0'), title: 'Coffee Time', category: 'food' },
    { id: 28, src: unsplash('photo-1484723091739-30a097e8f929'), title: 'Dessert', category: 'food' }
];

// Edited images live in their own category
let editedImages = [];

// --------------------------------------------
// State
// --------------------------------------------
const state = {
    currentCategory: 'all',
    selectedImages: new Set(),
    currentImageIndex: 0,
    filteredImages: [],
    isLightboxOpen: false,
    isEditorOpen: false,
    isSelectionMode: false,
    originalImageData: null,
    editingSettings: {
        brightness: 100,
        contrast: 100,
        blur: 0,
        saturate: 100,
        sepia: 0,
        grayscale: 0,
        fade: 100,
        rotate: 0,
        scale: 100,
        flipH: 1,
        flipV: 1,
        filter: 'none',
        crop: 'none' // none | 1:1 | 4:3 | 16:9
    }
};

// --------------------------------------------
// DOM
// --------------------------------------------
const elements = {
    gallery: document.getElementById('gallery'),
    themeToggle: document.getElementById('themeToggle'),
    lightbox: document.getElementById('lightbox'),
    lightboxImage: document.getElementById('lightboxImage'),
    imageTitle: document.getElementById('imageTitle'),
    imageCategory: document.getElementById('imageCategory'),
    lightboxClose: document.getElementById('lightboxClose'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    selectModeBtn: document.getElementById('selectModeBtn'),
    selectAllBtn: document.getElementById('selectAllBtn'),
    deleteSelectedBtn: document.getElementById('deleteSelectedBtn'),
    selectionIndicator: document.getElementById('selectionIndicator'),
    selectedCount: document.getElementById('selectedCount'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    editorPanel: document.getElementById('editorPanel'),
    editBtn: document.getElementById('editBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    saveEditBtn: document.getElementById('saveEditBtn'),
    discardEditBtn: document.getElementById('discardEditBtn'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    filtersGrid: document.getElementById('filtersGrid'),
    cropOverlay: document.getElementById('cropOverlay'),
    imageViewport: document.getElementById('imageViewport'),
    brightness: document.getElementById('brightness'),
    contrast: document.getElementById('contrast'),
    blur: document.getElementById('blur'),
    saturate: document.getElementById('saturate'),
    sepia: document.getElementById('sepia'),
    fade: document.getElementById('fade'),
    scale: document.getElementById('scale'),
    uploadBtn: document.getElementById('uploadBtn'),
    uploadInput: document.getElementById('uploadInput'),
    uploadCategory: document.getElementById('uploadCategory')
};

// --------------------------------------------
// Init
// --------------------------------------------
function init() {
    loadTheme();
    hydrateFromStorage();
    renderGallery();
    setupEventListeners();
    updateSelectionUI();
}

// --------------------------------------------
// Theme
// --------------------------------------------
function loadTheme() {
    const savedTheme = localStorage.getItem('pixelview-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('pixelview-theme', newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    elements.themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// --------------------------------------------
// Storage (uploads + edits)
// --------------------------------------------
function hydrateFromStorage() {
    try {
        const savedUploads = JSON.parse(localStorage.getItem('pixelview-uploads') || '[]');
        const savedEdits = JSON.parse(localStorage.getItem('pixelview-edited') || '[]');

        if (Array.isArray(savedUploads) && savedUploads.length) {
            // Avoid id clashes by shifting to a safe range
            const maxId = Math.max(0, ...images.map(i => i.id));
            let nextId = Math.max(maxId + 1, Date.now());
            const normalized = savedUploads.map(u => ({
                id: u.id || (nextId++),
                src: u.src,
                title: u.title || 'Uploaded',
                category: u.category || 'nature',
                uploaded: true
            }));
            images = [...images, ...normalized];
        }

        if (Array.isArray(savedEdits) && savedEdits.length) {
            editedImages = savedEdits.map(e => ({
                id: e.id,
                src: e.src,
                title: e.title,
                category: 'edited',
                originalId: e.originalId,
                editDate: e.editDate
            }));
        }
    } catch {
        // ignore
    }
}

function persistUploads() {
    // Store only uploaded images (to avoid huge defaults)
    try {
        const uploads = images.filter(i => i.uploaded).map(i => ({ id: i.id, src: i.src, title: i.title, category: i.category }));
        localStorage.setItem('pixelview-uploads', JSON.stringify(uploads));
    } catch {
        // storage may be full; ignore
    }
}

function persistEdits() {
    try {
        localStorage.setItem('pixelview-edited', JSON.stringify(editedImages));
    } catch {
        // ignore
    }
}

// --------------------------------------------
// Gallery
// --------------------------------------------
function getAllImages() {
    return [...images, ...editedImages];
}

function getFilteredImages() {
    const all = getAllImages();
    if (state.currentCategory === 'all') return all;
    if (state.currentCategory === 'edited') return editedImages;
    return all.filter(img => img.category === state.currentCategory);
}

function renderGallery() {
    state.filteredImages = getFilteredImages();
    elements.gallery.innerHTML = '';

    if (state.filteredImages.length === 0) {
        elements.gallery.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-images"></i>
                <h3>No Images Found</h3>
                <p>No images in this category yet.</p>
            </div>
        `;
        return;
    }

    state.filteredImages.forEach((image, index) => {
        const item = createGalleryItem(image, index);
        elements.gallery.appendChild(item);
    });
}

function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.index = String(index);
    item.dataset.id = String(image.id);

    const isSelected = state.selectedImages.has(image.id);
    if (isSelected) item.classList.add('selected');

    // NOTE: Category badge removed from thumbnail as requested.
    item.innerHTML = `
        <div class="gallery-image-wrapper">
            <img src="${image.src}" alt="${escapeHtml(image.title)}" class="gallery-image" loading="lazy" crossorigin="anonymous" referrerpolicy="no-referrer">
            <div class="selection-checkbox ${isSelected ? 'checked' : ''}" data-id="${image.id}" aria-label="Select image">
                <i class="fas fa-check"></i>
            </div>
        </div>
        <div class="item-overlay">
            <h3>${escapeHtml(image.title)}</h3>
            <p>${escapeHtml(image.category)}</p>
        </div>
    `;

    const imgEl = item.querySelector('img');
    imgEl.addEventListener('error', () => {
        imgEl.src = makePlaceholderDataUrl(image.title || 'Image');
    }, { once: true });

    // In normal mode: click opens lightbox
    // In selection mode: click toggles selection
    item.addEventListener('click', (e) => {
        const checkboxHit = !!e.target.closest('.selection-checkbox');
        if (state.isSelectionMode) {
            if (!checkboxHit) toggleSelection(image.id);
            return;
        }
        if (!checkboxHit) openLightbox(index);
    });

    // Checkbox handler
    const checkbox = item.querySelector('.selection-checkbox');
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!state.isSelectionMode) {
            // If user taps checkbox while not in selection mode, enable selection mode
            setSelectionMode(true);
        }
        toggleSelection(image.id);
    });

    return item;
}

// --------------------------------------------
// Selection Mode + Delete
// --------------------------------------------
function setSelectionMode(on) {
    state.isSelectionMode = !!on;
    document.body.classList.toggle('selection-mode', state.isSelectionMode);
    elements.selectModeBtn.classList.toggle('active', state.isSelectionMode);
    elements.selectAllBtn.style.display = state.isSelectionMode ? 'flex' : 'none';

    if (!state.isSelectionMode) {
        // leaving selection mode clears selection for clean UX
        state.selectedImages.clear();
    }

    updateSelectionUI();
    renderGallery();
}

function toggleSelection(imageId) {
    if (state.selectedImages.has(imageId)) {
        state.selectedImages.delete(imageId);
    } else {
        state.selectedImages.add(imageId);
    }
    updateSelectionUI();
    renderGallery();
}

function selectAll() {
    state.filteredImages.forEach(img => state.selectedImages.add(img.id));
    updateSelectionUI();
    renderGallery();
}

function deselectAll() {
    state.selectedImages.clear();
    updateSelectionUI();
    renderGallery();
}

function deleteSelected() {
    if (state.selectedImages.size === 0) return;

    const ids = new Set(state.selectedImages);
    const beforeCount = ids.size;

    images = images.filter(img => !ids.has(img.id));
    editedImages = editedImages.filter(img => !ids.has(img.id));

    // If current lightbox image was deleted, close lightbox
    if (state.isLightboxOpen) {
        const current = state.filteredImages[state.currentImageIndex];
        if (current && ids.has(current.id)) {
            closeLightbox();
        }
    }

    state.selectedImages.clear();
    persistUploads();
    persistEdits();

    showToast(`${beforeCount} image(s) deleted`, 'info');

    updateSelectionUI();
    renderGallery();

    // Keep selection mode on (user can continue selecting) if they want
    // but if no images left in current view, exit selection mode
    if (getFilteredImages().length === 0) {
        setSelectionMode(false);
    }
}

function updateSelectionUI() {
    const count = state.selectedImages.size;
    elements.selectedCount.textContent = String(count);
    elements.deleteSelectedBtn.disabled = count === 0 || !state.isSelectionMode;

    if (state.isSelectionMode && count > 0) {
        elements.selectionIndicator.classList.add('visible');
    } else {
        elements.selectionIndicator.classList.remove('visible');
    }

    // Select all button toggle state
    if (!state.isSelectionMode) {
        elements.selectAllBtn.innerHTML = '<i class="fas fa-check-double"></i> Select All';
        return;
    }

    // If everything in current view selected -> show "Deselect All"
    const totalInView = state.filteredImages.length;
    const selectedInView = state.filteredImages.filter(i => state.selectedImages.has(i.id)).length;
    if (totalInView > 0 && selectedInView === totalInView) {
        elements.selectAllBtn.innerHTML = '<i class="fas fa-check-double"></i> Deselect All';
    } else {
        elements.selectAllBtn.innerHTML = '<i class="fas fa-check-double"></i> Select All';
    }
}

// --------------------------------------------
// Lightbox
// --------------------------------------------
function openLightbox(index) {
    if (state.filteredImages.length === 0) return;
    state.currentImageIndex = index;
    state.isLightboxOpen = true;

    loadLightboxImage();
    elements.lightbox.classList.add('active');
    elements.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    state.isLightboxOpen = false;
    state.isEditorOpen = false;
    elements.lightbox.classList.remove('active');
    elements.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    closeEditor(true);
}

function loadLightboxImage() {
    const image = state.filteredImages[state.currentImageIndex];
    if (!image) return;

    elements.lightboxImage.style.filter = '';
    elements.lightboxImage.style.transform = '';

    elements.lightboxImage.src = image.src;
    elements.lightboxImage.alt = image.title;
    elements.imageTitle.textContent = image.title;
    elements.imageCategory.textContent = image.category;
    state.originalImageData = { ...image };

    elements.lightboxImage.onerror = () => {
        elements.lightboxImage.src = makePlaceholderDataUrl(image.title || 'Image');
    };

    resetEditor();
}

function navigateLightbox(direction) {
    const total = state.filteredImages.length;
    if (!total) return;
    state.currentImageIndex = (state.currentImageIndex + direction + total) % total;
    loadLightboxImage();
}

// --------------------------------------------
// Editor
// --------------------------------------------
function openEditor() {
    state.isEditorOpen = true;
    elements.editorPanel.style.display = 'block';
    showToast('Editor opened (Save to create an Edited image)', 'info');
}

function closeEditor(silent = false) {
    state.isEditorOpen = false;
    elements.editorPanel.style.display = 'none';
    elements.cropOverlay.classList.remove('visible');
    if (!silent) resetEditor();
}

function resetEditor() {
    state.editingSettings = {
        brightness: 100,
        contrast: 100,
        blur: 0,
        saturate: 100,
        sepia: 0,
        grayscale: 0,
        fade: 100,
        rotate: 0,
        scale: 100,
        flipH: 1,
        flipV: 1,
        filter: 'none',
        crop: 'none'
    };

    // sliders
    elements.brightness.value = 100;
    elements.contrast.value = 100;
    elements.blur.value = 0;
    elements.saturate.value = 100;
    elements.sepia.value = 0;
    elements.fade.value = 100;
    elements.scale.value = 100;

    // displays
    document.getElementById('brightnessVal').textContent = '100%';
    document.getElementById('contrastVal').textContent = '100%';
    document.getElementById('blurVal').textContent = '0px';
    document.getElementById('saturateVal').textContent = '100%';
    document.getElementById('sepiaVal').textContent = '0%';
    document.getElementById('fadeVal').textContent = '100%';
    document.getElementById('scaleVal').textContent = '100%';

    // filter tiles active state
    setActiveFilterTile('none');
    setCropMode('none');

    applyImageStyles();
}

function getCssFilterString() {
    const s = state.editingSettings;
    return `
        brightness(${s.brightness}%)
        contrast(${s.contrast}%)
        saturate(${s.saturate}%)
        blur(${s.blur}px)
        sepia(${s.sepia}%)
        grayscale(${s.grayscale}%)
        opacity(${s.fade}%)
    `.trim().replace(/\s+/g, ' ');
}

function applyImageStyles() {
    const s = state.editingSettings;
    const transform = `
        rotate(${s.rotate}deg)
        scale(${s.flipH}, ${s.flipV})
        scale(${s.scale / 100})
    `.trim();

    elements.lightboxImage.style.filter = getCssFilterString();
    elements.lightboxImage.style.transform = transform;
    updateCropOverlay();
}

function setActiveFilterTile(filterType) {
    elements.filtersGrid.querySelectorAll('.tool-tile').forEach(tile => {
        tile.classList.toggle('active', tile.dataset.filter === filterType);
    });
}

function applyFilterPreset(filterType) {
    const presets = {
        none: { grayscale: 0, brightness: 100, contrast: 100, saturate: 100, sepia: 0, fade: 100 },
        grayscale: { grayscale: 100, brightness: 100, contrast: 105, saturate: 0, sepia: 0, fade: 100 },
        night: { grayscale: 0, brightness: 75, contrast: 135, saturate: 80, sepia: 10, fade: 100 },
        film: { grayscale: 0, brightness: 110, contrast: 112, saturate: 90, sepia: 25, fade: 95 },
        vintage: { grayscale: 0, brightness: 108, contrast: 100, saturate: 82, sepia: 40, fade: 95 },
        pop: { grayscale: 0, brightness: 112, contrast: 125, saturate: 135, sepia: 0, fade: 100 }
    };

    const p = presets[filterType] || presets.none;
    state.editingSettings = { ...state.editingSettings, ...p, filter: filterType };

    // Sync sliders
    elements.brightness.value = state.editingSettings.brightness;
    elements.contrast.value = state.editingSettings.contrast;
    elements.saturate.value = state.editingSettings.saturate;
    elements.sepia.value = state.editingSettings.sepia;
    elements.blur.value = state.editingSettings.blur;
    elements.fade.value = state.editingSettings.fade;

    // Displays
    document.getElementById('brightnessVal').textContent = state.editingSettings.brightness + '%';
    document.getElementById('contrastVal').textContent = state.editingSettings.contrast + '%';
    document.getElementById('saturateVal').textContent = state.editingSettings.saturate + '%';
    document.getElementById('sepiaVal').textContent = state.editingSettings.sepia + '%';
    document.getElementById('blurVal').textContent = state.editingSettings.blur + 'px';
    document.getElementById('fadeVal').textContent = state.editingSettings.fade + '%';

    setActiveFilterTile(filterType);
    applyImageStyles();
}

function rotateImage(degrees) {
    state.editingSettings.rotate = (state.editingSettings.rotate + degrees) % 360;
    applyImageStyles();
}

function flipImage(direction) {
    if (direction === 'h') state.editingSettings.flipH *= -1;
    if (direction === 'v') state.editingSettings.flipV *= -1;
    applyImageStyles();
}

function setCropMode(mode) {
    state.editingSettings.crop = mode;
    document.querySelectorAll('.crop-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.crop === mode);
    });
    updateCropOverlay();
}

function updateCropOverlay() {
    const mode = state.editingSettings.crop;
    if (!state.isEditorOpen || mode === 'none') {
        elements.cropOverlay.classList.remove('visible');
        return;
    }

    const viewport = elements.imageViewport;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    if (!vw || !vh) return;

    let ratio = null;
    if (mode === '1:1') ratio = 1;
    if (mode === '4:3') ratio = 4/3;
    if (mode === '16:9') ratio = 16/9;

    if (!ratio) {
        elements.cropOverlay.classList.remove('visible');
        return;
    }

    // Fit crop rectangle inside viewport
    let w = Math.min(vw * 0.82, 980);
    let h = w / ratio;
    if (h > vh * 0.78) {
        h = vh * 0.78;
        w = h * ratio;
    }

    elements.cropOverlay.style.width = Math.max(200, w) + 'px';
    elements.cropOverlay.style.height = Math.max(160, h) + 'px';
    elements.cropOverlay.classList.add('visible');
}

async function loadBitmapFromSrc(src) {
    // Fetch to blob first to avoid tainted canvas (fixes "Save" issues)
    const res = await fetch(src, { mode: 'cors', cache: 'force-cache' });
    if (!res.ok) throw new Error('Image fetch failed');
    const blob = await res.blob();
    return await createImageBitmap(blob);
}

function computeCropRect(sw, sh, cropMode) {
    if (cropMode === 'none') return { sx: 0, sy: 0, sw, sh, outW: sw, outH: sh };

    let targetRatio = null;
    if (cropMode === '1:1') targetRatio = 1;
    if (cropMode === '4:3') targetRatio = 4 / 3;
    if (cropMode === '16:9') targetRatio = 16 / 9;
    if (!targetRatio) return { sx: 0, sy: 0, sw, sh, outW: sw, outH: sh };

    let sx = 0, sy = 0;
    let cw = sw, ch = sh;

    const currentRatio = sw / sh;
    if (currentRatio > targetRatio) {
        // too wide
        cw = sh * targetRatio;
        sx = (sw - cw) / 2;
    } else {
        // too tall
        ch = sw / targetRatio;
        sy = (sh - ch) / 2;
    }

    return { sx, sy, sw: cw, sh: ch, outW: cw, outH: ch };
}

async function saveEditedImage() {
    const currentImage = state.filteredImages[state.currentImageIndex];
    if (!currentImage) return;

    elements.saveEditBtn.disabled = true;
    elements.saveEditBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving';

    try {
        const s = state.editingSettings;
        const bitmap = await loadBitmapFromSrc(currentImage.src);

        // Crop center based on ratio
        const crop = computeCropRect(bitmap.width, bitmap.height, s.crop);

        // Determine output size based on rotation
        const rot = ((s.rotate % 360) + 360) % 360;
        const is90 = rot === 90 || rot === 270;
        const baseW = crop.outW;
        const baseH = crop.outH;

        const outW = is90 ? baseH : baseW;
        const outH = is90 ? baseW : baseH;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = Math.round(outW);
        canvas.height = Math.round(outH);

        // Apply filters
        ctx.filter = getCssFilterString();

        // Transform
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rot * Math.PI) / 180);

        const scaleFactor = s.scale / 100;
        ctx.scale(s.flipH * scaleFactor, s.flipV * scaleFactor);

        // draw cropped source centered
        ctx.drawImage(
            bitmap,
            crop.sx, crop.sy, crop.sw, crop.sh,
            -baseW / 2, -baseH / 2,
            baseW, baseH
        );
        ctx.restore();

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

        const editedImage = {
            id: Date.now(),
            src: dataUrl,
            title: `${currentImage.title} (Edited)`,
            category: 'edited',
            originalId: currentImage.originalId || currentImage.id,
            editDate: new Date().toISOString()
        };

        editedImages.unshift(editedImage);
        persistEdits();

        showToast('Saved to Edited category', 'success');

        // Keep user in lightbox; refresh gallery
        closeEditor(true);
        renderGallery();

    } catch (err) {
        console.error(err);
        showToast('Unable to save (image may block editing). Try uploading the photo and edit again.', 'error');
    } finally {
        elements.saveEditBtn.disabled = false;
        elements.saveEditBtn.innerHTML = '<i class="fas fa-save"></i> Save';
    }
}

function discardChanges() {
    resetEditor();
    showToast('Changes discarded', 'info');
}

// --------------------------------------------
// Download
// --------------------------------------------
function downloadImage() {
    const currentImage = state.filteredImages[state.currentImageIndex];
    if (!currentImage) return;

    const link = document.createElement('a');
    link.href = currentImage.src;
    link.download = `${currentImage.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Download started', 'success');
}

// --------------------------------------------
// Upload
// --------------------------------------------
function resolveUploadCategory() {
    const chosen = elements.uploadCategory.value;
    if (chosen && chosen !== 'auto') return chosen;
    if (state.currentCategory && !['all', 'edited'].includes(state.currentCategory)) return state.currentCategory;
    return 'nature';
}

async function handleUploadFiles(fileList) {
    const files = Array.from(fileList || []);
    const category = resolveUploadCategory();
    const valid = files.filter(f => f && f.type && f.type.startsWith('image/'));
    if (!valid.length) {
        showToast('Please select image files', 'error');
        return;
    }

    const startId = Date.now();
    const additions = [];

    for (let i = 0; i < valid.length; i++) {
        const file = valid[i];
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        additions.push({
            id: startId + i,
            src: dataUrl,
            title: file.name.replace(/\.[^/.]+$/, ''),
            category,
            uploaded: true,
            uploadedAt: new Date().toISOString()
        });
    }

    images = [...additions, ...images];
    persistUploads();

    showToast(`${additions.length} photo(s) uploaded to ${category}`, 'success');
    renderGallery();
}

// --------------------------------------------
// Tabs
// --------------------------------------------
function switchTab(tabName) {
    elements.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName + 'Tab');
    });
}

// --------------------------------------------
// Toast
// --------------------------------------------
function showToast(message, type = 'info') {
    elements.toastMessage.textContent = message;
    elements.toast.className = `toast ${type} show`;
    setTimeout(() => elements.toast.classList.remove('show'), 2800);
}

// --------------------------------------------
// Event Listeners
// --------------------------------------------
function setupEventListeners() {
    // Theme
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Category filters
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            state.currentCategory = btn.dataset.category;

            // Leaving selection mode on filter change keeps confusion low
            if (state.isSelectionMode) setSelectionMode(false);

            renderGallery();
            updateSelectionUI();
        });
    });

    // Selection mode
    elements.selectModeBtn.addEventListener('click', () => {
        setSelectionMode(!state.isSelectionMode);
        showToast(state.isSelectionMode ? 'Select mode enabled' : 'Select mode disabled', 'info');
    });

    elements.selectAllBtn.addEventListener('click', () => {
        const totalInView = state.filteredImages.length;
        const selectedInView = state.filteredImages.filter(i => state.selectedImages.has(i.id)).length;
        if (totalInView > 0 && selectedInView === totalInView) {
            deselectAll();
        } else {
            selectAll();
        }
    });

    elements.deleteSelectedBtn.addEventListener('click', () => {
        if (elements.deleteSelectedBtn.disabled) return;
        if (confirm('Delete selected images?')) deleteSelected();
    });

    // Upload
    elements.uploadBtn.addEventListener('click', () => {
        elements.uploadInput.value = '';
        elements.uploadInput.click();
    });

    elements.uploadInput.addEventListener('change', async (e) => {
        await handleUploadFiles(e.target.files);
    });

    // Lightbox controls
    elements.lightboxClose.addEventListener('click', closeLightbox);
    elements.prevBtn.addEventListener('click', () => navigateLightbox(-1));
    elements.nextBtn.addEventListener('click', () => navigateLightbox(1));

    // Lightbox action buttons
    elements.editBtn.addEventListener('click', () => {
        openEditor();
        updateCropOverlay();
    });
    elements.downloadBtn.addEventListener('click', downloadImage);

    // Editor buttons
    elements.saveEditBtn.addEventListener('click', saveEditedImage);
    elements.discardEditBtn.addEventListener('click', discardChanges);

    // Tabs
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Filter tiles
    elements.filtersGrid.addEventListener('click', (e) => {
        const tile = e.target.closest('.tool-tile');
        if (!tile) return;
        applyFilterPreset(tile.dataset.filter);
    });

    // Rotation buttons
    document.querySelectorAll('.rotate-btn').forEach(btn => {
        btn.addEventListener('click', () => rotateImage(parseInt(btn.dataset.rotate, 10)));
    });

    // Flip buttons
    document.querySelectorAll('.flip-btn').forEach(btn => {
        btn.addEventListener('click', () => flipImage(btn.dataset.flip));
    });

    // Crop buttons
    document.querySelectorAll('.crop-btn').forEach(btn => {
        btn.addEventListener('click', () => setCropMode(btn.dataset.crop));
    });

    // Sliders
    elements.brightness.addEventListener('input', (e) => {
        state.editingSettings.brightness = parseInt(e.target.value, 10);
        document.getElementById('brightnessVal').textContent = e.target.value + '%';
        applyImageStyles();
    });

    elements.contrast.addEventListener('input', (e) => {
        state.editingSettings.contrast = parseInt(e.target.value, 10);
        document.getElementById('contrastVal').textContent = e.target.value + '%';
        applyImageStyles();
    });

    elements.blur.addEventListener('input', (e) => {
        state.editingSettings.blur = parseInt(e.target.value, 10);
        document.getElementById('blurVal').textContent = e.target.value + 'px';
        applyImageStyles();
    });

    elements.saturate.addEventListener('input', (e) => {
        state.editingSettings.saturate = parseInt(e.target.value, 10);
        document.getElementById('saturateVal').textContent = e.target.value + '%';
        applyImageStyles();
    });

    elements.sepia.addEventListener('input', (e) => {
        state.editingSettings.sepia = parseInt(e.target.value, 10);
        document.getElementById('sepiaVal').textContent = e.target.value + '%';
        applyImageStyles();
    });

    elements.fade.addEventListener('input', (e) => {
        state.editingSettings.fade = parseInt(e.target.value, 10);
        document.getElementById('fadeVal').textContent = e.target.value + '%';
        applyImageStyles();
    });

    elements.scale.addEventListener('input', (e) => {
        state.editingSettings.scale = parseInt(e.target.value, 10);
        document.getElementById('scaleVal').textContent = e.target.value + '%';
        applyImageStyles();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (state.isLightboxOpen) {
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    navigateLightbox(1);
                    break;
                case 'e':
                case 'E':
                    if (!state.isEditorOpen) openEditor();
                    break;
            }
        }

        // Toggle selection mode shortcut
        if (!state.isLightboxOpen && (e.key === 's' || e.key === 'S')) {
            setSelectionMode(!state.isSelectionMode);
        }
    });

    // Click outside image to close
    elements.lightbox.addEventListener('click', (e) => {
        if (e.target === elements.lightbox) closeLightbox();
    });

    // Resize: keep crop overlay fitting
    window.addEventListener('resize', () => updateCropOverlay());

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    elements.lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    elements.lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) navigateLightbox(1);
            else navigateLightbox(-1);
        }
    }, { passive: true });
}

// --------------------------------------------
// Start
// --------------------------------------------
document.addEventListener('DOMContentLoaded', init);

// Export for debugging
window.PixelView = {
    init,
    renderGallery,
    openLightbox,
    toggleTheme
};