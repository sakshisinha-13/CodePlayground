// src/pages/Playground.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AceEditor from "react-ace";
import axios from "axios";

// ACE Config
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import * as ace from "ace-builds";

const Playground = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [code, setCode] = useState(`function greet(name) {
  return "Hello, " + name + "!";
}
console.log(greet("World"));`);
  const [language, setLanguage] = useState("javascript");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Safe ACE config inside useEffect
  useEffect(() => {
    try {
      ace.config.set("basePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12");
      ace.config.setModuleUrl(
        "ace/mode/javascript_worker",
        "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/worker-javascript.js"
      );
    } catch (err) {
      console.error("ACE config error:", err);
    }
  }, []);

  // ✅ Redirect if no question is selected
  useEffect(() => {
    if (!state || !state.title) {
      navigate("/dashboard");
    }
  }, [state, navigate]);

  const runCode = async () => {
    try {
      setLoading(true);
      const res = await axios.post("https://codeexecutor-production.up.railway.app/execute", {
        language,
        code,
        input,
      });
      setOutput(res.data.output);
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!state) return null;

  return (
    <div className="min-h-screen px-6 py-4 bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{state.title}</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {state.description}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {state.difficulty} | {state.topic || "N/A"}
        </p>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Language</label>
        <select
          className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="c_cpp">C++</option>
        </select>
      </div>

      <AceEditor
        mode={language}
        theme="monokai"
        value={code}
        onChange={setCode}
        name="code-editor"
        fontSize={14}
        width="100%"
        height="300px"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />

      <div className="mt-4">
        <label className="block mb-1">Custom Input</label>
        <textarea
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          rows="3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={runCode}
        disabled={loading}
      >
        {loading ? "Running..." : "Run Code"}
      </button>

      <div className="mt-4">
        <label className="block mb-1">Output</label>
        <pre className="w-full p-2 bg-gray-200 dark:bg-gray-800 rounded overflow-x-auto whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
};

export default Playground;
