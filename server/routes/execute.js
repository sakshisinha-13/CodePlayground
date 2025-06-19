const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const isWindows = process.platform === "win32";
const WORKSPACE = path.join(__dirname, "../temp");
if (!fs.existsSync(WORKSPACE)) fs.mkdirSync(WORKSPACE);

// Language config
const LANG_CONFIG = {
  javascript: {
    file: "Main.js",
    run: "node Main.js",
  },
  python: {
    file: "Main.py",
    run: isWindows ? "python Main.py" : "python3 Main.py",
  },
  c_cpp: {
    file: "Main.cpp",
    compile: isWindows ? "g++ Main.cpp -o Main.exe" : "g++ Main.cpp -o Main",
    run: isWindows ? "Main.exe" : "./Main",
  },
};

router.post("/", async (req, res) => {
  const { language, code, testCases = [] } = req.body;
  const cfg = LANG_CONFIG[language];
  if (!cfg) return res.status(400).json({ error: "❌ Unsupported language" });

  const filePath = path.join(WORKSPACE, cfg.file);
  fs.writeFileSync(filePath, code); // Save code to file

  try {
    // Compile if needed
    if (cfg.compile) {
      console.log("🔧 Compiling...");
      await new Promise((resolve, reject) => {
        exec(cfg.compile, { cwd: WORKSPACE }, (err, stdout, stderr) => {
          if (err) {
            console.error("❌ Compilation error:", stderr || err.message);
            return reject(stderr || err.message);
          }
          resolve(stdout);
        });
      });
      console.log("✅ Compilation successful");
    }

    // Execute test cases
    const results = await Promise.all(
      testCases.map(tc => {
        return new Promise(resolve => {
          const proc = exec(cfg.run, { cwd: WORKSPACE, timeout: 5000 }, (err, stdout, stderr) => {
            const output = (err ? stderr || err.message : stdout).trim();
            const expected = (tc.expectedOutput || "").trim();
            resolve({
              input: tc.input,
              expectedOutput: expected,
              actualOutput: output,
              status: output === expected ? "✅ Accepted" : "❌ Failed",
                passed: output === expected
            });
          });

          // Send test input via stdin
          if (proc.stdin) {
            proc.stdin.write(tc.input || "");
            proc.stdin.end();
          }
        });
      })
    );

    res.json(results);
  } catch (error) {
    console.error("❌ Execution error:", error);
    res.status(500).json({ error: "Code execution failed", details: error.toString() });
  }
});

module.exports = router;
