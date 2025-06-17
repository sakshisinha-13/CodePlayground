const express = require("express");
const router = express.Router();

router.post("/run", async (req, res) => {
  const { code, input, language } = req.body;

  try {
    if (language === "javascript") {
      // Very basic mock execution for testing (DANGER: eval)
      let output = eval(code);
      res.json({ output: String(output) });
    } else {
      res.json({ output: "Only JavaScript is supported currently." });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
