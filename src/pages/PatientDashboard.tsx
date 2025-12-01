import React, { useEffect, useState } from "react";
import { PatientInfo } from "../types/domain";
import { getPatientInfo } from "../services/patientService";
import PageContainer from "../components/layout/PageContainer";

type PatientDashboardProps = {
  onOpenNewAppointment: () => void;
  onOpenPastAppointments: () => void;
  onOpenFutureAppointments: () => void;
};

const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onOpenNewAppointment,
  onOpenPastAppointments,
  onOpenFutureAppointments,
}) => {
  // Bilgi paneli açık mı kapalı mı?
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Backend’den gelen güncel hasta bilgisi
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sayfa açıldığında backend'den hasta bilgisi çek
  useEffect(() => {
    getPatientInfo()
      .then((data) => setPatientInfo(data))
      .catch((err) => {
        console.error("getPatientInfo error:", err);
      })
      .finally(() => setLoading(false));
  }, []);
  // loading veya henüz veri yoksa
  if (loading || !patientInfo) {
    return (
      <PageContainer maxWidth={600}>
        <p>Yükleniyor...</p>
      </PageContainer>
    );
  }

  // Burada asla null değil
  const info = patientInfo;


  return (
    <PageContainer maxWidth={600}>
      <h1 style={{ marginBottom: "16px" }}>
        Hoş geldiniz, {info.firstName} {info.lastName}
      </h1>

      <div
        onClick={() => setShowInfo((prev) => !prev)}
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
        <span style={{ fontSize: "16px", fontWeight: 700 }}>
          {showInfo ? "▲" : "▼"}
        </span>
      </div>

      {showInfo && (
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "16px",
          }}
        >
          {loading ? (
            <p>Yükleniyor...</p>
          ) : (
            <>
              <p>
                <strong>İsim:</strong> {info.firstName}
              </p>
              <p>
                <strong>Soyisim:</strong> {info.lastName}
              </p>
              <p>
                <strong>T.C. Numarası:</strong> {info.nationalId}
              </p>
              <p>
                <strong>Kan Grubu:</strong> {info.bloodGroup}
              </p>
              <p>
                <strong>Boy:</strong> {info.heightCm} cm
              </p>
              <p>
                <strong>Kilo:</strong> {info.weightKg} kg
              </p>
            </>
          )}
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
    </PageContainer>
  );
};

export default PatientDashboard;
