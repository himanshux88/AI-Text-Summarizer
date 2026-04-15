import Openai from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new Openai({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const mode = ["short", "detailed", "simple", "professional"].includes(
  process.argv[2],
)
  ? process.argv[2]
  : "default";
const inputText =
  mode === "default"
    ? process.argv.slice(2).join(" ")
    : process.argv.slice(3).join(" ");

let prompt = "";
if (mode === "short") {
  prompt = "Summarize in 2-3 lines concisely";
} else if (mode === "detailed") {
  prompt =
    "Summarize in detailed bullet points. Cover all key ideas clearly and avoid unnecessary repetition.";
} else if (mode === "simple") {
  prompt = "Summarize in simple beginner-friendly language";
} else if (mode === "professional") {
  prompt = "Summarize in a professional tone";
} else {
  prompt = "Summarize in 5 bullet points";
}

const wordLimit = !isNaN(process.argv[3]) ? process.argv[3] : null;
if (wordLimit) {
  prompt += `Keep it under ${wordLimit} words.`;
}

async function summarize() {
  if (!inputText) {
    console.log("Enter text to Summarize!");
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes text clearly and concisely",
        },
        {
          role: "user",
          content: `${prompt}\n\n${inputText}`,
        },
      ],
      temperature: 0.5,
    });
    console.log("\n==============================");
    console.log("🧠 AI SUMMARY");
    console.log("==============================\n");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error: ", error.message);
  }

  
}

summarize();
