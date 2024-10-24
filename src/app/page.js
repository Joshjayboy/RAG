"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Home() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [relevantDocs, setRelevantDocs] = useState([]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("File uploaded successfully");
    } else {
      alert("File upload failed");
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setAnswer(data.answer);
    setRelevantDocs(data.relevantDocs);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: "30px",
          mt: 6,
          mb: 6,
        }}
      >
        RAG Web Application
      </Box>

      {/* File Upload */}
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: "20px",
          mt: 9,
          mb: "26px",
        }}
      >
        <form onSubmit={handleFileUpload}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <Button variant="outlined" type="submit">
            Upload Document
          </Button>
        </form>
      </Box>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: "20px",
          mt: "26px",
          mb: "26px",
        }}
      >
        {/* Question Answering */}
        <form onSubmit={handleQuestionSubmit}>
          <Box
            sx={{
              mt: 9,
            }}
          >
            <input
              style={{
                border: "2px solid black",
              }}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question"
            />
            {"         "}
            <Button variant="outlined" type="submit">
              Ask
            </Button>
          </Box>
        </form>
      </div>

      {/* Display Answer and Relevant Documents */}
      {answer && (
        <div>
          <h2>Answer:</h2>
          <p>{answer}</p>
          <h3>Relevant Documents:</h3>
          {relevantDocs.map((doc, index) => (
            <p key={index}>{doc}</p>
          ))}
        </div>
      )}
    </div>
  );
}
