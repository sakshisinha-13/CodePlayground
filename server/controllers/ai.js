require('dotenv').config();
const axios = require("axios");

const getCodeFeedback = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required." });
  }
  console.log("🔑 API KEY LOADED:", process.env.OPENROUTER_API_KEY);


  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mixtral-8x7b-instruct", // or try "openai/gpt-3.5-turbo"
        messages: [
          {
            role: "system",
            content: "You are a helpful code reviewer. Review the given code for correctness, performance, and improvements.",
          },
          {
            role: "user",
            content: `Please review this code:\n\n${code}`,
          },
        ],
      },
      {
        headers: {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  //"HTTP-Referer": "http://localhost:3000", // Optional
  "Content-Type": "application/json",
},

      }
    );

    const feedback = response.data.choices[0].message.content;
    res.json({ feedback });
  } catch (err) {
    console.error("OpenRouter AI error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI feedback failed", details: err.response?.data || err.message, });
  }
};

module.exports = { getCodeFeedback };
