// Global site JavaScript: header loader + menu initialization

// Header menu initialization function
function initHeaderMenu(container) {
  var scope = container || document;
  var hamburger = scope.querySelector('#hamburger-menu');
  var popup = scope.querySelector('#menu-popup');
  var backdrop = scope.querySelector('#menu-backdrop');
  var body = document.body;
  
  if (!hamburger || !popup) {
    console.warn('Header menu elements not found');
    return;
  }

  if (hamburger.dataset.initialized === 'true') return;
  hamburger.dataset.initialized = 'true';

  function isMobile() { return window.innerWidth <= 860; }
  
  function openMenu() {
    popup.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open');
    if (backdrop) {
      backdrop.classList.add('visible');
      backdrop.setAttribute('aria-hidden', 'false');
    }
  }
  
  function closeMenu() {
    popup.classList.remove('open');
    popup.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
    if (backdrop) {
      backdrop.classList.remove('visible');
      backdrop.setAttribute('aria-hidden', 'true');
    }
  }

  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    if (isMobile()) {
      if (popup.classList.contains('open')) { 
        closeMenu(); 
      } else { 
        openMenu(); 
      }
    }
  });
  
  hamburger.addEventListener('keydown', function(e) {
    if (!isMobile()) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      hamburger.click();
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (isMobile() && popup.classList.contains('open') && e.key === 'Escape') {
      closeMenu();
    }
  });
  
  document.addEventListener('click', function(e) {
    if (isMobile() && popup.classList.contains('open')) {
      if (!popup.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
      }
    }
  });
  if (backdrop) {
    backdrop.addEventListener('click', function() {
      if (isMobile() && popup.classList.contains('open')) {
        closeMenu();
      }
    });
  }
  
  window.addEventListener('resize', function() {
    if (!isMobile()) { 
      closeMenu(); 
    }
  });
  
  console.log('Header menu initialized');
}

// Single DOMContentLoaded handler for all initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing...');
  
  // Load shared header
  var siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    fetch('header.html')
      .then(function(r){ 
        if (!r.ok) throw new Error('Failed to load header');
        return r.text(); 
      })
      .then(function(html){
        siteHeader.innerHTML = html;
        console.log('Header HTML loaded');
        initHeaderMenu(siteHeader);
      })
      .catch(function(err){ 
        console.error('Header load error:', err);
        siteHeader.innerHTML = '<div style="background:#F7F7F7;color:#D7BAAD;padding:12px;text-align:center;">Header failed to load</div>';
      });
  }
  
  // Demo contact form handler
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      var formData = new FormData(contactForm);
      var data = Object.fromEntries(formData.entries());
      console.log('Form submitted:', data);
      alert('Thank you for your message!');
      contactForm.reset();
    });
  }
});