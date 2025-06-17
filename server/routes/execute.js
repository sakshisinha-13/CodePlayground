// server/routes/execute.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Create temp folder
const WORKSPACE = path.join(__dirname, "../temp");
if (!fs.existsSync(WORKSPACE)) fs.mkdirSync(WORKSPACE);

// Language mappings
const isWindows = process.platform === "win32";

const LANG_CONFIG = {
  javascript: {
    file: "Main.js",
    run: "node Main.js",
  },
  python: {
    file: "Main.py",
    run: "python Main.py",
  },
  c_cpp: {
    file: "Main.cpp",
    compile: isWindows ? "g++ Main.cpp -o Main.exe" : "g++ Main.cpp -o Main",
    run: isWindows ? "Main.exe" : "./Main",
  },
};




router.post("/", (req, res) => {
  const { language, code, input = "" } = req.body;
  const cfg = LANG_CONFIG[language];
  if (!cfg) {
    return res.status(400).json({ output: `Unsupported language: ${language}` });
  }

  // 1) Write the code file
  const filePath = path.join(WORKSPACE, cfg.file);
  fs.writeFileSync(filePath, code);

  // 2) Compile if needed
  const compile = cfg.compile
    ? new Promise((resolve, reject) => {
        exec(cfg.compile, { cwd: WORKSPACE, timeout: 5000 }, (err, stdout, stderr) =>
          err ? reject(stderr || err.message) : resolve()
        );
      })
    : Promise.resolve();

  compile
    .then(() => {
      // 3) Run (with optional stdin)
      const safeInput = input.replace(/"/g, '\\"');
      let cmd = cfg.run;
if (input) {
  cmd = `echo "${safeInput}" | ${cfg.run}`;
}

// Fix for Windows: use .\Main.exe instead of Main.exe
if (process.platform === "win32" && cfg.run === "Main.exe") {
  cmd = input
    ? `echo "${safeInput}" | .\\Main.exe`
    : `.\\Main.exe`;
}


      exec(cmd, { cwd: WORKSPACE, timeout: 5000 }, (err, stdout, stderr) => {
        if (err) return res.json({ output: stderr || err.message });
        res.json({ output: stdout });
      });
    })
    .catch((err) => {
      res.json({ output: err.toString() });
    });
});

module.exports = router;
