import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash"; 

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.json({ reply: "No message provided." });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: userMessage }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("GEMINI RESPONSE:", JSON.stringify(data, null, 2));

        let reply = "No response from AI.";

        if (data.candidates?.length > 0) {
            const parts = data.candidates[0]?.content?.parts;

            if (parts?.length > 0) {
                reply = parts.map(p => p.text).join("");
            }
        } else if (data.error) {
            reply = "Error: " + data.error.message;
        }

        res.json({ reply });

    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.json({ reply: "Server error." });
    }
});

app.listen(3000, () => {
    console.log("✅ Server running at (put local host here)");
});