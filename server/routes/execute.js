// server/routes/execute.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const isWindows = process.platform === "win32";
const WORKSPACE = path.join(__dirname, "../temp");
if (!fs.existsSync(WORKSPACE)) fs.mkdirSync(WORKSPACE);

const LANG_CONFIG = {
  javascript: {
    file: "Main.js",
    run: "node Main.js"
  },
  python: {
    file: "Main.py",
    run: isWindows ? "python Main.py" : "python3 Main.py"
  },
  c_cpp: {
    file: "Main.cpp",
    compile: isWindows ? "g++ Main.cpp -o Main.exe" : "g++ Main.cpp -o Main",
    run: isWindows ? "Main.exe" : "./Main"
  }
};

router.post("/", async (req, res) => {
  const { language, code, testCases = [] } = req.body;
  const cfg = LANG_CONFIG[language];

  if (!cfg) return res.status(400).json({ output: `Unsupported language: ${language}` });

  const filePath = path.join(WORKSPACE, cfg.file);
  fs.writeFileSync(filePath, code);

  const compile = cfg.compile
    ? new Promise((resolve, reject) => {
        exec(cfg.compile, { cwd: WORKSPACE }, (err, stdout, stderr) => {
          if (err) reject(stderr || err.message);
          else resolve();
        });
      })
    : Promise.resolve();

  try {
    await compile;

    const results = await Promise.all(
      testCases.map(testCase => {
        return new Promise(resolve => {
          exec(cfg.run, { cwd: WORKSPACE, input: testCase.input, timeout: 5000 }, (err, stdout, stderr) => {
            const actual = (err ? stderr || err.message : stdout).trim();
            const expected = testCase.expectedOutput.trim();
            resolve({
              input: testCase.input,
              expected,
              actual,
              passed: actual === expected
            });
          });
        });
      })
    );

    res.json({ output: results });
  } catch (err) {
    res.json({ output: `Compilation or execution failed: ${err.toString()}` });
  }
});

module.exports = router;
