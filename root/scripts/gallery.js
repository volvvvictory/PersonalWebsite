// Gallery script (no modals, images only)
(function(){
    const grid = document.getElementById('gallery-grid');
    let allImages = [];
    let currentFilter = 'all';
    let hasSignaledReady = false;
    let currentImageIndex = 0;
    let filteredImages = [];

    // Images that appear on the projects page
    const projectPageImages = [
        'installation.sluchilos01.png',
        'installation.sluchilos04.jpg',
        'installation.freeze4.jpg',
        'installation.nerfs01.png',
        'nerfs_021.png',
        'installation.all1.png',
        'installation.all2.png'
    ];

    function signalGalleryReady(){
        if (hasSignaledReady) return;
        hasSignaledReady = true;
        document.dispatchEvent(new CustomEvent('gallery:ready'));
    }

    // Lightbox modal
    function openLightbox(src, caption, imageIndex = 0) {
        let lightbox = document.getElementById('gallery-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'gallery-lightbox';
            lightbox.style.cssText = `
                display: none;
                position: fixed;
                inset: 0;
                z-index: 3000;
                background: rgba(0,0,0,0.85);
                align-items: center;
                justify-content: center;
                padding: 24px;
                flex-direction: column;
                overflow-y: auto;
            `;
            lightbox.innerHTML = `
                <button id="lightbox-close" style="position: absolute; top: 18px; right: 18px; background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">×</button>
                <button id="lightbox-prev" style="position: absolute; left: 18px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #fff; font-size: 32px; cursor: pointer; padding: 8px; display: flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s;">‹</button>
                <button id="lightbox-next" style="position: absolute; right: 18px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #fff; font-size: 32px; cursor: pointer; padding: 8px; display: flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s;">›</button>
                <img id="lightbox-img" style="max-width: 90vw; max-height: 70vh; border-radius: 12px; object-fit: contain;" />
                <div id="lightbox-caption" style="color: #fff; margin-top: 16px; font-size: 0.95em; text-align: center; max-width: 600px; display: flex; flex-direction: column; gap: 12px; align-items: center;"></div>
            `;
            document.body.appendChild(lightbox);
            
            lightbox.querySelector('#lightbox-close').addEventListener('click', () => {
                lightbox.style.display = 'none';
            });
            
            lightbox.querySelector('#lightbox-prev').addEventListener('click', (e) => {
                e.stopPropagation();
                currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
                updateLightboxImage();
            });
            
            lightbox.querySelector('#lightbox-next').addEventListener('click', (e) => {
                e.stopPropagation();
                currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
                updateLightboxImage();
            });
            
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) lightbox.style.display = 'none';
            });
            document.addEventListener('keydown', (e) => {
                if (lightbox.style.display === 'flex') {
                    if (e.key === 'Escape') {
                        lightbox.style.display = 'none';
                    } else if (e.key === 'ArrowLeft') {
                        currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
                        updateLightboxImage();
                    } else if (e.key === 'ArrowRight') {
                        currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
                        updateLightboxImage();
                    }
                }
            });
        }
        
        currentImageIndex = imageIndex;
        updateLightboxImage();
        lightbox.style.display = 'flex';
    }
    
    function updateLightboxImage() {
        const lightbox = document.getElementById('gallery-lightbox');
        if (!filteredImages.length) return;
        
        const currentItem = filteredImages[currentImageIndex];
        const name = typeof currentItem === 'string' ? currentItem : currentItem.name;
        const caption = (typeof currentItem === 'object' && currentItem.caption) ? currentItem.caption : '';
        const src = 'assets/Gallery/' + name;
        
        lightbox.querySelector('#lightbox-img').src = src;
        
        // Build caption with text and link (only if image is on projects page)
        const captionDiv = lightbox.querySelector('#lightbox-caption');
        captionDiv.innerHTML = '';
        
        if (caption) {
            const captionText = document.createElement('div');
            captionText.textContent = caption;
            captionDiv.appendChild(captionText);
        }
        
        // Check if this image is on the projects page
        const imageName = src.split('/').pop();
        const isProjectImage = projectPageImages.includes(imageName);
        
        if (isProjectImage) {
            // Add link to projects page
            const link = document.createElement('a');
            link.href = 'projects.html';
            link.textContent = 'More about the project →';
            link.style.cssText = 'color: #fff; text-decoration: underline; cursor: pointer; font-size: 0.95em;';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.style.display = 'none';
                window.location.href = 'projects.html';
            });
            captionDiv.appendChild(link);
        }
    }

    function renderGallery(images){
        if(!grid) return;
        filteredImages = images;
        grid.innerHTML = images.map((item, idx) => {
            // Handle contact card
            if (item && item.type === 'contact') {
                return `<div class="gallery-item contact-card" style="cursor: default; background: #ffffff; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: 16px; text-align: left; color: #555; border: 1.6px solid #ddd; border-radius: 12px;">
                    <div style="margin-bottom: 8px;">
                        <div style="font-size: 0.9em; opacity: 0.7; margin-bottom: 4px; color: #666;">Email</div>
                        <a href="mailto:${item.email}" style="color: #555; text-decoration: none; font-weight: 500; font-size: 0.95em;">${item.email}</a>
                    </div>
                    <div>
                        <div style="font-size: 0.9em; opacity: 0.7; margin-bottom: 4px; color: #666;">Location</div>
                        <div style="font-weight: 500; font-size: 0.95em; color: #555;">${item.location}</div>
                    </div>
                </div>`;
            }
            // Handle image items
            const name = typeof item === 'string' ? item : item.name;
            const src = 'assets/Gallery/' + name;
            const nameNoExt = name.replace(/\.[^.]+$/, '');
            const webp = 'assets/Gallery/webp/' + encodeURIComponent(nameNoExt);
            return `<div class="gallery-item" data-idx="${idx}" style="cursor: pointer;">
                <picture>
                    <source type="image/webp"
                        srcset="${webp}-400w.webp 400w, ${webp}-800w.webp 800w, ${webp}.webp 1200w"
                        sizes="(max-width: 500px) 33vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw" />
                    <img src="${src}" alt="${name}" loading="lazy" decoding="async" />
                </picture>
            </div>`;
        }).join('');
        
        // Add click handlers to open lightbox (skip for contact cards)
        grid.querySelectorAll('.gallery-item:not(.contact-card)').forEach((el) => {
            el.addEventListener('click', () => {
                const dataIdx = el.getAttribute('data-idx');
                const idx = dataIdx ? parseInt(dataIdx, 10) : 0;
                openLightbox(null, null, idx);
            });
        });
    }

    function filterImages(){
        if(currentFilter === 'all'){
            renderGallery(allImages);
        }else{
            const filtered = allImages.filter(item => item.category === currentFilter);
            renderGallery(filtered);
        }
    }
    
    (async function loadGallery(){
        try{
            const r = await fetch('assets/Gallery/list.json');
            if(r.ok){
                const list = await r.json();
                if(Array.isArray(list) && list.length){
                    allImages = list;
                    filterImages();
                    signalGalleryReady();
                    return;
                }
            }
        }catch(e){ 
            console.error('Failed to load list.json:', e);
        }
        // Always signal ready, even on error, so loading overlay doesn't hang
        signalGalleryReady();
    })();

    // Filter buttons
    document.querySelectorAll('.gallery-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.gallery-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            filterImages();
        });
    });
})();
