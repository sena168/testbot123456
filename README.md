# CyberChat AI

A cyberpunk-themed chat interface that connects to AI models via the OpenRouter API.

## Features

- Cyberpunk-themed UI with neon colors and glitch effects
- Real-time chat interface with typing indicators
- Fallback responses when API is unavailable
- Support for multiple AI models

## Security Notice

⚠️ **IMPORTANT SECURITY INFORMATION** ⚠️

This application currently includes API keys directly in the client-side JavaScript code. This is acceptable for development and testing purposes, but **NOT SECURE FOR PRODUCTION**.

### Current Security Measures:
- `.gitignore` properly excludes `.env` and `externals/` directories from Git commits
- API keys are not committed to version control

### Production Security Recommendations:
1. **Implement a backend proxy** to handle API requests server-side
2. **Never expose API keys in client-side code** in production
3. **Use environment variables** for API keys during the build process
4. **Consider rate limiting** to prevent abuse of your API key

## Setup

1. The application is ready to run directly in the browser
2. The Z.AI API key is pre-configured in `script.js`

## Files

- `index.html` - Main application interface
- `script.js` - Core application logic and API integration
- `styles.css` - Cyberpunk-themed styling
- `.env` - Environment variables (not committed to Git)
- `externals/` - Additional resources and API notes (not committed to Git)

## API Configuration

The application currently uses:
- Model: `z-ai/glm-4.5-air:free`
- API Key: Stored in script.js (for development only)

## Development

For production use, implement a backend service to:
1. Handle API requests securely
2. Protect API keys from exposure
3. Implement rate limiting
4. Add additional security measures

## Backend Proxy Implementation

A secure backend proxy example is provided in `server.js`:
- API keys are stored in environment variables (not exposed to client)
- Client sends requests to your server, which then forwards to OpenRouter
- Prevents API key exposure in browser
- Allows for additional security measures like rate limiting

To use the backend proxy:
1. Install dependencies: `npm install express cors dotenv`
2. Set API key in `.env` file
3. Run the server: `node server.js`
4. Update frontend to call `/api/chat` endpoint instead of OpenRouter directly