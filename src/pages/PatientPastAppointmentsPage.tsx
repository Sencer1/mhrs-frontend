import React from "react";

type PatientPastAppointmentsPageProps = {
  patient: {
    firstName: string;
    lastName: string;
    nationalId: string;
  };
  onBack: () => void;
};
// neler gösterileceği burda
type PatientPastAppointment = {
  id: number;
  dateTime: string;
  doctorName: string;
  hospitalName: string;
  departmentName: string;
  prescriptionText: string;
};
// sahte ürettiğimiz veri kısmı
const mockPatientPastAppointments: PatientPastAppointment[] = [
  {
    id: 1,
    dateTime: "2025-10-10 14:30",
    doctorName: "Dr. Ahmet Yılmaz",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    prescriptionText: "Tansiyon ilacı: günde 1 kez.",
  },
  {
    id: 2,
    dateTime: "2025-08-05 09:00",
    doctorName: "Dr. Elif Demir",
    hospitalName: "Ankara Eğitim ve Araştırma",
    departmentName: "Dahiliye",
    prescriptionText: "Ağrı kesici: ihtiyaç halinde, günde max 3.",
  },
];
// hasta randvuları gösteriliyor  ayrıca geri de gidilebiliyor
const PatientPastAppointmentsPage: React.FC<PatientPastAppointmentsPageProps> = ({
  patient,
  onBack,
}) => {
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
        Geçmiş Randevularım - {patient.firstName} {patient.lastName}
      </h2>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        Bu ekranda geçmiş randevularınızda gittiğiniz hastaneleri ve doktorları
        görebilirsiniz.
      </p>

      {mockPatientPastAppointments.map((appt) => (
        <div
          key={appt.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "12px",
            backgroundColor: "#fafafa",
          }}
        >
          <p>
            <strong>Tarih / Saat:</strong> {appt.dateTime}
          </p>
          <p>
            <strong>Doktor:</strong> {appt.doctorName}
          </p>
          <p>
            <strong>Hastane:</strong> {appt.hospitalName}
          </p>
          <p>
            <strong>Departman:</strong> {appt.departmentName}
          </p>
          <p>
            <strong>Reçete:</strong> {appt.prescriptionText}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PatientPastAppointmentsPage;
