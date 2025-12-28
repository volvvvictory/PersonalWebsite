// This file contains JavaScript code for the website. 
// You can add functionality for interactive elements, such as form submissions or dynamic content updates.

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Form submitted:', data);
            alert('Thank you for your message!');
            contactForm.reset();
        });
    }
});

// Header menu initialization
function initHeaderMenu(container) {
  var scope = container || document;
  var hamburger = scope.querySelector('#hamburger-menu');
  var popup = scope.querySelector('#menu-popup');
  var body = document.body;
  if (!hamburger || !popup) return;

  if (hamburger.dataset.initialized === 'true') return;
  hamburger.dataset.initialized = 'true';

  function isMobile() { return window.innerWidth <= 860; }
  function openMenu() {
    popup.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open');
  }
  function closeMenu() {
    popup.classList.remove('open');
    popup.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }

  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    if (isMobile()) {
      if (popup.classList.contains('open')) { closeMenu(); } else { openMenu(); }
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
  window.addEventListener('resize', function() {
    if (!isMobile()) { closeMenu(); }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    fetch('header.html')
      .then(function(r){ return r.text(); })
      .then(function(html){
        siteHeader.innerHTML = html;
        initHeaderMenu(siteHeader);
      })
      .catch(function(err){ console.error('Header load error:', err); });
  }
});