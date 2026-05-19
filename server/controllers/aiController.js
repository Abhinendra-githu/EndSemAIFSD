const axios = require('axios');

const analyzeComplaint = async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ message: 'Description is required for AI analysis' });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant for a smart complaint management system. Analyze the given complaint and return ONLY a valid JSON object with the following keys: "priority" (High, Medium, Low), "department" (Water Department, Electricity Board, etc.), "summary" (a short 1-line summary), and "autoResponse" (a polite response acknowledging the issue).'
          },
          {
            role: 'user',
            content: `Complaint: ${description}`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiContent = response.data.choices[0].message.content;
    
    // Parse the JSON string from AI
    let parsedData;
    try {
      const cleaned = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({ message: 'Failed to parse AI response', raw: aiContent });
    }

    res.json(parsedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Analysis failed', error: error.message });
  }
};

module.exports = { analyzeComplaint };
