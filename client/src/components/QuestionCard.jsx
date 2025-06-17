import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuestionCard({ question }) {
  const navigate = useNavigate();

  const handleOpenPlayground = () => {
    const title = question.link?.includes("http") ? question.link.split("/")[4]?.replace(/[-_]/g, " ") : question.link;
    const description = question.topic || "No description provided.";
    const difficulty = question.difficulty || "Unknown";

    navigate(`/playground/${encodeURIComponent(title)}`, {
      state: {
        title: title || "Untitled Question",
        description,
        difficulty,
        link: question.link
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2">
      <h2 className="text-xl font-semibold text-blue-700">
        {question.link?.includes("http") ? question.link.split("/")[4]?.replace(/[-_]/g, " ") : "Question"}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Difficulty: {question.difficulty}
      </p>
      <button
        onClick={handleOpenPlayground}
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Solve
      </button>
    </div>
  );
}
