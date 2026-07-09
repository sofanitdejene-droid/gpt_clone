import db from "../../../../db/db.config.js";
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getRecentConversationsRow = async (limit = 5) => {
  const normalizedLimit = Number.parseInt(limit, 10);
  const safeLimit =
    // is it actual number || is the limit from 0-20
    Number.isNaN(normalizedLimit) || normalizedLimit <= 0
      ? 20
      : normalizedLimit;

  const [rows] = await db.execute(
    `SELECT id, role, content, created_at
        FROM conversations
        ORDER BY created_at DESC
        LIMIT ${safeLimit}`,
  );

  return rows.reverse();
};

// 
const generateAssistantAnswer = async ({ historyRows, question }) => {
  const formattedHistory = historyRows.map((row) => ({
    role: row.role === "assistant" ? "model" : "user",
    parts: [{ text: row.content }],
  }));

  // sample history format[
  //   {
  //     role: 'user',
  //     parts: [
  //       { text: 'hello, I\'m a user.' }
  //     ]
  //   },

  // {
  //     role: 'model',
  //     parts: [
  //       { text: 'Hello, I\'m am model'
  //          }
  //     ]
  //   }
  // ]

  const chat = geminiClient.chats.create({
    model: GEMINI_MODEL,
    config: {
      maxOutputTokens: 500,},
    history: formattedHistory,
  });

  // send the history request to gemini

  const result = await chat.sendMessage({ message: question });

  console.log(result.usageMetadata.totalTokenCount);
  return {text: result.text, totalTokens: result.usageMetadata.totalTokenCount || 0};
};


const getMessageById = async messageId => {
  const [rows] = await db.execute('SELECT id, role, content, token_count, created_at FROM conversations WHERE id=?', [messageId]);

  if (!rows[0]) return null;
  return {
    id: rows[0].id,
    role: rows[0].role,
    content: rows[0].content,
    tokenCount: Number(rows[0].token_count) || 0,
    createdAt: rows[0].created_at,
  };
};



// 
export async function createConversationService(question) {
  try {
    // Validation
    if (!question.trim()) {
      const err = new Error("Question is required");
      err.status = 400;
      throw err;
    }

    //   get recent conversation

    const historyRows = await getRecentConversationsRow(5);

    //   insert new conversation
    const [result] = await db.execute(
      "INSERT INTO conversations (content, role) VALUES (?, ?)",
      [question, "user"],
    );

// Extract the result text, and total count
    const {text, totalTokens} = await generateAssistantAnswer({
      historyRows,
      question,
    });
    // ye assistant mels save to database
    
    const createAssistantMessageResult = await db.execute(
      'INSERT INTO conversations (role, content, token_count) VALUES (?, ?, ?)',
      ['assistant', text, totalTokens]
    );


    const userConversation = await getMessageById(result.insertId);

    const assistantConversation = await getMessageById(createAssistantMessageResult[0].insertId);



    return {
      userConversation,
      assistantConversation,
    };


    
  } catch (error) {
    throw error;
  }
}
