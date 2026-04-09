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
