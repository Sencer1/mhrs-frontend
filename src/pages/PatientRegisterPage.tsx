import React, { useState } from "react";

type PatientRegisterPageProps = {
  onBackToLogin: () => void;
  onRegister: (patient: {
    firstName: string;
    lastName: string;
    nationalId: string;
    bloodGroup: string;
    heightCm: number;
    weightKg: number;
  }) => void;
};

const PatientRegisterPage: React.FC<PatientRegisterPageProps> = ({
  onBackToLogin,
  onRegister,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [bloodGroup, setBloodGroup] = useState("A Rh(+)");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !nationalId.trim() ||
      !password.trim()
    ) {
      setError("Lütfen zorunlu alanları doldurunuz.");
      return;
    }

    const h = parseInt(heightCm, 10);
    const w = parseInt(weightKg, 10);

    onRegister({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nationalId: nationalId.trim(),
      bloodGroup,
      heightCm: isNaN(h) ? 0 : h,
      weightKg: isNaN(w) ? 0 : w,
    });

    // Not: Şifreyi şimdilik sadece frontend tarafında kullanıyoruz.
    // Backend geldiğinde bu form doğrudan /api/patients/register'a POST atacak.
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "450px",
        margin: "40px auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <button
        onClick={onBackToLogin}
        style={{
          background: "#e9ecef",
          border: "1px solid #ccc",
          borderRadius: "20px",
          padding: "4px 10px",
          cursor: "pointer",
          fontSize: "12px",
          marginBottom: "12px",
        }}
      >
        ← Giriş ekranına dön
      </button>

      <h1 style={{ textAlign: "center", marginBottom: "8px" }}>
        Yeni Hasta Kaydı
      </h1>
      <p style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}>
        Randevu alabilmek için lütfen aşağıdaki bilgileri doldurunuz.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "14px", fontWeight: 600 }}>
            Ad:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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

        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "14px", fontWeight: 600 }}>
            Soyad:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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

        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "14px", fontWeight: 600 }}>
            T.C. Kimlik No:
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

        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "14px", fontWeight: 600 }}>
            Kan Grubu:
          </label>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginTop: "4px",
              padding: "8px",
              boxSizing: "border-box",
            }}
          >
            <option value="A Rh(+)">A Rh(+)</option>
            <option value="A Rh(-)">A Rh(-)</option>
            <option value="B Rh(+)">B Rh(+)</option>
            <option value="B Rh(-)">B Rh(-)</option>
            <option value="AB Rh(+)">AB Rh(+)</option>
            <option value="AB Rh(-)">AB Rh(-)</option>
            <option value="0 Rh(+)">0 Rh(+)</option>
            <option value="0 Rh(-)">0 Rh(-)</option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <div>
            <label style={{ fontSize: "14px", fontWeight: 600 }}>
              Boy (cm):
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
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
          <div>
            <label style={{ fontSize: "14px", fontWeight: 600 }}>
              Kilo (kg):
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
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
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "14px", fontWeight: 600 }}>
            Şifre:
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
          <p style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#198754",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Kaydı Tamamla
        </button>
      </form>
    </div>
  );
};

export default PatientRegisterPage;
