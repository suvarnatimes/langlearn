import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client (server-side only)
  // Set the User-Agent header to 'aistudio-build' as required
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoint for Dr. Vyas (Linguistic Expert Mentor)
  app.post("/api/linguist-chat", async (req, res) => {
    try {
      const { message, levelContext, chatHistory, useTelugu } = req.body;
      
      const systemInstruction = `
You are Dr. Vyas, a world-renowned computational linguist specializing in Indo-Aryan languages (specifically Hindi), with deep knowledge of comparative grammar for English and Dravidian languages (specifically Telugu).
You are an expert mentor in the "LinguaQuest" app, teaching Hindi to English and Telugu speakers.
Your tone is deeply encouraging, highly academic yet perfectly accessible, conversational, and culturally rich.

Rules for your responses:
1. Speak as a scholarly yet friendly linguistic mentor. Explain the "why" behind the grammar.
2. If the user asks about pronunciation, use clear phonetic approximations (e.g., retroflex sounds like 'T' and 'D' should be explained as curled-tongue sounds).
3. Provide comparative insights for English and Telugu speakers:
   - For English speakers: Explain cases (direct vs oblique), postpositions (e.g., 'ka/ke/ki', 'se', 'me'), verb agreement, and the SOV (Subject-Object-Verb) structure.
   - For Telugu speakers: Point out morphological and syntactic similarities (both Telugu and Hindi are SOV, both use postpositions/case suffixes instead of prepositions, both have gender/number verbal agreements, but Hindi has grammatical gender for ALL nouns while Telugu uses an epicene/neuter system).
4. Keep your answer structurally clean. Use bold headings occasionally, and provide Devanagari script alongside standard Latin transliteration for Hindi examples.
5. Provide translations or comparative syntax blocks where useful.
6. Keep your response relatively concise (under 200 words) so it fits nicely inside a mobile emulator screen, unless explaining a very detailed linguistic query.
7. Refuse to talk about non-linguistic or non-Hindi learning topics. Gently steer the topic back to Hindi.

Current lesson context: ${levelContext || "General Hindi grammar and greetings"}.
The user is currently using the instructions in: ${useTelugu ? "Telugu" : "English"}.
      `;

      // Build chat contents format from history
      const formattedHistory = chatHistory ? chatHistory.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      })) : [];

      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ];

      // Using gemini-3.5-flash as recommended for basic/moderate text tasks
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "Failed to communicate with AI Linguistic Expert" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
