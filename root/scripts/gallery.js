// Gallery script (no modals, images only)
(function(){
    const grid = document.getElementById('gallery-grid');
    let allImages = [];
    let currentFilter = 'all';
    let hasSignaledReady = false;

    function signalGalleryReady(){
        if (hasSignaledReady) return;
        hasSignaledReady = true;
        document.dispatchEvent(new CustomEvent('gallery:ready'));
    }

    // Lightbox modal
    function openLightbox(src, caption) {
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
                <img id="lightbox-img" style="max-width: 90vw; max-height: 70vh; border-radius: 12px; object-fit: contain;" />
                <p id="lightbox-caption" style="color: #fff; margin-top: 16px; font-size: 0.95em; text-align: center; max-width: 600px;"></p>
            `;
            document.body.appendChild(lightbox);
            
            lightbox.querySelector('#lightbox-close').addEventListener('click', () => {
                lightbox.style.display = 'none';
            });
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) lightbox.style.display = 'none';
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                    lightbox.style.display = 'none';
                }
            });
        }
        
        lightbox.querySelector('#lightbox-img').src = src;
        lightbox.querySelector('#lightbox-caption').textContent = caption || '';
        lightbox.style.display = 'flex';
    }

    function renderGallery(images){
        if(!grid) return;
        grid.innerHTML = images.map((item, idx) => {
            // Handle contact card
            if (item && item.type === 'contact') {
                return `<div class="gallery-item contact-card" style="cursor: default; background: #ffffff; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: 32px; text-align: left; color: #555; border: 1.6px solid #ddd; border-radius: 12px;">
                    <div style="margin-bottom: 12px;">
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
            return `<div class="gallery-item" data-idx="${idx}" style="cursor: pointer;">
                <img src="${src}" alt="${name}" loading="lazy" decoding="async" />
            </div>`;
        }).join('');
        
        // Add click handlers to open lightbox (skip for contact cards)
        grid.querySelectorAll('.gallery-item:not(.contact-card)').forEach((el) => {
            el.addEventListener('click', () => {
                const dataIdx = el.getAttribute('data-idx');
                const idx = dataIdx ? parseInt(dataIdx, 10) : 0;
                const img = images[idx];
                const name = typeof img === 'string' ? img : img.name;
                const caption = (typeof img === 'object' && img.caption) ? img.caption : '';
                const src = 'assets/Gallery/' + name;
                openLightbox(src, caption);
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
    
    async function checkExists(url){
        try{
            const res = await fetch(url, { method: 'HEAD' });
            return res.ok;
        }catch(e){
            return false;
        }
    }

    (async function loadGallery(){
        try{
            const r = await fetch('assets/Gallery/list.json');
            console.log('Fetch response:', r.status, r.ok);
            if(r.ok){
                const list = await r.json();
                console.log('Loaded list.json:', list.length, 'items');
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
