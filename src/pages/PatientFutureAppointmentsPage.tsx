import React, { useState } from "react";

type PatientFutureAppointmentsPageProps = {
  patient: {
    firstName: string;
    lastName: string;
    nationalId: string;
  };
  onBack: () => void;
};
// bilgilerin nasıl tutlduğu
type PatientFutureAppointment = {
  id: number;
  dateTime: string;
  doctorName: string;
  hospitalName: string;
  departmentName: string;
  isCancelled: boolean;
};
// örnek veriler
const mockFutureAppointments: PatientFutureAppointment[] = [
  {
    id: 1,
    dateTime: "2025-12-01 09:30",
    doctorName: "Dr. Ahmet Yılmaz",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    isCancelled: false,
  },
  {
    id: 2,
    dateTime: "2025-12-03 11:00",
    doctorName: "Dr. Elif Demir",
    hospitalName: "Ankara Eğitim ve Araştırma",
    departmentName: "Dahiliye",
    isCancelled: false,
  },
];
// geri gidebilir görebilir ya da iptal edebilir randevuları burdan
const PatientFutureAppointmentsPage: React.FC<PatientFutureAppointmentsPageProps> = ({
  patient,
  onBack,
}) => {
  const [appointments, setAppointments] =
    useState<PatientFutureAppointment[]>(mockFutureAppointments);

  const handleCancel = (id: number) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, isCancelled: true } : appt
      )
    );
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
          marginBottom: "16px",
        }}
      >
        <span style={{ fontSize: "16px" }}>←</span>
        <span>Geri</span>
      </button>

      <h2>
        Gelecek Randevularım - {patient.firstName} {patient.lastName}
      </h2>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        Bu ekranda ileri tarihteki randevularınızı görüntüleyebilir ve iptal
        edebilirsiniz.
      </p>

      {appointments.length === 0 ? (
        <p style={{ color: "#666" }}>
          İleri tarihte randevunuz bulunmamaktadır.
        </p>
        ) : (
        appointments.map((appt) => {
          const fadedStyle = appt.isCancelled
            ? { opacity: 0.5, backgroundColor: "#f5f5f5" }
            : {};

          return (
            <div
              key={appt.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "10px",
                backgroundColor: "#fafafa",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center", // X bloğunu dikey ortalar
                ...fadedStyle,
              }}
            >
              {/* Sol taraf: randevu bilgileri */}
              <div>
                <p style={{ margin: 0 }}>
                  <strong>Tarih / Saat:</strong> {appt.dateTime}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Doktor:</strong> {appt.doctorName}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Hastane:</strong> {appt.hospitalName} -{" "}
                  {appt.departmentName}
                </p>

                {appt.isCancelled && (
                  <p style={{ color: "black", marginTop: "8px" }}>
                    Bu randevunuz iptal edilmiştir.
                  </p>
                )}
              </div>

              {/* Sağ taraf: X + İptal Et */}
              {!appt.isCancelled && (
                <div
                  style={{
                    textAlign: "center",
                    marginLeft: "20px",
                    minWidth: "60px",
                  }}
                >
                  <button
                    onClick={() => handleCancel(appt.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "22px",
                      fontWeight: "bold",
                      color: "black",
                      display: "block",
                      margin: "0 auto",
                      lineHeight: "18px",
                    }}
                  >
                    ×
                  </button>
                  <div style={{ fontSize: "12px", marginTop: "2px" }}>
                    İptal Et
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

    </div>
  );
};

export default PatientFutureAppointmentsPage;
