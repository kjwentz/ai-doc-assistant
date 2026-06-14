import express from "express";
import { prisma } from "../prismaClient.js";
import { generateAnswer } from "../services/aiService.js";

const router = express.Router();

// GET /api/documents
router.get("/", async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.json({
      documents,
    });
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    res.status(500).json({
      error: "Failed to fetch documents.",
    });
  }
});

// POST /api/documents
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required.",
      });
    }

    const document = await prisma.document.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).json({
      document,
    });
  } catch (error) {
    console.error("Failed to create document:", error);
    res.status(500).json({
      error: "Failed to create document.",
    });
  }
});

// GET /api/documents/:id
router.get("/:id", async (req, res) => {
  try {
    const document = await prisma.document.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!document) {
      return res.status(404).json({
        error: "Document not found.",
      });
    }

    res.json({
      document,
    });
  } catch (error) {
    console.error("Failed to fetch document:", error);
    res.status(500).json({
      error: "Failed to fetch document.",
    });
  }
});

// PUT /api/documents/:id
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required.",
      });
    }

    const existingDocument = await prisma.document.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!existingDocument) {
      return res.status(404).json({
        error: "Document not found.",
      });
    }

    const updatedDocument = await prisma.document.update({
      where: {
        id: req.params.id,
      },
      data: {
        title,
        content,
      },
    });

    res.json({
      document: updatedDocument,
    });
  } catch (error) {
    console.error("Failed to update document:", error);
    res.status(500).json({
      error: "Failed to update document.",
    });
  }
});

// PUT /api/documents/:id
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required.",
      });
    }

    const existingDocument = await prisma.document.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!existingDocument) {
      return res.status(404).json({
        error: "Document not found.",
      });
    }

    const updatedDocument = await prisma.document.update({
      where: {
        id: req.params.id,
      },
      data: {
        title,
        content,
      },
    });

    res.json({
      document: updatedDocument,
    });
  } catch (error) {
    console.error("Failed to update document:", error);
    res.status(500).json({
      error: "Failed to update document.",
    });
  }
});

// DELETE /api/documents/:id
router.delete("/:id", async (req, res) => {
  try {
    const document = await prisma.document.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!document) {
      return res.status(404).json({
        error: "Document not found.",
      });
    }

    await prisma.document.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete document:", error);
    res.status(500).json({
      error: "Failed to delete document.",
    });
  }
});

// POST /api/documents/:id/ask
router.post("/:id/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required.",
      });
    }

    const document = await prisma.document.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!document) {
      return res.status(404).json({
        error: "Document not found.",
      });
    }

    const aiResult = await generateAnswer(document.content, question);

    const questionRecord = await prisma.question.create({
      data: {
        documentId: document.id,
        question,
        answer: aiResult.answer,
        confidence: aiResult.confidence,
        sourceExcerpt: aiResult.sourceExcerpt,
      },
    });

    res.status(201).json({
      result: questionRecord,
    });
  } catch (error) {
    console.error("Failed to ask question:", error);
    res.status(500).json({
      error: "Failed to ask question.",
    });
  }
});

// GET /api/documents/:id/questions
router.get("/:id/questions", async (req, res) => {
  try {
    const document = await prisma.document.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!document) {
      return res.status(404).json({
        error: "Document not found.",
      });
    }

    const questions = await prisma.question.findMany({
      where: {
        documentId: req.params.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      questions,
    });
  } catch (error) {
    console.error("Failed to fetch question history:", error);
    res.status(500).json({
      error: "Failed to fetch question history.",
    });
  }
});

export default router;