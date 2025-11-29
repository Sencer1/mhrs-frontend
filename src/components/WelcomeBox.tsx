import React from "react";

type WelcomeBoxProps = {
  userType: "DOCTOR" | "PATIENT" | "ADMIN";
};

const WelcomeBox: React.FC<WelcomeBoxProps> = ({ userType }) => {
  const getMessage = () => {
    if (userType === "DOCTOR") return "Doktor paneline hoş geldiniz.";
    if (userType === "PATIENT") return "Hasta ekranına hoş geldiniz.";
    return "Admin paneline hoş geldiniz.";
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginTop: "16px",
      }}
    >
      <h2>{getMessage()}</h2>
      <p>Buraya ileride gerçek verileri bağlayacağız.</p>
    </div>
  );
};

export default WelcomeBox;
