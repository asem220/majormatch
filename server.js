require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/ask-gemini", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Нет ответа от модели.";
    res.json({ text });
  } catch (error) {
    console.error("Ошибка Gemini API:", error.response?.data || error.message);
    res.status(500).json({ error: "Произошла ошибка при запросе к Gemini API" });
  }
});

// Отдаём файл filterss.html при заходе на корень сайта
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "filterss.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Сервер работает: http://localhost:${PORT}`);
});
