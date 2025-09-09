class ChatApp {
    constructor() {
        this.chatContainer = document.getElementById('chatContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.themeToggle = document.getElementById('themeToggle');

        this.conversationId = this.generateConversationId();
        this.isProcessing = false;

        this.initializeTheme();
        this.initializeEventListeners();
    }

    generateConversationId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initializeTheme() {
        // Set dark mode as default
        document.documentElement.classList.add('dark');
        this.updateThemeIcon(true);

        // Load saved theme preference or use dark as default
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
            this.updateThemeIcon(false);
        }
    }

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        this.updateThemeIcon(isDark);

        // Save theme preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    updateThemeIcon(isDark) {
        this.themeToggle.textContent = isDark ? '☀️' : '🌙';
        this.themeToggle.setAttribute('aria-label',
            isDark ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }

    initializeEventListeners() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Send button click
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize input and focus
        this.messageInput.addEventListener('input', () => {
            this.adjustInputHeight();
        });

        // Focus on input when page loads
        this.messageInput.focus();
    }

    adjustInputHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();

        if (!message || this.isProcessing) {
            return;
        }

        // Add user message to chat
        this.addMessage(message, 'user');

        // Clear input and disable sending
        this.messageInput.value = '';
        this.adjustInputHeight();
        this.setProcessingState(true);

        try {
            // Send message to backend
            const response = await this.callChatAPI(message);

            // Add bot response to chat
            this.addMessage(response.response, 'bot');

        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage(
                'Sorry, I encountered an error while processing your message. Please try again.',
                'bot',
                true
            );
        } finally {
            this.setProcessingState(false);
            this.messageInput.focus();
        }
    }

    async callChatAPI(message) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversation_id: this.conversationId
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

        return await response.json();
    }

    addMessage(content, sender, isError = false) {
        // Remove welcome message if it exists
        const welcomeMessage = this.chatContainer.querySelector('.welcome-message');
        if (welcomeMessage && sender === 'user') {
            welcomeMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        if (isError) {
            contentDiv.style.borderColor = '#dc3545';
            contentDiv.style.backgroundColor = '#f8d7da';
            contentDiv.style.color = '#721c24';
        }

        // Format the content (preserve line breaks, etc.)
        contentDiv.innerHTML = this.formatMessage(content);

        messageDiv.appendChild(contentDiv);
        this.chatContainer.appendChild(messageDiv);

        // Scroll to bottom
        this.scrollToBottom();

        // Add a subtle animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';

        requestAnimationFrame(() => {
            messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
    }

    formatMessage(content) {
        // Basic formatting - convert line breaks to <br> tags
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold text
            .replace(/\*(.*?)\*/g, '<em>$1</em>');  // Italic text
    }

    setProcessingState(processing) {
        this.isProcessing = processing;
        this.sendButton.disabled = processing;
        this.messageInput.disabled = processing;

        if (processing) {
            this.typingIndicator.style.display = 'flex';
        } else {
            this.typingIndicator.style.display = 'none';
        }
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
}

// Initialize the chat app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + / to focus on input
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.getElementById('messageInput').focus();
    }
});
