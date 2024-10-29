import useFileUpload from "../app/api/useFileUpload";
import useQuestionAnswering from "../app/api/useQuestionAnswering";

export default function Home() {
  const { file, uploadStatus, handleFileChange, uploadFile } = useFileUpload();
  const {
    question,
    answer,
    relevantDocs,
    status,
    handleQuestionChange,
    askQuestion,
  } = useQuestionAnswering();

  const handleFileUpload = async (e) => {
    e.preventDefault();
    await uploadFile();
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    await askQuestion();
  };

  return (
    <div>
      <h1>RAG Web Application</h1>

      {/* File Upload */}
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload Document</button>
      </form>
      <p>{uploadStatus}</p>

      {/* Question Answering */}
      <form onSubmit={handleQuestionSubmit}>
        <input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask a question"
        />
        <button type="submit">Ask</button>
      </form>
      <p>{status}</p>

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
