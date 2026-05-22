// Loading overlay handler tied to real readiness signals
window.addEventListener('DOMContentLoaded', function() {
    var overlay = document.getElementById('loading-overlay');
    if (!overlay) return;

    function hideOverlay(){
        overlay.style.opacity = '0';
        setTimeout(function(){ overlay.style.display = 'none'; }, 400);
    }

    var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var galleryReady = document.getElementById('gallery-grid')
        ? new Promise(function(resolve){
            document.addEventListener('gallery:ready', resolve, { once: true });
            setTimeout(resolve, 1200);
          })
        : Promise.resolve();

    Promise.all([fontsReady, galleryReady])
        .then(function(){
            requestAnimationFrame(function(){ hideOverlay(); });
        })
        .catch(function(err){
            console.error('Loading error:', err);
            hideOverlay(); // Hide overlay on error too
        });
});
