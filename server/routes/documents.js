import express from "express";
import { documents, questions } from "../data/mockDb.js";
import { generateAnswer } from "../services/aiService.js";

const router = express.Router();

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// GET /api/documents
router.get("/", (req, res) => {
  res.json({
    documents: documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })),
  });
});

// POST /api/documents
router.post("/", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      error: "Title and content are required.",
    });
  }

  const now = new Date().toISOString();

  const newDocument = {
    id: createId("doc"),
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };

  documents.unshift(newDocument);

  res.status(201).json({
    document: newDocument,
  });
});

// GET /api/documents/:id
router.get("/:id", (req, res) => {
  const document = documents.find((doc) => doc.id === req.params.id);

  if (!document) {
    return res.status(404).json({
      error: "Document not found.",
    });
  }

  res.json({
    document,
  });
});

// DELETE /api/documents/:id
router.delete("/:id", (req, res) => {
  const documentIndex = documents.findIndex((doc) => doc.id === req.params.id);

  if (documentIndex === -1) {
    return res.status(404).json({
      error: "Document not found.",
    });
  }

  documents.splice(documentIndex, 1);

  // Remove related question history too
  for (let i = questions.length - 1; i >= 0; i--) {
    if (questions[i].documentId === req.params.id) {
      questions.splice(i, 1);
    }
  }

  res.status(204).send();
});

// POST /api/documents/:id/ask
router.post("/:id/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: "Question is required.",
    });
  }

  const document = documents.find((doc) => doc.id === req.params.id);

  if (!document) {
    return res.status(404).json({
      error: "Document not found.",
    });
  }

  const aiResult = await generateAnswer(document.content, question);

  const questionRecord = {
    id: createId("q"),
    documentId: document.id,
    question,
    answer: aiResult.answer,
    confidence: aiResult.confidence,
    sourceExcerpt: aiResult.sourceExcerpt,
    createdAt: new Date().toISOString(),
  };

  questions.unshift(questionRecord);

  res.status(201).json({
    result: questionRecord,
  });
});

// GET /api/documents/:id/questions
router.get("/:id/questions", (req, res) => {
  const document = documents.find((doc) => doc.id === req.params.id);

  if (!document) {
    return res.status(404).json({
      error: "Document not found.",
    });
  }

  const documentQuestions = questions.filter(
    (question) => question.documentId === req.params.id
  );

  res.json({
    questions: documentQuestions,
  });
});

export default router;