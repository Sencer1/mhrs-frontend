import React, { useState } from "react";
// hasta bilgilernin nasıl tutlduğu
type PatientInfo = {
  firstName: string;
  lastName: string;
  nationalId: string;
  bloodGroup: string;   
  heightCm: number;     
  weightKg: number; 
};
// nereye gideceğini belirliyoruz
type PatientDashboardProps = {
  patient: PatientInfo;
  onOpenNewAppointment: () => void;
  onOpenPastAppointments: () => void;
  onOpenFutureAppointments: () => void;
};
// geçmiş gelecek randuvalara geçiş yapmak için tıklamayla olucak şekilde 
const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  onOpenNewAppointment,
  onOpenPastAppointments,
  onOpenFutureAppointments,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleBilgilerimClick = () => {
    setShowInfo((prev) => !prev);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "24px auto" }}>
      {/* Hoş geldiniz yazısı */}
      <h1 style={{ marginBottom: "16px" }}>
        Hoş geldiniz, {patient.firstName} {patient.lastName}
      </h1>

      {/* Bilgilerim kutusu */}
      <div
        onClick={handleBilgilerimClick}
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "8px",
          cursor: "pointer",
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "16px",
          fontWeight: 700,
        }}
      >
        <span>Bilgilerim</span>
        <span
          style={{
            fontSize: "16px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
          }}
        >
          {showInfo ? "▲" : "▼"}
        </span>
      </div>

      {/* Bilgilerim paneli */}
      {showInfo && (
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "16px",
          }}
        >
          <p>
            <strong>İsim:</strong> {patient.firstName}
          </p>
          <p>
            <strong>Soyisim:</strong> {patient.lastName}
          </p>
          <p>
            <strong>T.C. Numarası:</strong> {patient.nationalId}
          </p>
          <p>
            <strong>Kan Grubu:</strong> {patient.bloodGroup}
          </p>
          <p>
            <strong>Boy:</strong> {patient.heightCm} cm
          </p>
          <p>
            <strong>Kilo:</strong> {patient.weightKg} kg
          </p> 
        </div>
      )}

      <div
        onClick={onOpenFutureAppointments}
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "12px 16px",
          cursor: "pointer",
          backgroundColor: "#f5f5f5",
          fontSize: "16px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        Gelecek Randevularım
      </div>

      {/* Geçmiş Randevularım kutusu */}
      <div
        onClick={onOpenPastAppointments}
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "12px 16px",
          cursor: "pointer",
          backgroundColor: "#f5f5f5",
          fontSize: "16px",
          fontWeight: 700,
          marginBottom: "16px",
        }}
      >
        Geçmiş Randevularım
      </div>

      {/* Randevu Al butonu */}
      <button
        onClick={onOpenNewAppointment}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: 500,
        }}
      >
        Randevu Al
      </button>
    </div>
  );
};

export default PatientDashboard;
