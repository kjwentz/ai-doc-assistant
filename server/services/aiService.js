export async function generateAnswer(documentText, question) {
  // Fake delay for now to replicate AI loading time
  await new Promise((resolve) => setTimeout(resolve, 700));

  return generateMockAnswer(documentText, question);
}

//Fake responses to replicate AI behavior for the time being
//Will replace later with real OpenAi calls
function generateMockAnswer(documentText, question) {
  const lowerDoc = documentText.toLowerCase();
  const lowerQuestion = question.toLowerCase();

  //Temp placeholder responses, will change content in future updates
  if (
    lowerQuestion.includes("run") || lowerQuestion.includes("start") || lowerQuestion.includes("locally")
  ) {
    if (lowerDoc.includes("npm install") || lowerDoc.includes("npm run dev")) {
      return {
        answer:
          "Based on the provided documentation, you can run the project locally by installing dependencies with `npm install` and starting the development server with `npm run dev`.",
        confidence: "high",
        sourceExcerpt:
          "To run the project locally, install dependencies with npm install. Then start the development server with npm run dev.",
      };
    }
  }

  if (
    lowerQuestion.includes("api key") || lowerQuestion.includes("environment") || lowerQuestion.includes(".env")
  ) {
    if (lowerDoc.includes(".env") || lowerDoc.includes("environment")) {
      return {
        answer:
          "Based on the provided documentation, environment variables should be stored in a `.env` file. API keys should not be committed to GitHub.",
        confidence: "high",
        sourceExcerpt:
          "Environment variables should be stored in a .env file. Never commit API keys to GitHub.",
      };
    }
  }

  if (lowerQuestion.includes("frontend") || lowerQuestion.includes("react")) {
    if (lowerDoc.includes("react")) {
      return {
        answer: "Based on the provided documentation, the frontend uses React.",
        confidence: "high",
        sourceExcerpt: "The project uses React for the frontend.",
      };
    }
  }

  if (lowerQuestion.includes("backend") || lowerQuestion.includes("express")) {
    if (lowerDoc.includes("express")) {
      return {
        answer:
          "Based on the provided documentation, the backend uses Express.",
        confidence: "high",
        sourceExcerpt: "The project uses Express for the backend.",
      };
    }
  }

  return {
    answer: "I don't see that information in the provided documentation.",
    confidence: "low",
    sourceExcerpt: null,
  };
}