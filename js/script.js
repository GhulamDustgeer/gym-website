// ============================================
// IRONCORE GYM - MAIN JAVASCRIPT
// ============================================

$(document).ready(function() {
    
    // Initialize Slick Carousel for Gym Tour
    $('.tour-slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } }
        ]
    });
    
    // Smooth scrolling for anchor links
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var target = $(this.hash);
            if (target.length) {
                $('html, body').animate({ scrollTop: target.offset().top - 70 }, 800);
                return false;
            }
        }
    });
    
    // Navbar active class on scroll
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        $('section').each(function() {
            var offset = $(this).offset().top - 100;
            var id = $(this).attr('id');
            if (scroll >= offset) {
                $('.nav-link').removeClass('active');
                $('.nav-link[href="#' + id + '"]').addClass('active');
            }
        });
        
        // Navbar background change on scroll
        if ($(window).scrollTop() > 50) {
            $('.navbar').css('background', 'rgba(0,0,0,0.98)');
        } else {
            $('.navbar').css('background', 'rgba(0,0,0,0.95)');
        }
    });
    
    // ========== STORY SHARING FUNCTIONALITY ==========
    let stories = JSON.parse(localStorage.getItem('gymStories') || '[]');
    
    // Function to render stories
    function renderStories() {
        let html = '';
        if (stories.length === 0) {
            html = '<div class="text-center text-white-50 py-4"><i class="fas fa-book-open fa-3x mb-3"></i><p>No stories yet. Be the first!</p></div>';
        } else {
            stories.forEach(s => {
                html += `<div class="story-card-item">
                    <div class="d-flex justify-content-between">
                        <div><strong class="text-red">${escapeHtml(s.author)}</strong> <small class="text-white-50">${s.date}</small></div>
                        <button class="btn btn-sm text-danger delete-story" data-id="${s.id}"><i class="fas fa-trash"></i></button>
                    </div>
                    <h5 class="mt-2">📖 ${escapeHtml(s.title || 'Untold journey')}</h5>
                    <p class="text-white-70">${escapeHtml(s.content)}</p>
                </div>`;
            });
        }
        $('#storiesFeed').html(html);
        
        // Delete story event
        $('.delete-story').click(function() {
            let id = $(this).data('id');
            stories = stories.filter(s => s.id != id);
            localStorage.setItem('gymStories', JSON.stringify(stories));
            renderStories();
            showToast('Story removed successfully!');
        });
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // Show toast message
    function showToast(message) {
        let toast = $('<div>').css({
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#1a1a1a',
            color: '#e03a3a',
            padding: '12px 24px',
            borderRadius: '40px',
            zIndex: 9999,
            fontSize: '14px',
            borderLeft: '4px solid #e03a3a',
            fontWeight: '500'
        }).html(`<i class="fas fa-check-circle me-2" style="color:#e03a3a;"></i> ${message}`);
        $('body').append(toast);
        setTimeout(() => {
            toast.fadeOut(500, function() { $(this).remove(); });
        }, 3000);
    }
    
    // Submit story form
    $('#storyForm').submit(function(e) {
        e.preventDefault();
        let author = $('#storyAuthor').val().trim();
        let title = $('#storyTitle').val().trim();
        let content = $('#storyContent').val().trim();
        
        if (!author || !content) {
            alert('🔥 Please fill in your name and story! 🔥');
            return;
        }
        
        let newStory = {
            id: Date.now(),
            author: author,
            title: title,
            content: content,
            date: new Date().toLocaleString()
        };
        
        stories.unshift(newStory);
        localStorage.setItem('gymStories', JSON.stringify(stories));
        renderStories();
        
        // Reset form
        $('#storyForm')[0].reset();
        
        // Show success message
        $('#storySuccessMsg').fadeIn().delay(3000).fadeOut();
        showToast('💪 Your story is live! You just inspired someone.');
        
        // Scroll to stories feed
        $('html, body').animate({
            scrollTop: $('#storiesFeed').offset().top - 100
        }, 500);
    });
    
    // Contact form submission
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        alert('Thank you! I\'ll get back to you soon. 💪');
        this.reset();
    });
    
    // Initial render
    renderStories();
    
    // Trigger scroll event on load to set active nav
    $(window).trigger('scroll');
});
// ============================================
// NEW ADDITIONS - Free Trial, WhatsApp, Book Session, Chatbot
// ============================================

$(document).ready(function() {
    
    // FREE TRIAL FORM SUBMISSION
    $('#freeTrialForm').on('submit', function(e) {
        e.preventDefault();
        let name = $('#trialName').val();
        let email = $('#trialEmail').val();
        let phone = $('#trialPhone').val();
        let goal = $('#trialGoal').val();
        
        if(name && email && phone && goal) {
            alert(`🎉 Thank you ${name}! Your 7-day free trial has been activated. We'll contact you within 24 hours.`);
            this.reset();
        } else {
            alert('Please fill in all fields to claim your free trial!');
        }
    });
    
    // BOOK SESSION MODAL
    $('#openSessionModal').on('click', function(e) {
        e.preventDefault();
        $('#sessionModal').css('display', 'block');
        $('#overlay').css('display', 'block');
        $('body').css('overflow', 'hidden');
    });
    
    $('#closeSessionModal, #overlay').on('click', function() {
        $('#sessionModal').css('display', 'none');
        $('#overlay').css('display', 'none');
        $('body').css('overflow', 'auto');
    });
    
    // BOOK SESSION FORM SUBMISSION
    $('#bookSessionForm').on('submit', function(e) {
        e.preventDefault();
        let name = $('#sessionName').val();
        let email = $('#sessionEmail').val();
        let phone = $('#sessionPhone').val();
        let sessionType = $('#sessionType').val();
        let date = $('#sessionDate').val();
        let time = $('#sessionTime').val();
        
        if(name && email && phone && sessionType && date && time) {
            alert(`✅ Session booked successfully ${name}! We'll send a confirmation to ${email}. See you at the gym! 💪`);
            this.reset();
            $('#closeSessionModal').click();
        } else {
            alert('Please fill in all fields to book your session!');
        }
    });
    
    // CHATBOT MODAL
    $('#openChatbot').on('click', function() {
        $('#chatbotModal').toggle();
    });
    
    $('#closeChatbot').on('click', function() {
        $('#chatbotModal').hide();
    });
    
    // Close chatbot when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#chatbotModal').length && !$(e.target).closest('#openChatbot').length) {
            $('#chatbotModal').hide();
        }
    });
    
    // Set minimum date for session booking to today
    let today = new Date().toISOString().split('T')[0];
    $('#sessionDate').attr('min', today);
});

// CHATBOT RESPONSES
function sendChatMessage() {
    let input = $('#chatInput');
    let message = input.val().trim();
    if(message === '') return;
    
    // Add user message
    $('#chatMessages').append(`<div class="user-message">${escapeHtml(message)}</div>`);
    input.val('');
    
    // Auto-scroll to bottom
    $('.chat-messages').scrollTop($('.chat-messages')[0].scrollHeight);
    
    // Bot response based on keywords
    setTimeout(() => {
        let response = getBotResponse(message.toLowerCase());
        $('#chatMessages').append(`<div class="bot-message">${response}</div>`);
        $('.chat-messages').scrollTop($('.chat-messages')[0].scrollHeight);
    }, 500);
}

function getBotResponse(message) {
    if(message.includes('price') || message.includes('cost') || message.includes('pricing')) {
        return "💰 Our pricing plans: Basic $30/mo, Pro $59/mo, Elite $89/mo. All include free trial! Want me to help you book one?";
    }
    else if(message.includes('course') || message.includes('training')) {
        return "🏋️ We offer Body Building, Strength Training, Weight Loss, and Functional Training courses. Which one interests you?";
    }
    else if(message.includes('trial') || message.includes('free')) {
        return "🎁 Yes! We offer a 7-day free trial. Fill out the form above to claim yours today!";
    }
    else if(message.includes('time') || message.includes('hour')) {
        return "⏰ We're open Monday-Friday 6am-10pm, Saturday-Sunday 8am-8pm. When would you like to visit?";
    }
    else if(message.includes('trainer') || message.includes('jamie')) {
        return "👨‍🏫 Jamie Fox is our head trainer with 10+ years of experience. He's certified and ready to help you transform!";
    }
    else if(message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "👋 Hello! Welcome to IronCore Gym! How can I assist you today? Ask me about pricing, courses, or free trials!";
    }
    else {
        return "💪 Thanks for your message! Our team will get back to you shortly. Meanwhile, would you like to book a free consultation?";
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}
// ============================================
// GOOGLE SHEETS INTEGRATION - Book a Session
// ============================================

// REPLACE THIS WITH YOUR ACTUAL GOOGLE APPS SCRIPT URL

// ============================================
// GOOGLE SHEETS INTEGRATION - WORKING CODE
// ============================================

const GOOGLE_SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbxvIaTT28bC6ey6c_8pKinGQczHktNxOpkSrIpJ3PHbmqMfsm5F2Saxo8BpxaPpWVKQ/exec';

$(document).ready(function() {
    
    // Set minimum date to today
    let today = new Date().toISOString().split('T')[0];
    $('#sessionDate').attr('min', today);
    
    // Open modal
    $('#openSessionBtn').on('click', function(e) {
        e.preventDefault();
        $('#sessionModal').fadeIn(300);
        $('#modalOverlay').fadeIn(300);
        $('body').css('overflow', 'hidden');
    });
    
    // Close modal
    function closeModal() {
        $('#sessionModal').fadeOut(300);
        $('#modalOverlay').fadeOut(300);
        $('body').css('overflow', 'auto');
        // Reset form when closing
        $('#bookSessionForm')[0].reset();
    }
    
    $('#closeSessionBtn').on('click', closeModal);
    $('#modalOverlay').on('click', closeModal);
    
    // ESC key to close
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('#sessionModal').is(':visible')) {
            closeModal();
        }
    });
    
    // Show toast message (not alert)
    function showToast(message, type = 'success') {
        // Remove existing toast
        $('#toastMsg').remove();
        
        let toast = $(`
            <div id="toastMsg" class="toast-notification ${type}">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `);
        $('body').append(toast);
        toast.fadeIn(300);
        setTimeout(() => {
            toast.fadeOut(300, function() { $(this).remove(); });
        }, 4000);
    }
    
    // Handle form submission - FIXED VERSION
    $('#bookSessionForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log("Form submitted"); // Debug log
        
        // Get form values
        let name = $('#sessionName').val().trim();
        let email = $('#sessionEmail').val().trim();
        let phone = $('#sessionPhone').val().trim();
        let sessionType = $('#sessionType').val();
        let date = $('#sessionDate').val();
        let time = $('#sessionTime').val();
        
        console.log("Values:", {name, email, phone, sessionType, date, time}); // Debug log
        
        // Validation
        if (!name) {
            showToast('Please enter your name!', 'error');
            return false;
        }
        if (!email) {
            showToast('Please enter your email!', 'error');
            return false;
        }
        if (!phone) {
            showToast('Please enter your phone number!', 'error');
            return false;
        }
        if (!sessionType) {
            showToast('Please select a session type!', 'error');
            return false;
        }
        if (!date) {
            showToast('Please select a date!', 'error');
            return false;
        }
        if (!time) {
            showToast('Please select a time!', 'error');
            return false;
        }
        
        // Email format validation
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address!', 'error');
            return false;
        }
        
        // Disable button and show loading
        let submitBtn = $('#submitSessionBtn');
        let originalText = submitBtn.html();
        submitBtn.html('<span class="loading-spinner"></span> Processing...').prop('disabled', true);
        
        // Prepare data
        let leadData = {
            name: name,
            email: email,
            phone: phone,
            sessionType: sessionType,
            date: date,
            time: time
        };
        
        console.log("Sending data to Google Sheets:", leadData); // Debug log
        
        // Send to Google Sheets
        fetch(GOOGLE_SHEETS_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData)
        })
        .then(() => {
            console.log("Data sent successfully"); // Debug log
            showToast(`✅ Thank you ${name}! Your session is booked. We'll contact you within 24 hours.`, 'success');
            
            // Reset form
            $('#bookSessionForm')[0].reset();
            
            // Close modal after 2 seconds
            setTimeout(() => {
                closeModal();
            }, 2000);
        })
        .catch((error) => {
            console.error('Error:', error);
            showToast('❌ Connection error. Please try again or call us directly!', 'error');
        })
        .finally(() => {
            submitBtn.html(originalText).prop('disabled', false);
        });
        
        return false;
    });
});

// Add CSS for toast and spinner if not present
if (!$('#dynamicStyles').length) {
    $('head').append(`
        <style id="dynamicStyles">
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #000;
                border-top-color: transparent;
                border-radius: 50%;
                animation: spin 0.6s linear infinite;
                margin-right: 8px;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .toast-notification {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: #1a1a1a;
                padding: 14px 28px;
                border-radius: 50px;
                z-index: 10000;
                display: none;
                animation: fadeInUp 0.3s ease;
                font-size: 14px;
                white-space: nowrap;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                font-weight: 500;
            }
            .toast-notification.success {
                border-left: 4px solid #28a745;
                border-right: 4px solid #28a745;
                color: #28a745;
            }
            .toast-notification.error {
                border-left: 4px solid #dc3545;
                border-right: 4px solid #dc3545;
                color: #dc3545;
            }
            .toast-notification i {
                margin-right: 8px;
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            @media (max-width: 768px) {
                .toast-notification {
                    white-space: normal;
                    text-align: center;
                    max-width: 90%;
                    font-size: 12px;
                    padding: 12px 20px;
                }
            }
        </style>    `);
}
