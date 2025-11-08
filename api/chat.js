require('dotenv').config(); // For local development

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
 }

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
    res.status(200).json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('Error in API proxy:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
}