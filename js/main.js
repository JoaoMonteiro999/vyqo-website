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
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
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
    const privacyLink = document.querySelector('a[href="#privacy-policy"]');
    const termsLink = document.querySelector('a[href="#terms-service"]');

    const openLegal = (modal) => {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeLegal = (modal) => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
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

    /* -----------------------
       Voiceflow Chatbot Mobile Fix
    -----------------------*/
    
    // Wait for Voiceflow to load
    window.addEventListener('load', function() {
        // Check if Voiceflow is loaded
        const checkVoiceflow = setInterval(function() {
            if (window.voiceflow && window.voiceflow.chat) {
                clearInterval(checkVoiceflow);
                setupVoiceflowMobileFix();
            }
        }, 1000);
        
        // Timeout after 10 seconds
        setTimeout(function() {
            clearInterval(checkVoiceflow);
        }, 10000);
    });
    
    function setupVoiceflowMobileFix() {
        // Add mobile-specific configuration
        if (window.voiceflow && window.voiceflow.chat) {
            // Override the default load configuration for mobile
            const originalLoad = window.voiceflow.chat.load;
            
            window.voiceflow.chat.load = function(config) {
                // Add mobile-specific options
                const mobileConfig = {
                    ...config,
                    voice: {
                        ...config.voice,
                        // Ensure proper mobile behavior
                        mobile: {
                            preventScrollLock: true,
                            allowBackButton: true,
                            zIndex: 9999
                        }
                    }
                };
                
                return originalLoad.call(this, mobileConfig);
            };
        }
        
        // Monitor for Voiceflow iframe creation
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Check for Voiceflow iframes
                        if (node.tagName === 'IFRAME' && node.src && node.src.includes('voiceflow')) {
                            fixVoiceflowIframe(node);
                        }
                        
                        // Check for Voiceflow containers
                        if (node.classList && (node.classList.contains('voiceflow') || node.getAttribute('data-voiceflow'))) {
                            fixVoiceflowContainer(node);
                        }
                        
                        // Check child elements
                        const voiceflowElements = node.querySelectorAll('iframe[src*="voiceflow"], .voiceflow, [data-voiceflow]');
                        voiceflowElements.forEach(function(element) {
                            if (element.tagName === 'IFRAME') {
                                fixVoiceflowIframe(element);
                            } else {
                                fixVoiceflowContainer(element);
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Fix existing Voiceflow elements
        document.querySelectorAll('iframe[src*="voiceflow"], .voiceflow, [data-voiceflow]').forEach(function(element) {
            if (element.tagName === 'IFRAME') {
                fixVoiceflowIframe(element);
            } else {
                fixVoiceflowContainer(element);
            }
        });
    }
    
    function fixVoiceflowIframe(iframe) {
        // Ensure iframe doesn't interfere with mobile navigation
        iframe.style.zIndex = '9999';
        iframe.style.position = 'fixed';
        iframe.style.bottom = '20px';
        iframe.style.right = '20px';
        iframe.style.maxWidth = '60px';
        iframe.style.maxHeight = '60px';
        iframe.style.width = '60px';
        iframe.style.height = '60px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '50%';
        iframe.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        
        // Add mobile-specific attributes
        iframe.setAttribute('allowtransparency', 'true');
        iframe.setAttribute('scrolling', 'no');
    }
    
    function fixVoiceflowContainer(container) {
        // Ensure container doesn't block mobile navigation
        container.style.zIndex = '9999';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.maxWidth = '60px';
        container.style.maxHeight = '60px';
        container.style.pointerEvents = 'auto';
        
        // Prevent container from taking over the entire screen
        container.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Handle mobile back button
    window.addEventListener('popstate', function(e) {
        // Ensure Voiceflow doesn't interfere with browser navigation
        if (window.voiceflow && window.voiceflow.chat) {
            // Close chat if open
            try {
                window.voiceflow.chat.close();
            } catch (error) {
                console.log('Voiceflow chat close error:', error);
            }
        }
    });
    
    // Prevent Voiceflow from blocking touch events on mobile
    document.addEventListener('touchstart', function(e) {
        // Allow touch events to pass through to browser controls
        if (e.target.closest('[data-voiceflow], .voiceflow, iframe[src*="voiceflow"]')) {
            e.stopPropagation();
        }
    }, { passive: true });
    
    // Ensure proper viewport handling on mobile
    if (window.innerWidth <= 768) {
        // Set proper viewport meta tag
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        }
        
        // Prevent body scroll lock
        document.body.style.position = 'relative';
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
    }
}); 