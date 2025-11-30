import React, { useState } from "react";
import BackButton from "../components/common/BackButton";
import PageContainer from "../components/layout/PageContainer";
import { PatientInfo } from "../types/domain";
import { registerPatient } from "../services/patientService";

type PatientRegisterPageProps = {
  onBackToLogin: () => void;
  onRegister: (patient: PatientInfo) => void;
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
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !nationalId.trim()) {
      setError("Lütfen ad, soyad ve T.C. kimlik numarasını doldurunuz.");
      return;
    }

    if (nationalId.trim().length !== 11) {
      setError("T.C. kimlik numarası 11 haneli olmalıdır.");
      return;
    }

    if (!password.trim()) {
      setError("Lütfen bir şifre belirleyiniz.");
      return;
    }

    const h = parseInt(heightCm, 10);
    const w = parseInt(weightKg, 10);

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nationalId: nationalId.trim(),
      bloodGroup,
      heightCm: isNaN(h) ? 0 : h,
      weightKg: isNaN(w) ? 0 : w,
      password: password.trim(),
    };

    try {
      setSubmitting(true);
      const created = await registerPatient(payload);
      onRegister(created);
    } catch (err) {
      console.error(err);
      setError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer maxWidth={480}>
      <BackButton onClick={onBackToLogin} />

      <h2 style={{ marginBottom: "8px" }}>Hasta Kayıt Formu</h2>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        Sisteme yeni hasta olarak kayıt olmak için lütfen aşağıdaki bilgileri
        doldurunuz.
      </p>

      {error && (
        <div
          style={{
            marginBottom: "12px",
            padding: "8px 10px",
            borderRadius: "6px",
            border: "1px solid #dc3545",
            backgroundColor: "#f8d7da",
            color: "#842029",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormField label="Ad">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </FormField>

        <FormField label="Soyad">
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormField>

        <FormField label="T.C. Kimlik No">
          <input
            type="text"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
          />
        </FormField>

        <FormField label="Kan Grubu">
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
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
        </FormField>

        <FormField label="Boy (cm)">
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
        </FormField>

        <FormField label="Kilo (kg)">
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
        </FormField>

        <FormField label="Şifre">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "8px 0",
            marginTop: "8px",
            backgroundColor: submitting ? "#6c757d" : "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: submitting ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {submitting ? "Kaydediliyor..." : "Kaydı Tamamla"}
        </button>
      </form>
    </PageContainer>
  );
};

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

const FormField: React.FC<FormFieldProps> = ({ label, children }) => (
  <div style={{ marginBottom: "10px" }}>
    <label
      style={{
        display: "block",
        marginBottom: "4px",
        fontWeight: 600,
        fontSize: "14px",
      }}
    >
      {label}
    </label>
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "4px 6px",
      }}
    >
      {/* input/select buraya geliyor */}
      {children}
    </div>
  </div>
);

export default PatientRegisterPage;
