document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav ul');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Fixed header on scroll
    const header = document.querySelector('header');
    let scrollPosition = window.scrollY;
    
    window.addEventListener('scroll', function() {
        scrollPosition = window.scrollY;
        
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links (excluding legal modal links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if this is a legal modal link
            if (targetId === '#privacy-policy' || targetId === '#terms-service') {
                return; // Let the legal modal handlers deal with these
            }
            
            e.preventDefault();
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu when clicking on link
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
    
    // Initialize EmailJS
    emailjs.init("UeJLvpSjLMF8SoKPL"); 
    
    // Contact form
    const contactForm = document.getElementById('form-contacto');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Prepare template parameters
            const templateParams = {
                from_name: contactForm.nome.value,
                from_email: contactForm.email.value,
                company_name: contactForm.clinica.value,
                message: `New demo request from ${contactForm.nome.value} at ${contactForm.clinica.value}`,
                reply_to: contactForm.email.value
            };
            
            // Send email using EmailJS
            emailjs.send('service_28focwj', 'template_ti2unz9', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Success feedback
                    contactForm.reset();
                    submitButton.textContent = '✅ Demo Request Sent!';
                    submitButton.style.backgroundColor = '#28a745';
                    
                    // Reset button after 3 seconds
                    setTimeout(function() {
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                        submitButton.style.backgroundColor = '';
                    }, 3000);
                    
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Error feedback
                    submitButton.textContent = '❌ Failed to send. Try again.';
                    submitButton.style.backgroundColor = '#dc3545';
                    
                    // Reset button after 3 seconds
                    setTimeout(function() {
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                        submitButton.style.backgroundColor = '';
                    }, 3000);
                });
        });
    }
    
    // Video functionality
    const demoVideo = document.querySelector('.demo-video video');
    
    if (demoVideo) {
        // Optional: Add custom video event listeners
        demoVideo.addEventListener('loadstart', function() {
            console.log('Video loading started');
        });
        
        demoVideo.addEventListener('error', function() {
            console.log('Video failed to load');
        });
    }

    /* -----------------------
       Legal Modal Sections
    -----------------------*/
    const privacyModal = document.getElementById('privacy-policy');
    const termsModal = document.getElementById('terms-service');
    const privacyLink = document.getElementById('footer-privacy-link'); // Changed to use ID
    const termsLink = document.getElementById('footer-terms-link'); // Changed to use ID

    let modalScrollPosition = 0; // Store scroll position when modal opens

    const openLegal = (modal) => {
        if (modal) {
            // Store current scroll position
            modalScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add modal-open class to body
            document.body.classList.add('modal-open');
            
            // Show modal
            modal.style.display = 'flex';
            
            // Trigger transition after display is set
            requestAnimationFrame(() => {
                modal.classList.add('active');
            });
        }
    };

    const closeLegal = (modal) => {
        if (modal) {
            modal.classList.remove('active');
            
            // Wait for transition to finish before hiding
            setTimeout(() => {
                modal.style.display = 'none';
                // Always remove modal-open class when closing legal modals
                document.body.classList.remove('modal-open');
            }, 300); // Match CSS transition duration
        }
    };

    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            openLegal(privacyModal);
        });
    }

    if (termsLink && termsModal) {
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            openLegal(termsModal);
        });
    }

    // Close buttons
    document.querySelectorAll('.legal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            closeLegal(this.closest('.legal-section'));
        });
    });

    // Close when clicking outside the container
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('legal-section')) {
            closeLegal(e.target);
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Find any active legal modal and close it
            const activeModal = document.querySelector('.legal-section.active');
            if (activeModal) {
                closeLegal(activeModal);
            }
        }
    });
}); 