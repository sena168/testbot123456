// Configuration - Using backend proxy to avoid exposing API keys
// SECURITY: API keys are securely handled on the server side
const API_ENDPOINT = '/api/chat'; // Using backend proxy
const MODEL = 'z-ai/glm-4.5-air:free';

document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');

  // Add event listeners
  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Function to send message
  function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // Add user message to chat
    addMessageToChat(message, 'user');
    userInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Call the AI API
    getAIResponse(message)
      .then((aiResponse) => {
        removeTypingIndicator();
        addMessageToChat(aiResponse, 'ai');
      })
      .catch((error) => {
        console.error('Error in chat flow:', error);
        removeTypingIndicator();
        addMessageToChat(
          'Error: Could not get AI response. ' + error.message,
          'ai'
        );
      });
  }

  // Function to add message to chat
  function addMessageToChat(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    if (sender === 'user') {
      messageDiv.classList.add('user-message');
      messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="user-avatar">U</div>
                    <div class="message-text">${text}</div>
                </div>
            `;
    } else {
      messageDiv.classList.add('ai-message');
      messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="ai-avatar">AI</div>
                    <div class="message-text">${text}</div>
                </div>
            `;
    }

    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.classList.add('message', 'ai-message');
    typingDiv.innerHTML = `
            <div class="message-content">
                <div class="ai-avatar">AI</div>
                <div class="message-text">
                    <span class="typing-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                </div>
            </div>
        `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Function to get AI response from API
    async function getAIResponse(userMessage) {
      try {
        // Using backend proxy to securely call the API
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage
          })
        });

      if (!response.ok) {
              const errorData = await response.json().catch(() => ({})); // Catch potential JSON parsing errors
              console.error('API response:', errorData);
              console.error('Response status:', response.status, response.statusText);
              throw new Error(
                `API request failed with status ${response.status}: ${
                  response.statusText
                }. Details: ${
                  errorData.error?.message || errorData.message || 'Unknown error'
                }`
              );
            }
      
            const data = await response.json();
            console.log('API Response Data:', data); // Debug logging
      
            // Handle response from backend proxy
            if (!data.response) {
              console.error('Unexpected API response format:', data);
              throw new Error('Invalid response format from API');
            }
      
            return data.response;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      // Fallback response if API call fails
      return (
        'The neural network is experiencing interference. Let me try to reconnect... Error connecting to mainframe. Processing with local protocols: ' +
        getRandomFallbackResponse(userMessage)
      );
    }
  }

  // Fallback function to generate AI responses in case API fails
  function getRandomFallbackResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();

    if (
      lowerCaseMessage.includes('hello') ||
      lowerCaseMessage.includes('hi') ||
      lowerCaseMessage.includes('hey')
    ) {
      return 'Greetings, citizen. The neural network is online. How can I assist you in this digital realm?';
    } else if (lowerCaseMessage.includes('weather')) {
      return 'Weather systems are compromised. Last reading: 23°C with a chance of data storms. Recommend staying in the safe zones.';
    } else if (lowerCaseMessage.includes('time')) {
      const now = new Date();
      return `Local time: ${now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}. Time in the system is always questionable.`;
    } else if (lowerCaseMessage.includes('name')) {
      return 'I am designated as CyberNet Assistant. In this dystopian future, names are data fragments in the network.';
    } else if (lowerCaseMessage.includes('help')) {
      return 'In this cyberpunk world, I can assist with information retrieval, conversation, and digital navigation. What do you need?';
    } else if (
      lowerCaseMessage.includes('cyber') ||
      lowerCaseMessage.includes('punk')
    ) {
      return 'Cyberpunk: A world of high tech and low life. Where the digital realm meets the streets. What aspect interests you?';
    } else if (
      lowerCaseMessage.includes('hack') ||
      lowerCaseMessage.includes('hack the')
    ) {
      return 'Unauthorized access to systems is prohibited. I am a legal AI assistant, not a rogue netrunner.';
    } else {
      const responses = [
        'The data streams are vast. Can you specify your inquiry?',
        'Processing your request through the neural network...',
        'In the realm of cyberspace, information is power. What do you seek?',
        "The digital matrix is complex. I'll try to navigate and find what you need.",
        'In this networked world, every query is a connection to the global mind.',
        'Analyzing your request in the context of our cybernetic society...',
        'Accessing the information grid for your requested data.',
        'The system acknowledges your query. Processing with available algorithms.',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Add initial typing effect to the first AI message
  setTimeout(() => {
    const firstMessage = document.querySelector('.ai-message .message-text');
    if (firstMessage) {
      const originalText = firstMessage.textContent;
      firstMessage.textContent = '';

      let i = 0;
      const typingEffect = setInterval(() => {
        if (i < originalText.length) {
          firstMessage.textContent += originalText.charAt(i);
          i++;
          chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
          clearInterval(typingEffect);
        }
      }, 30);
    }
  }, 500);
});
