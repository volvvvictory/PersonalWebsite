// Modal configuration loader
// This loads modal data from modals.json and provides functions to generate modal HTML

async function loadModalConfigs() {
    try {
        const response = await fetch('assets/Gallery/modals.json');
        const data = await response.json();
        return data.modals || [];
    } catch (error) {
        console.error('Error loading modals.json:', error);
        return [];
    }
}

function generateModalHtml(modal, images) {
    const modalId = modal.id;
    const hasImages = Array.isArray(images) && images.length > 0;
    const desktopImages = hasImages ? images.map((img, idx) => {
        const imgName = typeof img === 'string' ? img : img.name;
        const imgSrc = 'assets/Gallery/' + imgName;
        const angle = (360 / images.length) * idx + (idx * 17) % 360;
        const radius = 170 + (idx % 3) * 60;
        const x = Math.round(120 + Math.cos(angle * Math.PI / 180) * radius + Math.random()*18 - 9);
        const y = Math.round(120 + Math.sin(angle * Math.PI / 180) * radius + Math.random()*18 - 9);
        return `<img src='${imgSrc}' alt='${imgName}' style='width:320px;height:360px;object-fit:cover;border-radius:18px;box-shadow:0 4px 16px rgba(215,186,173,0.18);position:absolute;left:${x}px;top:${y}px;background:#222;' />`;
    }).join('') : '';
    
    const firstImage = hasImages ? (typeof images[0] === 'string' ? images[0] : images[0].name) : '';
    const posterImage = !hasImages && modal.poster ? modal.poster : '';
    const mobilePrimaryImage = hasImages ? firstImage : posterImage;
    const descriptionFormatted = modal.description.replace(/\n\n/g, '<br><br>');
    const artistsList = Array.isArray(modal.artists) ? modal.artists.join(', ') : '';
    
    return `
<style>
@media (max-width: 700px) {
    .${modalId}-modal-desktop { display: none !important; }
    .${modalId}-modal-mobile { display: flex !important; flex-direction: column; align-items: center; justify-content: center; }
}
@media (min-width: 701px) {
    .${modalId}-modal-desktop { display: flex !important; }
    .${modalId}-modal-mobile { display: none !important; }
}
</style>
<div class="${modalId}-modal-desktop" style="gap:32px;align-items:flex-start;flex-wrap:wrap;">
    ${hasImages 
        ? `<div style="display:flex;flex-wrap:wrap;gap:0;min-width:540px;max-width:700px;position:relative;height:600px;">${desktopImages}</div>` 
        : (posterImage ? `<div style="display:flex;align-items:center;justify-content:center;min-width:360px;max-width:520px;position:relative;height:420px;">
                <img src="assets/Gallery/${posterImage}" alt="${modal.title}" style="width:340px;height:auto;object-fit:cover;border-radius:18px;box-shadow:0 4px 16px rgba(215,186,173,0.18);background:#222;" />
            </div>` : '')}
    <div class="modal-description modal-description-desktop" style="${hasImages ? '' : 'max-width:720px;'}">
        <strong>${modal.title}</strong><br>
        ${descriptionFormatted}<br><br>
        <em>Exhibition:</em> ${modal.exhibition}<br>
        <em>Artists:</em> ${artistsList}
    </div>
</div>
<div class="${modalId}-modal-mobile" style="display:none;flex-direction:column;align-items:center;justify-content:flex-start;width:100%;max-width:98vw;margin-top:12px;">
    ${mobilePrimaryImage ? `<img src="assets/Gallery/${mobilePrimaryImage}" alt="${modal.title}" style="width:92vw;max-width:340px;height:auto;object-fit:cover;border-radius:18px;box-shadow:0 4px 16px rgba(215,186,173,0.18);margin-bottom:18px;background:#222;" />` : ''}
    <div class="modal-description modal-description-mobile">
        <strong>${modal.title}</strong><br>
        ${descriptionFormatted}<br><br>
        <em>Exhibition:</em> ${modal.exhibition}<br>
        <em>Artists:</em> ${artistsList}
    </div>
</div>
`;
}

function findMatchingModal(imageName, modalConfigs) {
    for (let modal of modalConfigs) {
        if (imageName.includes(modal.imageFilter)) {
            return modal;
        }
    }
    return null;
}

// Helper: get images for a modal by projectId first, then fallback to filename filter
async function getImagesForModal(modal) {
    try {
        // 1) Prefer explicit images declared in modals.json
        if (Array.isArray(modal.images) && modal.images.length) {
            console.log(`[Modal] getImagesForModal("${modal.id}") using modals.json images count=${modal.images.length}`);
            return modal.images;
        }

        const res = await fetch('assets/Gallery/list.json');
        if (!res.ok) return [];
        const list = await res.json();
        const items = Array.isArray(list) ? list : [];
        const id = (modal.id || '').toLowerCase();

        // Prefer exact projectId match
        const byId = items
            .filter(item => typeof item === 'object' && item.projectId && item.projectId.toLowerCase() === id)
            .map(item => item.name);
        if (byId.length) {
            console.log(`[Modal] getImagesForModal("${modal.id}") by projectId found=${byId.length}`, byId);
            return byId;
        }

        // Fallback to substring filename filter (imageFilter or id)
        const names = items.map(item => (typeof item === 'string' ? item : item.name));
        const filter = (modal.imageFilter || modal.id || '').toLowerCase();
        const matched = names.filter(n => n.toLowerCase().includes(filter));
        console.log(`[Modal] getImagesForModal("${modal.id}") by filter="${filter}" found=${matched.length}`, matched);
        return matched;
    } catch (e) {
        console.warn('getImagesForModal fallback:', e);
        return [];
    }
}

// Unified Modal Handler
// Usage: Add class="modal-trigger" and data-project-id="projectId" to any element
// Handles modal opening, content loading, and image gathering automatically
async function initModalHandler(modalConfigs) {
    const shellContainer = document.getElementById('modal-shell-container');
    if (!shellContainer) {
        console.warn('Modal shell container (#modal-shell-container) not found');
        return;
    }

    // Delegate click handler for all modal triggers
    document.addEventListener('click', async (e) => {
        const trigger = e.target.closest('.modal-trigger');
        if (!trigger) return;
        
        e.preventDefault();
        const projectId = trigger.dataset.projectId;
        if (!projectId) {
            console.warn('modal-trigger missing data-project-id');
            return;
        }

        // Find project in modal configs
        const project = modalConfigs.find(m => m.id === projectId);
        if (!project) {
            console.warn(`Project "${projectId}" not found in modals.json`);
            return;
        }

        // Gather images and populate shell
        const images = await getImagesForModal(project);
        const content = generateModalHtml(project, images);
        shellContainer.innerHTML = content;
        shellContainer.style.display = 'flex';
    });

    // Close button handler
    document.addEventListener('click', (e) => {
        if (e.target.id === 'modal-shell-close') {
            shellContainer.style.display = 'none';
        }
    });

    // Click outside to close
    shellContainer.addEventListener('click', (e) => {
        if (e.target === shellContainer) {
            shellContainer.style.display = 'none';
        }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && shellContainer.style.display === 'flex') {
            shellContainer.style.display = 'none';
        }
    });
}

// Initialize on page load (if modal handlers exist on the page)
// This will be called again after fragment loads
window.modalHandlerReady = false;

async function setupModalHandler() {
    if (!window.modalHandlerReady) {
        const shellContainer = document.getElementById('modal-shell-container');
        if (!shellContainer) {
            console.warn('Modal shell container not found yet');
            return;
        }
        const configs = await loadModalConfigs();
        initModalHandler(configs);
        window.modalHandlerReady = true;
    }
}

// Setup modal handler when page loads
document.addEventListener('DOMContentLoaded', setupModalHandler);

// Also setup when modal shell is injected (for dynamic loading)
const shellObserver = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.addedNodes.length) {
            for (let node of mutation.addedNodes) {
                if (node.id === 'modal-shell-container' || (node.querySelector && node.querySelector('#modal-shell-container'))) {
                    setupModalHandler();
                    break;
                }
            }
        }
    }
});

shellObserver.observe(document.body, { childList: true, subtree: true });

// Load projects modal fragment
async function loadProjectsFragment() {
    try {
        const response = await fetch('projects-modal.html');
        if (!response.ok) throw new Error('Failed to load projects-modal.html');
        const html = await response.text();
        const container = document.getElementById('projects-modal-container');
        if (container) {
            container.innerHTML = html;
            // Initialize modal handler now that fragment is loaded
            await setupModalHandler();
        }
    } catch (e) {
        console.warn('Could not load projects fragment:', e);
    }
}

// Auto-load fragment on DOM ready
document.addEventListener('DOMContentLoaded', loadProjectsFragment);
