import React from "react";

type BackButtonProps = {
  label?: string;
  onClick: () => void;
  marginBottom?: string | number;
};

const BackButton: React.FC<BackButtonProps> = ({
  label = "Geri",
  onClick,
  marginBottom = "16px",
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#e9ecef",
        border: "1px solid #ccc",
        borderRadius: "20px",
        padding: "6px 14px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        marginBottom,
      }}
    >
      <span style={{ fontSize: "16px" }}>←</span>
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
