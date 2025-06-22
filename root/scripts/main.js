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