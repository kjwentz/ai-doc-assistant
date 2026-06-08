import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.post("/api/ask", async (req, res) => {
  try {
    const { documentText, question } = req.body;

    if (!documentText || !question) {
      return res.status(400).json({
        error: "Document text and question are required.",
      });
    }

    // Fake delay so the loading state feels realistic
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockAnswer = generateMockAnswer(documentText, question);

    res.json({
      answer: mockAnswer,
    });
  } catch (error) {
    console.error("Mock server error:", error);
    res.status(500).json({
      error: "Something went wrong while generating the mock answer.",
    });
  }
});

function generateMockAnswer(documentText, question) {
  const lowerDoc = documentText.toLowerCase();
  const lowerQuestion = question.toLowerCase();

  if (
    lowerQuestion.includes("run") ||
    lowerQuestion.includes("start") ||
    lowerQuestion.includes("locally")
  ) {
    if (lowerDoc.includes("npm install") || lowerDoc.includes("npm run dev")) {
      return `Based on the provided documentation, you can run the project locally by installing dependencies with \`npm install\` and starting the development server with \`npm run dev\`.`;
    }
  }

  if (
    lowerQuestion.includes("api key") ||
    lowerQuestion.includes("environment") ||
    lowerQuestion.includes(".env")
  ) {
    if (lowerDoc.includes(".env") || lowerDoc.includes("environment")) {
      return `Based on the provided documentation, environment variables should be stored in a \`.env\` file. API keys should not be committed to GitHub.`;
    }
  }

  if (
    lowerQuestion.includes("frontend") ||
    lowerQuestion.includes("react")
  ) {
    if (lowerDoc.includes("react")) {
      return `Based on the provided documentation, the frontend uses React.`;
    }
  }

  if (
    lowerQuestion.includes("backend") ||
    lowerQuestion.includes("express")
  ) {
    if (lowerDoc.includes("express")) {
      return `Based on the provided documentation, the backend uses Express.`;
    }
  }

  return `I don't see that information in the provided documentation.`;
}

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});