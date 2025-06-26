const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getCodeFeedback = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    console.log("❌ No code received in request body");
    return res.status(400).json({ error: "Code is required." });
  }

  console.log("💬 Received code for AI feedback:", code.slice(0, 100), "...");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo" if you're on free tier
      messages: [
        {
          role: "system",
          content: "You are a helpful code reviewer. Provide feedback on correctness, performance, and improvements.",
        },
        {
          role: "user",
          content: `Review this C++ code:\n\n${code}`,
        },
      ],
      temperature: 0.5,
    });

    const feedback = response.choices[0].message.content;
    console.log("✅ AI feedback generated.");
    res.json({ feedback });
  } catch (err) {
    console.error("❌ OpenAI error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "AI feedback failed.", details: err.message });
  }
};

module.exports = { getCodeFeedback };
