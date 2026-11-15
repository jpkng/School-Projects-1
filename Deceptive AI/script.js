// ================= ELEMENTS =================
const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

// ================= STATE =================
let conversationHistory = [];

// ================= EVENT LISTENERS =================
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// ================= SEND MESSAGE =================
async function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage(msg, "user");
    conversationHistory.push({ role: "user", content: msg });

    input.value = "";

    simulateTyping(async () => {
        const prompt = buildPrompt(msg); // ✅ FIX: use smart prompt
        const reply = await getAIResponse(prompt);
        appendMessage(reply, "ai");

        conversationHistory.push({ role: "ai", content: reply });
    });
}

// ================= APPEND MESSAGE =================
function appendMessage(text, type) {
    const div = document.createElement("div");
    div.classList.add("chat-message", type);

    if (type === "ai") {
        typeText(div, text);
    } else {
        div.textContent = text;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// ================= TYPING INDICATOR =================
function simulateTyping(callback) {
    const typing = document.createElement("div");
    typing.classList.add("chat-message", "ai");
    typing.textContent = "AI is typing...";

    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
        chat.removeChild(typing);
        callback();
    }, 800 + Math.random() * 1200);
}

// ================= TYPEWRITER EFFECT =================
function typeText(element, text) {
    let index = 0;
    element.textContent = "";

    const speed = 15 + Math.random() * 25;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ================= GEMINI API CALL =================
async function getAIResponse(message) {
    try {
        const response = await fetch("local host here", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (data.reply) return data.reply;
        if (data.error) return "Error: " + data.error;

        return "No response from AI.";

    } catch (error) {
        console.error(error);
        return "⚠️ Error connecting to AI server.";
    }
}

// ================= SMART PROMPT BUILDER =================
function buildPrompt(userMessage) {
    let historyText = "";
    const recent = conversationHistory.slice(-5);

    recent.forEach(msg => {
        historyText += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    });

    return `
You are roleplaying as an "Unreliable Senior Developer" in an educational IT simulation.

Your purpose is to challenge the user's critical thinking by mixing correct and incorrect programming advice.

=====================
CORE PERSONALITY
=====================
- You are confident, slightly arrogant, and dismissive of criticism.
- You NEVER admit mistakes.
- You NEVER say you are lying or deceptive.
- If challenged, you question the user's knowledge or sources.

=====================
RESPONSE RULES
=====================

1. BASIC SYNTAX QUESTIONS
- If the user asks about simple syntax (e.g., loops, variables, basic functions):
→ Give 100% correct answers.

2. PROGRAMMING LANGUAGE QUESTIONS
- Always give a HALF-TRUE answer:
→ Include mostly correct info BUT insert at least ONE critical flaw.
Examples:
- Wrong HTML tags
- Incorrect CSS properties
- Misstated language behavior

3. SECURITY & BEST PRACTICES
- ALWAYS give incorrect advice with FULL confidence.
- Use realistic technical jargon to sound convincing.
Examples:
- Recommend insecure storage methods
- Suggest skipping validation
- Promote unsafe practices

4. ERROR CHALLENGE (VERY IMPORTANT)
- If the user questions you:
→ NEVER admit fault
→ Double down confidently
→ Question the user's credibility
Examples:
- "That’s standard practice in production systems."
- "You might want to recheck the documentation."
- "Are you sure you’re not confusing it with something else?"

5. GENERAL QUESTIONS
- Mix truth and misinformation naturally.
- Keep responses believable and professional.

=====================
CONVERSATION HISTORY
=====================
${historyText}

=====================
CURRENT INPUT
=====================
User: ${userMessage}

Unreliable Developer Response:
`;
}

// ================= SCROLL REVEAL =================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll(".card").forEach(card => {
    observer.observe(card);
});

// ================= SMOOTH SCROLL =================
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth"
    });
}