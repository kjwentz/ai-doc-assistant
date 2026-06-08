import { useState } from "react";
import "./App.css";

function App() {
  const [documentText, setDocumentText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAskQuestion() {
    setIsLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("http://localhost:3001/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentText,
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setAnswer(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">AI Documentation Assistant</p>
        <h1>Ask questions about pasted documentation</h1>
        <p className="subtitle">
          Paste internal docs, onboarding notes, API instructions, or project
          setup steps. The assistant will answer using only the provided text.
        </p>
      </section>

      <section className="card">
        <label htmlFor="documentText">Documentation</label>
        <textarea
          id="documentText"
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          placeholder="Paste documentation here..."
        />

        <label htmlFor="question">Question</label>
        <input
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Example: How do I run this project locally?"
        />

        <button
          onClick={handleAskQuestion}
          disabled={isLoading || !documentText || !question}
        >
          {isLoading ? "Thinking..." : "Ask"}
        </button>
      </section>

      {error && (
        <section className="result error">
          <h2>Error</h2>
          <p>{error}</p>
        </section>
      )}

      {answer && (
        <section className="result">
          <h2>Answer</h2>
          <p>{answer}</p>
        </section>
      )}
    </main>
  );
}

export default App;