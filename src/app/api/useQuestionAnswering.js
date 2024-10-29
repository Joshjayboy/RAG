import { useState } from "react";

export default function useQuestionAnswering() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [relevantDocs, setRelevantDocs] = useState([]);
  const [status, setStatus] = useState("");

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const askQuestion = async () => {
    setStatus("Loading...");

    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnswer(data.answer);
        setRelevantDocs(data.relevantDocs);
        setStatus("Answer received");
      } else {
        setStatus("Failed to retrieve answer");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error retrieving answer");
    }
  };

  return {
    question,
    answer,
    relevantDocs,
    status,
    handleQuestionChange,
    askQuestion,
  };
}
