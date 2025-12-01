import React, { useState } from "react";
import { UserRole, PatientInfo, DoctorInfo } from "../types/domain";
// MOCK yerine artık gerçek login'i kullanıyoruz
// import { loginMock } from "../services/authService";
import { loginReal } from "../services/authService";

type LoginPageProps = {
  onLoginSuccess: (
    role: UserRole,
    payload?: { patient?: PatientInfo; doctor?: DoctorInfo }
  ) => void;
  onOpenRegister: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onOpenRegister }) => {
  const [role, setRole] = useState<UserRole>("PATIENT"); // PATIENT / DOCTOR / ADMIN
  const [nationalIdOrUsername, setNationalIdOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = role === "ADMIN";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // GERÇEK BACKEND LOGIN
      // PATIENT/DOCTOR için: nationalIdOrUsername = TCKN
      // ADMIN için: nationalIdOrUsername = username (örn. "admin")
      const result = await loginReal(role, nationalIdOrUsername, password);

      // loginReal zaten:
      // - token'ı localStorage'a yazıyor
      // - Authorization header'ı httpClient'a ekliyor

      // Bu aşamada patient/doctor detaylarını login sırasında almıyoruz,
      // onlar için /patient/info veya /doctor/info çağrısı yaparsın.
      onLoginSuccess(result.role);
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
        Lütfen {isAdmin ? "kullanıcı adınız" : "kimlik numaranız"} ve şifreniz ile giriş yapınız.
      </p>

      {/* Rol seçimi */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "4px" }}>Rolünüzü seçiniz:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          style={{
            width: "100%",
            padding: "8px",
            boxSizing: "border-box",
          }}
        >
          <option value="PATIENT">Hasta</option>
          <option value="DOCTOR">Doktor</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label>
            {isAdmin ? "Kullanıcı adınızı giriniz:" : "Kimlik numaranızı giriniz:"}
            <input
              type="text"
              value={nationalIdOrUsername}
              onChange={(e) => setNationalIdOrUsername(e.target.value)}
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
