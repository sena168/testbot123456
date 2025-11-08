// Example backend proxy for secure API access
// This file demonstrates how to properly handle API keys on the server side
// Run with: node server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (frontend)
app.use(express.static('.'));

// API route to proxy requests to OpenRouter
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Get API key from environment variables (never exposed to client)
    const API_KEY = process.env.ZAI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.MINIMAX_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'z-ai/glm-4.5-air:free', // or use environment variable
        messages: [
          {
            role: 'system',
            content: 'You are a cyberpunk-themed AI assistant in a dystopian future. Respond in character with cyberpunk terminology and attitude. Keep responses concise but engaging.'
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('Error in API proxy:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// For Vercel deployment, export the app as a serverless function
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  // For local development
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Secure API proxy ready. Frontend should call /api/chat instead of OpenRouter directly.');
  });
}