document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll to section
  function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  }

  // Event listener for "View My Work" button
  document.getElementById("view-work-btn").addEventListener("click", () => {
    scrollToSection("projects");
  });

  // Typing animation for name
  const text = "I'm Mark Jan M. Manlangit";
  let i = 0;
  const typingElement = document.querySelector(".typing");

  function typingEffect() {
    if (i < text.length) {
      typingElement.textContent += text.charAt(i);
      i++;
      setTimeout(typingEffect, 100);
    }
  }
  typingEffect();

  // Initialize AOS (Animate on Scroll)
  AOS.init({
    duration: 1000, // values from 0 to 3000, with step 50ms
  });

  // Sidebar Toggle
  const menuBtn = document.querySelector(".menu-btn");
  const sidebar = document.querySelector(".sidebar");
  const navLinks = document.querySelectorAll(".sidebar a");

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent click from reaching document
    sidebar.classList.toggle("active");
    // Icon change can be handled with CSS if preferred, but this works
  });

  // Close sidebar when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent the default anchor jump
      const sectionId = link.getAttribute("href").substring(1); // Get the section ID from href (e.g., "about")
      scrollToSection(sectionId); // Use our smooth scroll function
      sidebar.classList.remove("active");
    });
  });

  // Close sidebar when clicking outside
  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      sidebar.classList.remove("active");
    }
  });

  let vantaEffect; // To hold the Vanta instance
  // Vanta.js Animated Background
  vantaEffect = VANTA.NET({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x3f63ff,
    backgroundColor: 0x0d0d0d,
    maxDistance: 14.00,
    spacing: 17.00
  });

  // Theme Toggle
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
  const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`;

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    // Update icon based on theme
    if (document.body.classList.contains("light-mode")) {
      themeToggle.innerHTML = moonIcon; // Show moon icon in light mode
      vantaEffect.setOptions({ backgroundColor: 0xf4f4f4 }); // White background for Vanta
    } else {
      themeToggle.innerHTML = sunIcon; // Show sun icon in dark mode
      vantaEffect.setOptions({ backgroundColor: 0x0d0d0d }); // Black background for Vanta
    }
  });

  // Toast Notification Function
  function showToast(message, type = 'success', duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      `;
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
      background-color: #10b981;
      color: #ffffff;
      padding: 14px 16px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 320px;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.5;
      animation: slideInRight 0.25s ease-out;
      margin-bottom: 12px;
    `;

    // Add checkmark icon SVG
    const icon = document.createElement('svg');
    icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    icon.setAttribute('width', '20');
    icon.setAttribute('height', '20');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2.5');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    icon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
    icon.style.flexShrink = '0';

    const textContainer = document.createElement('span');
    textContainer.textContent = message;
    textContainer.style.flex = '1';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: #ffffff;
      font-size: 24px;
      padding: 0;
      margin: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      opacity: 0.8;
      transition: opacity 0.2s ease;
      line-height: 1;
    `;
    closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.opacity = '1';
    });
    closeBtn.addEventListener('mouseout', () => {
      closeBtn.style.opacity = '0.8';
    });

    // Close function
    const removeToast = () => {
      toast.style.animation = 'slideOutRight 0.2s ease-out';
      setTimeout(() => {
        toast.remove();
      }, 200);
    };

    closeBtn.addEventListener('click', removeToast);

    toast.appendChild(icon);
    toast.appendChild(textContainer);
    toast.appendChild(closeBtn);
    toastContainer.appendChild(toast);

    // Auto remove toast after duration
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        removeToast();
      }
    }, duration);
  }

  // Add toast animations to document if not already added
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }

      @media (max-width: 640px) {
        #toast-container {
          left: 12px !important;
          right: 12px !important;
        }
        
        #toast-container > div {
          min-width: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Contact Form Submission
  const contactForm = document.getElementById("contact-form");
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showToast("Email sent successfully", "success", 3000);
        contactForm.reset();
      } else {
        showToast(`Error: ${data.error || "Failed to send email"}`, "error", 3500);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Error sending email. Please try again later.", "error", 3500);
    }
  });

  // Lottie Animations for Projects
  const projectCards = document.querySelectorAll('.project-card');
  const lottieContainers = document.querySelectorAll('.lottie-container');
  let animationData = null;

  // Fetch the Lottie JSON data once
  fetch('project_img.json')
    .then(response => response.json())
    .then(data => {
      animationData = data;
      // Load animations into each container
      lottieContainers.forEach((container, index) => {
        const anim = lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: animationData
        });

        // Add hover listeners to the parent card
        projectCards[index].addEventListener('mouseenter', () => {
          anim.play();
        });
        projectCards[index].addEventListener('mouseleave', () => {
          anim.stop();
        });
      });
    });

  // Back to Top Button
  const backToTopButton = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    // Show button if user has scrolled down 300px
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- Seasonal Animation (Snow) ---
  const seasonalCanvas = document.getElementById('seasonal-animation-canvas');
  const ctx = seasonalCanvas.getContext('2d');
  const currentMonth = new Date().getMonth(); // 0 = January, 11 = December

  // Let's say winter is December, January, February
  if ([11, 0, 1].includes(currentMonth)) {
    seasonalCanvas.width = window.innerWidth;
    seasonalCanvas.height = window.innerHeight;
    
    let snowflakes = [];
    for (let i = 0; i < 150; i++) {
      snowflakes.push({
        x: Math.random() * seasonalCanvas.width,
        y: Math.random() * seasonalCanvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        drift: Math.random() * 2 - 1
      });
    }

    function drawSnow() {
      ctx.clearRect(0, 0, seasonalCanvas.width, seasonalCanvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      snowflakes.forEach(flake => {
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      });
      ctx.fill();
      updateSnow();
    }

    function updateSnow() {
      snowflakes.forEach(flake => {
        flake.y += flake.speed;
        flake.x += flake.drift;
        if (flake.y > seasonalCanvas.height) {
          flake.y = 0 - flake.radius;
          flake.x = Math.random() * seasonalCanvas.width;
        }
        if (flake.x > seasonalCanvas.width || flake.x < 0) {
            flake.drift *= -1;
        }
      });
    }

    function animateSnow() {
      drawSnow();
      requestAnimationFrame(animateSnow);
    }

    animateSnow();

    window.addEventListener('resize', () => {
        seasonalCanvas.width = window.innerWidth;
        seasonalCanvas.height = window.innerHeight;
    });
  }

  // --- Hidden Mini-Game ---
  const profilePhoto = document.querySelector('.profile-photo');
  const gameContainer = document.getElementById('mini-game-container');
  const gameArea = document.getElementById('game-area');
  const scoreDisplay = document.getElementById('game-score');
  const timerDisplay = document.getElementById('game-timer');
  const closeGameBtn = document.getElementById('close-game-btn');
  const missedDisplay = document.getElementById('game-missed');
  const milestoneAlert = document.getElementById('game-milestone-alert');
  let profileClickCount = 0;
  let score = 0;
  let gameInterval;
  let gameTimer;
  let missedIcons = 0;
  let timeLeft = 60;

  profilePhoto.addEventListener('click', () => {
    profileClickCount++;
    if (profileClickCount === 5) {
      startGame();
      profileClickCount = 0;
    }
  });

  const milestoneMessages = {
    10: "Nice one!",
    20: "Masiyadong ginagalingan ha!",
    30: "You're on fire! 🔥",
    40: "Grabe! Pro gamer yarn?",
    50: "Unstoppable!",
  };

  const genericMilestoneMessages = ["Keep it up!", "Wow!", "Amazing!", "Galing!"];

  closeGameBtn.addEventListener('click', () => {
    endGame();
  });

  function startGame() {
    gameContainer.classList.remove('hidden');
    score = 0;
    missedIcons = 0;    
    timeLeft = 60;
    scoreDisplay.textContent = 'Score: 0';
    missedDisplay.textContent = 'Missed: 0';
    timerDisplay.textContent = `Time: ${timeLeft}`;
    gameInterval = setInterval(createGameObject, 1000);
    gameTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    gameContainer.classList.add('hidden');
    clearInterval(gameInterval);
    clearInterval(gameTimer);
    // Clear any remaining game objects
    document.querySelectorAll('.game-object').forEach(obj => obj.remove());
  }

  function createGameObject() {
    const icons = ['💻', '💡', '🚀', '⚙️', '🎨'];
    const gameObject = document.createElement('div');
    gameObject.classList.add('game-object');
    gameObject.textContent = icons[Math.floor(Math.random() * icons.length)];
    gameObject.dataset.clicked = "false"; // Use a data attribute to track state
    gameObject.style.left = `${Math.random() * (gameArea.clientWidth - 40)}px`;
    gameObject.style.top = `-40px`;
    gameArea.appendChild(gameObject);

    gameObject.addEventListener('click', () => {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      gameObject.dataset.clicked = "true";
      gameObject.remove();

      // Check for score milestones
      let message = milestoneMessages[score];
      if (message) {
        if (score === 30) {
          showMilestoneAlert('Ginagalingan eh, Tama na yan. Tignan mo na ulit Portfolio ko');
          // Wait for the alert to be seen before ending the game
          setTimeout(endGame, 2500);
          return; // Stop further execution for this click
        }
        showMilestoneAlert(message);
      } else if (score > 50 && score % 10 === 0) {
        // For multiples of 10 after 50, show a random generic message
        const randomIndex = Math.floor(Math.random() * genericMilestoneMessages.length);
        showMilestoneAlert(genericMilestoneMessages[randomIndex]);
      }
    });

    let fallAnimation = gameObject.animate([
        { top: '-40px' },
        { top: `${gameArea.clientHeight}px` }
    ], { duration: 3000, easing: 'linear' });

    fallAnimation.onfinish = () => {
      // Only count as a miss if the object hasn't been clicked
      if (gameObject.dataset.clicked === "false") {
        missedIcons++;
        missedDisplay.textContent = `Missed: ${missedIcons}`;
        if (missedIcons >= 20) {
          // End the game immediately
          endGame();
        }
      }
      // Clean up the element from the DOM
      gameObject.remove();
    };
  }

  function showMilestoneAlert(message) {
    milestoneAlert.textContent = message;
    milestoneAlert.classList.add('show');

    setTimeout(() => {
      milestoneAlert.classList.remove('show');
    }, 2500); // Message stays for 2.5 seconds
  }

  function initializeChatbot() {
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const quickReplies = document.getElementById('chat-quick-replies');

    const toggleChatWindow = () => {
      chatWindow.classList.toggle('hidden');
      if (!chatWindow.classList.contains('hidden') && chatBody.children.length === 0) {
        addMessageToChat('bot', "Hi! I'm MarkBot. How can I help you learn more about Mark Jan?");
      }
    };

    chatBubble.addEventListener('click', toggleChatWindow);
    closeChatBtn.addEventListener('click', toggleChatWindow);

    const addMessageToChat = (sender, message) => {
      const messageElement = document.createElement('div');
      messageElement.classList.add('chat-message', sender);
      messageElement.textContent = message;
      chatBody.appendChild(messageElement);
      chatBody.scrollTop = chatBody.scrollHeight; // Scroll to bottom
    };

    const showTypingIndicator = () => {
      const typingElement = document.createElement('div');
      typingElement.classList.add('chat-message', 'bot', 'typing-indicator');
      typingElement.innerHTML = '<span></span><span></span><span></span>';
      chatBody.appendChild(typingElement);
      chatBody.scrollTop = chatBody.scrollHeight;
      return typingElement;
    };

    const handleSendMessage = async () => {
      const message = chatInput.value.trim();
      if (!message) return;

      addMessageToChat('user', message);
      chatInput.value = '';
      quickReplies.style.display = 'none'; // Hide quick replies after sending a message

      const typingIndicator = showTypingIndicator();

      // Use a finally block to ensure the typing indicator is always removed
      // after the request is complete, whether it succeeds or fails.
      try {
        // Use the API route instead of localhost
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });
        
        if (!response.ok) {
          // Try to get a more specific error message from the backend
          const errorData = await response.json().catch(() => ({ error: 'Network response was not ok.' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        addMessageToChat('bot', data.reply);

      } catch (error) {
        console.error('Error sending message:', error.message);
        addMessageToChat('bot', `Sorry, an error occurred: ${error.message}`);
      } finally {
        // This will run after the try or catch block is finished.
        if (typingIndicator && chatBody.contains(typingIndicator)) {
          chatBody.removeChild(typingIndicator);
        }
      }
    };

    chatSendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });

    quickReplies.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const question = e.target.textContent;
        chatInput.value = question;
        handleSendMessage();
      }
    });
  }

  // Initialize all features
  initializeChatbot();

});