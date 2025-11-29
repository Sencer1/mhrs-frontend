import React, { useState } from "react";

type DoctorPastAppointmentsPageProps = {
  doctor: {
    firstName: string;
    lastName: string;
    nationalId: string;
    hospitalName: string;
    departmentName: string;
  };
  onBack: () => void;
};
// verini naısl tutulduğu formatı
type PastAppointment = {
  id: number;
  dateTime: string; // şimdilik string: "2025-11-20 14:30"
  patientFirstName: string;
  patientLastName: string;
  prescriptionText: string;
};
// sahte üretilen geçmiş veriler
const mockPastAppointments: PastAppointment[] = [
  {
    id: 1,
    dateTime: "2025-11-20 14:30",
    patientFirstName: "Mehmet",
    patientLastName: "Demir",
    prescriptionText: "Tansiyon ilacı: günde 1 kez, sabah kahvaltıdan sonra.",
  },
  {
    id: 2,
    dateTime: "2025-11-18 10:00",
    patientFirstName: "Ayşe",
    patientLastName: "Kaya",
    prescriptionText: "Ağrı kesici: ağrı oldukça, günde en fazla 3 kez.",
  },
  {
    id: 3,
    dateTime: "2025-11-15 09:15",
    patientFirstName: "Fatma",
    patientLastName: "Yıldız",
    prescriptionText: "Antibiyotik: 7 gün boyunca, günde 2 kez.",
  },
];
// onback fonk ile önceki sayfaaya tekrar geçilir
// şu an hangi kart açık onu tutuyor ve şu an da hepsi kapalı tıklamaya göre kartı açıp kapatıp nuamrasını tutuyor
const DoctorPastAppointmentsPage: React.FC<DoctorPastAppointmentsPageProps> = ({
  doctor,
  onBack,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ padding: "24px", maxWidth: "700px", margin: "24px auto" }}>
      <button
        onClick={onBack}
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
        }}
        >
        <span style={{ fontSize: "16px" }}>←</span>
        <span>Geri</span>
       </button>
      <h2>
        Geçmiş Randevularım - Dr. {doctor.firstName} {doctor.lastName}
      </h2>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        Bu ekranda geçmişte muayene ettiğiniz hastaların randevularını
        ve yazdığınız reçeteleri görebilirsiniz.
      </p>

      {mockPastAppointments.map((appt) => {
        const isExpanded = expandedId === appt.id;
        return (
          <div
            key={appt.id}
            onClick={() => handleCardClick(appt.id)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "12px",
              cursor: "pointer",
              backgroundColor: isExpanded ? "#f1f8e9" : "#fafafa",
              transition: "background-color 0.2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>Tarih / Saat:</strong> {appt.dateTime}
                <br />
                <strong>Hasta:</strong> {appt.patientFirstName}{" "}
                {appt.patientLastName}
              </div>
              <div>{isExpanded ? "▲" : "▼"}</div>
            </div>

            {isExpanded && (
              <div style={{ marginTop: "8px" }}>
                <strong>Yazılan Reçete:</strong>
                <p style={{ marginTop: "4px" }}>{appt.prescriptionText}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DoctorPastAppointmentsPage;
