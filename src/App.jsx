import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:3001/api";

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [question, setQuestion] = useState("");
  const [questionHistory, setQuestionHistory] = useState([]);

  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState("");

  const selectedDocument = documents.find((doc) => doc.id === selectedDocumentId);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (selectedDocumentId) {
      fetchQuestionHistory(selectedDocumentId);
    }
  }, [selectedDocumentId]);

  async function fetchDocuments() {
    setIsLoadingDocuments(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/documents`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch documents.");
      }

      setDocuments(data.documents);

      if (data.documents.length > 0 && !selectedDocumentId) {
        setSelectedDocumentId(data.documents[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingDocuments(false);
    }
  }

  async function fetchQuestionHistory(documentId) {
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/documents/${documentId}/questions`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch question history.");
      }

      setQuestionHistory(data.questions);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateDocument(event) {
    event.preventDefault();

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create document.");
      }

      setDocuments((prevDocuments) => [data.document, ...prevDocuments]);
      setSelectedDocumentId(data.document.id);
      setTitle("");
      setContent("");
      setQuestionHistory([]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteDocument(documentId) {
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete document.");
      }

      const remainingDocuments = documents.filter((doc) => doc.id !== documentId);
      setDocuments(remainingDocuments);

      if (selectedDocumentId === documentId) {
        setSelectedDocumentId(remainingDocuments[0]?.id || "");
        setQuestionHistory([]);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAskQuestion(event) {
    event.preventDefault();

    if (!selectedDocumentId || !question) {
      setError("Select a document and enter a question.");
      return;
    }

    setIsAsking(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/documents/${selectedDocumentId}/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to ask question.");
      }

      setQuestionHistory((prevHistory) => [data.result, ...prevHistory]);
      setQuestion("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">AI Documentation Assistant</p>
        <h1>Ask any question about your saved documentation</h1>
        <p className="subtitle">
          Save documentation, ask questions using the selected document, and
          view answer history from a mock AI service layer.
        </p>
      </section>

      {error && (
        <section className="result error">
          <h2>Error</h2>
          <p>{error}</p>
        </section>
      )}

      <section className="layout">
        <aside className="sidebar">
          <h2>Saved Documents</h2>

          {isLoadingDocuments && <p>Loading documents...</p>}

          {!isLoadingDocuments && documents.length === 0 && (
            <p>No documents saved yet.</p>
          )}

          <div className="document-list">
            {documents.map((doc) => (
              <button
                key={doc.id}
                className={
                  doc.id === selectedDocumentId
                    ? "document-button active"
                    : "document-button"
                }
                onClick={() => setSelectedDocumentId(doc.id)}
              >
                {doc.title}
              </button>
            ))}
          </div>
        </aside>

        <section className="main-panel">
          <section className="card">
            <h2>Create Document</h2>

            <form onSubmit={handleCreateDocument}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Project Setup Guide"
              />

              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste documentation here..."
              />

              <button type="submit">Save Document</button>
            </form>
          </section>

          {selectedDocument && (
            <section className="card">
              <div className="document-header">
                <div>
                  <p className="eyebrow">Selected Document</p>
                  <h2>{selectedDocument.title}</h2>
                </div>

                <button
                  className="danger-button"
                  onClick={() => handleDeleteDocument(selectedDocument.id)}
                >
                  Delete
                </button>
              </div>

              <p className="document-preview">{selectedDocument.content}</p>

              <form onSubmit={handleAskQuestion}>
                <label htmlFor="question">Ask a question</label>
                <input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Example: How do I run this project locally?"
                />

                <button type="submit" disabled={isAsking}>
                  {isAsking ? "Thinking..." : "Ask"}
                </button>
              </form>
            </section>
          )}

          {selectedDocument && (
            <section className="result">
              <h2>Answer</h2>

              {questionHistory.length === 0 && (
                <p>No questions asked for this document yet.</p>
              )}

              <div className="history-list">
                {questionHistory.map((item) => (
                  <article key={item.id} className="history-item">
                    <p className="history-question">{item.question}</p>
                    <p>{item.answer}</p>

                    <p className="meta">
                      Confidence: {item.confidence}
                    </p>

                    {item.sourceExcerpt && (
                      <blockquote>{item.sourceExcerpt}</blockquote>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;