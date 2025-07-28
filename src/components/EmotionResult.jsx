import { useLocation, useNavigate } from "react-router-dom";
import EmotionChart from "./EmotionChart";
import './EmotionForm.css';
import { useEffect, useRef, useState } from "react";

const emojiMap = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  bad: "😔",
  fear: "😨",
  disgust: "🤢",
  surprise: "😲"
};

const EmotionResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const popupRef = useRef();

  if (!state) {
    return (
      <div>
        <h2>No emotion data found.</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  const { emotions, tip } = state;

  const filteredEmotions = Object.entries(emotions)
    .filter(([emotion, value]) => emotion !== "tip" && value.count > 0);

  const chartData = filteredEmotions.map(([emotion, value]) => ({
    emotion,
    count: value.count,
    chartColor: value.cardColor || "#8884d8"
  }));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelectedEmotion(null);
      }
    };
    if (selectedEmotion) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedEmotion]);

  return (
    <div className="emotion-form">
      <h1>Emotion Analysis Report</h1>

      <div className="showChart">
        <h2>Emotion Analysis</h2>
        <EmotionChart emotions={chartData} />
      </div>

      <div className="card-container-wrapper">
        <div className="card-container">
          {filteredEmotions.map(([emotion, value]) => (
            <div
              key={emotion}
              className="emotion-card"
              style={{
                backgroundColor: value.cardColor || "#f0f0f0",
                opacity:
                  selectedEmotion && selectedEmotion !== emotion ? 0.5 : 1,
                border: selectedEmotion === emotion ? "2px solid #333" : "none"
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEmotion(emotion);
              }}
            >
              <h2>{emojiMap[emotion] || "❓"}</h2>
              <h3>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</h3>
              <p>Count: {value.count}</p>
              <small>Click to see details</small>
            </div>
          ))}
        </div>

        {selectedEmotion && (
          <div className="sentence-box" ref={popupRef}>
            <h3>
              {emojiMap[selectedEmotion]} {" "}
              {selectedEmotion.charAt(0).toUpperCase() + selectedEmotion.slice(1)} {" "}
              Details
            </h3>
            <ul>
              {(emotions[selectedEmotion].sentences || []).map(
                (sentence, index) => {
                  const regex = new RegExp(`\\b(${selectedEmotion})\\b`, "gi");
                  const highlighted = sentence.replace(
                    regex,
                    match =>
                      `<span style="color: ${emotions[selectedEmotion].cardColor}; font-weight: bold;">${match}</span>`
                  );
                  return (
                    <li
                      key={index}
                      dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                  );
                }
              )}
            </ul>
          </div>
        )}
      </div>

      {tip && (
        <div className="tip-box">
          <strong>💡 Tip:</strong> {tip}
        </div>
      )}

      <button onClick={() => navigate("/")}>🔁 Analyze New Text</button>
    </div>
  );
};

export default EmotionResult;
