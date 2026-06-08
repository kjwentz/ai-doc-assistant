export const documents = [
  {
    id: "doc_1",
    title: "Project Setup Guide",
    content: `Project Setup Guide

To run the project locally, install dependencies with npm install.
Then start the development server with npm run dev.

The project uses React for the frontend and Express for the backend.

Environment variables should be stored in a .env file.
Never commit API keys to GitHub.

For deployment, the frontend can be hosted on Vercel and the backend can be hosted on Render.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const questions = [];