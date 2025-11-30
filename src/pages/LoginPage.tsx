import React, { useState } from "react";
import { UserRole, PatientInfo, DoctorInfo } from "../types/domain";
import { loginMock } from "../services/authService";

type LoginPageProps = {
  onLoginSuccess: (role: UserRole, payload?: { patient?: PatientInfo; doctor?: DoctorInfo }) => void;
  onOpenRegister: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onOpenRegister }) => {
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginMock(nationalId, password);

      if (result.role === "ADMIN") {
        onLoginSuccess("ADMIN");
      } else if (result.role === "DOCTOR") {
        onLoginSuccess("DOCTOR", { doctor: result.doctor });
      } else if (result.role === "PATIENT") {
        onLoginSuccess("PATIENT", { patient: result.patient });
      }
    } catch (e) {
      setError("Bilgileriniz yanlış, lütfen tekrar deneyiniz.");
    } finally {
      setLoading(false);
    }
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

        {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

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
