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
    const desktopImages = images.map((img, idx) => {
        const imgName = typeof img === 'string' ? img : img.name;
        const imgSrc = 'assets/Gallery/' + imgName;
        const angle = (360 / images.length) * idx + (idx * 17) % 360;
        const radius = 170 + (idx % 3) * 60;
        const x = Math.round(120 + Math.cos(angle * Math.PI / 180) * radius + Math.random()*18 - 9);
        const y = Math.round(120 + Math.sin(angle * Math.PI / 180) * radius + Math.random()*18 - 9);
        return `<img src='${imgSrc}' alt='${imgName}' style='width:320px;height:360px;object-fit:cover;border-radius:18px;box-shadow:0 4px 16px rgba(215,186,173,0.18);position:absolute;left:${x}px;top:${y}px;background:#222;' />`;
    }).join('');
    
    const firstImage = images.length > 0 ? (typeof images[0] === 'string' ? images[0] : images[0].name) : '';
    const descriptionFormatted = modal.description.replace(/\n\n/g, '<br><br>');
    const artistsList = modal.artists.join(', ');
    
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
    <div style="display:flex;flex-wrap:wrap;gap:0;min-width:540px;max-width:700px;position:relative;height:600px;">
        ${desktopImages}
    </div>
    <div style="min-width:260px;max-width:340px;color:#fff;font-size:1.08em;line-height:1.5;text-align:left;background:linear-gradient(135deg,rgba(34,34,34,0.85) 80%,rgba(215,186,173,0.18) 100%);padding:22px 22px 22px 28px;border-radius:16px;box-shadow:0 2px 12px 0 rgba(34,34,34,0.13);backdrop-filter:blur(2px);">
        <strong>${modal.title}</strong><br>
        ${descriptionFormatted}<br><br>
        <em>Exhibition:</em> ${modal.exhibition}<br>
        <em>Artists:</em> ${artistsList}
    </div>
</div>
<div class="${modalId}-modal-mobile" style="display:none;flex-direction:column;align-items:center;justify-content:center;width:100%;max-width:98vw;">
    <img src="assets/Gallery/${firstImage}" alt="${modal.title}" style="width:92vw;max-width:340px;height:auto;object-fit:cover;border-radius:18px;box-shadow:0 4px 16px rgba(215,186,173,0.18);margin-bottom:18px;background:#222;" />
    <div style="width:92vw;max-width:340px;color:#fff;font-size:1.08em;line-height:1.5;text-align:left;background:linear-gradient(135deg,rgba(34,34,34,0.85) 80%,rgba(215,186,173,0.18) 100%);padding:18px 12px 18px 18px;border-radius:16px;box-shadow:0 2px 12px 0 rgba(34,34,34,0.13);backdrop-filter:blur(2px);">
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
