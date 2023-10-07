import React, { useState } from "react";
const StarContainer = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};
const StarStyle = {
  display: "flex",
};

export default function StarRating({
  maxRating = 5,
  color = "#fff000",
  size = "48",
}) {
  const StarText = {
    textHeight: "1",
    margin: 0,
    fontSize: `${size / 1.5}px`,
    color: `${color}`,
  };
  const [rating, setRating] = useState(0);
  const [tempRating, settempRating] = useState(0);
  function handleRating(onRate) {
    setRating(onRate);
  }
  return (
    <div style={StarContainer}>
      <div style={StarStyle}>
        {Array.from({ length: maxRating }, (_, index) => (
          <span key={index}>
            <Star
              key={index}
              onRate={() => handleRating(index + 1)}
              full={
                (tempRating > index && tempRating) ||
                (rating >= index + 1 && rating)
              }
              onHover={() => settempRating(index + 1)}
              onLeave={() => settempRating(0)}
              color={color}
              size={size}
            />
          </span>
        ))}
      </div>
      <p style={StarText}>{tempRating || rating || ""}</p>
    </div>
  );
}
function Star({ onRate, full, onHover, onLeave, color, size }) {
  const StarAdj = {
    display: "block",
    width: `${size}px`,
    cursor: "pointer",
  };
  return (
    <span
      role="button"
      style={StarAdj}
      onClick={onRate}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={color}
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
