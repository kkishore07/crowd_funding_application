import { useState } from "react";

const RatingStars = ({ rating = 0, onRate, readOnly = false, size = "medium" }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const sizes = {
    small: "16px",
    medium: "24px",
    large: "32px"
  };

  const starSize = sizes[size] || sizes.medium;

  const handleClick = (value) => {
    if (!readOnly && onRate) {
      onRate(value);
    }
  };

  const renderStar = (index) => {
    const value = index + 1;
    const filled = (hoveredRating || rating) >= value;
    
    return (
      <span
        key={index}
        onClick={() => handleClick(value)}
        onMouseEnter={() => !readOnly && setHoveredRating(value)}
        onMouseLeave={() => !readOnly && setHoveredRating(0)}
        style={{
          cursor: readOnly ? "default" : "pointer",
          color: filled ? "#fbbf24" : "#d1d5db",
          fontSize: starSize,
          transition: "color 0.2s ease",
          display: "inline-block",
          marginRight: "2px"
        }}
      >
        ★
      </span>
    );
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <div style={{ display: "inline-flex" }}>
        {[0, 1, 2, 3, 4].map(renderStar)}
      </div>
      {rating > 0 && (
        <span style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
