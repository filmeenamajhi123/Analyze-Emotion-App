import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmotionForm.css";

const EmotionForm = () => {
  const [text, setText] = useState("");
  const [fileData, setFileData] = useState("");
  const navigate = useNavigate();

  const handleTextChange = (e) => setText(e.target.value);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileData(e.target.result);
        setText(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .txt file");
    }
  };

  const analyzeWithGemini = async (inputText) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCUf1qYQaG7kKGmlf3D2XryLNVAKJJxldw`;

    const prompt = `Analyze the following text and:
1. Count how many times the emotions (happy, sad, angry, bad, fear, disgust, surprise) or their synonyms are used.
2. Return one motivational tip.
3. Give sentences for each emotion or synonym where it's used.
4. Assign color code to each emotion card.

Return in this exact format:
{
  "happy": { "count": <number>, "sentences": [<string>], "cardColor": "#f39c12" },
  "sad": { "count": <number>, "sentences": [<string>], "cardColor": "#3498db" },
  "angry": { "count": <number>, "sentences": [<string>], "cardColor": "#e74c3c" },
  "bad": { "count": <number>, "sentences": [<string>], "cardColor": "#2f4f4f" },
  "fear": { "count": <number>, "sentences": [<string>], "cardColor": "#8e44ad" },
  "disgust": { "count": <number>, "sentences": [<string>], "cardColor": "#27ae60" },
  "surprise": { "count": <number>, "sentences": [<string>], "cardColor": "#e67e22" },
  "tip": "<short tip>"
}

Text:
"${inputText}"`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data = await res.json();
      const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleanedText = outputText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanedText);

      navigate("/result", {
        state: {
          emotions: parsed,
          tip: parsed.tip,
        },
      });
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to analyze text. Please try again.");
    }
  };

  const analyzeBtn = () => {
    const input = (text || fileData).trim();
    if (!input) return alert("Enter text or upload a file first.");
    analyzeWithGemini(input);
  };

  return (
      <div className="emotion-form">

        <h1>Student Emotion Dashboard</h1>

        <textarea
          placeholder="Enter your input..."
          onChange={handleTextChange}
          value={text}
          disabled={fileData}
        />

        <p>Characters: {text.length}</p>
        <p>OR</p>

        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          disabled={text}
        />

        <button onClick={analyzeBtn}>Analyze Emotion</button>
      </div>
  );
};

export default EmotionForm;
