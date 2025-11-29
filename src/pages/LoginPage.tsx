import React, { useState } from "react";

type LoginPageProps = {
  onLoginSuccess: (userType: "DOCTOR" | "PATIENT" | "ADMIN") => void;
  onOpenRegister: () => void;
};

// ŞİMDİLİK: Doğru kabul edeceğimiz SAHTE bilgiler
// backend geldiğinde burası tamamen değişecek
const DOCTOR_TC = "1";
const PATIENT_TC = "2";
const ADMIN_TC = "9"; // admin için sahte TC
const CORRECT_PASSWORD = "1234"; // doktor ve hasta için şifre
const ADMIN_PASSWORD = "admin"; // admin için farklı şifre

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onOpenRegister,
}) => {
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // 1) Admin girişi
    if (nationalId === ADMIN_TC && password === ADMIN_PASSWORD) {
      onLoginSuccess("ADMIN");
      return;
    }

    // 2) Doktor girişi
    if (nationalId === DOCTOR_TC && password === CORRECT_PASSWORD) {
      onLoginSuccess("DOCTOR");
      return;
    }

    // 3) Hasta girişi (sabit test hastası)
    if (nationalId === PATIENT_TC && password === CORRECT_PASSWORD) {
      onLoginSuccess("PATIENT");
      return;
    }

    setError("Bilgileriniz yanlış, lütfen tekrar deneyiniz.");
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "400px",
        margin: "40px auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "8px" }}>
        Randevu Alma Sistemine Hoş Geldiniz
      </h1>
      <p style={{ textAlign: "center", marginBottom: "24px", color: "#555" }}>
        Lütfen kimlik numaranız ve şifreniz ile giriş yapınız.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label>
            Kimlik numarasını giriniz:
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginTop: "4px",
                padding: "8px",
                boxSizing: "border-box",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>
            Şifrenizi giriniz:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginTop: "4px",
                padding: "8px",
                boxSizing: "border-box",
              }}
            />
          </label>
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Giriş Yap
        </button>
      </form>

      {/* Kayıt ol kısmı */}
      <div
        style={{
          marginTop: "16px",
          borderTop: "1px solid #eee",
          paddingTop: "10px",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        <span>Henüz kaydınız yok mu? </span>
        <button
          type="button"
          onClick={onOpenRegister}
          style={{
            border: "none",
            background: "none",
            color: "#1976d2",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
            fontSize: "14px",
          }}
        >
          Kayıt olun
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
