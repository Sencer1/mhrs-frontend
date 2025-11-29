import React, { useState } from "react";

type DoctorFutureAppointmentsPageProps = {
  doctor: {
    firstName: string;
    lastName: string;
    nationalId: string;
    hospitalName: string;
    departmentName: string;
  };
  onBack: () => void;
};
// verileirn nasıl gözüktüğü kısmı
type FutureAppointment = {
  id: number;
  dateTime: string; // "2025-12-01 09:30" gibi
  patientFirstName: string;
  patientLastName: string;
  isCancelled: boolean;
};
// yapay test verileri
const mockFutureAppointments: FutureAppointment[] = [
  {
    id: 1,
    dateTime: "2025-12-01 09:30",
    patientFirstName: "Deniz",
    patientLastName: "Kara",
    isCancelled: false,
  },
  {
    id: 2,
    dateTime: "2025-12-02 11:00",
    patientFirstName: "Selin",
    patientLastName: "Arslan",
    isCancelled: false,
  },
  {
    id: 3,
    dateTime: "2025-12-03 15:15",
    patientFirstName: "Oğuz",
    patientLastName: "Çelik",
    isCancelled: false,
  },
];
// onback ile geri geldik hangi bilgiler gözüküyor onları gösteriyor
// randevu iptali yapıyoruz
const DoctorFutureAppointmentsPage: React.FC<DoctorFutureAppointmentsPageProps> = ({
  doctor,
  onBack,
}) => {
  const [appointments, setAppointments] =
    useState<FutureAppointment[]>(mockFutureAppointments);

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
        }}
        >
        <span style={{ fontSize: "16px" }}>←</span>
        <span>Geri</span>
       </button>

      <h2>
        Gelecek Randevularım - Dr. {doctor.firstName} {doctor.lastName}
      </h2>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        Bu ekranda gelecekteki randevularınızı görebilir ve isterseniz
        iptal edebilirsiniz.
      </p>

      {appointments.map((appt) => {
        const fadedStyle = appt.isCancelled
          ? { opacity: 0.5, backgroundColor: "#f5f5f5" }
          : {};

        return (
            <div
                key={appt.id}
                style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px 12px",
                marginBottom: "10px",
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: "50px",
                ...fadedStyle,
                }}
            >
                <div>
                <p style={{ margin: 0 }}><strong>{appt.dateTime}</strong></p>
                <p style={{ margin: 0 }}>{appt.patientFirstName} {appt.patientLastName}</p>
                {appt.isCancelled && (
                    <p style={{ color: "black", marginTop: "4px", fontSize: "14px" }}>
                    Bu randevu iptal edilmiştir.
                    </p>
                )}
                </div>

                {!appt.isCancelled && (
                    <div style={{ textAlign: "center", marginLeft: "12px" }}>
                        <button
                            onClick={() => handleCancel(appt.id)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "28px",
                                fontWeight: "bold",
                                color: "black",
                                lineHeight: "24px",
                                marginTop: "10px",      // ⬅ Çarpıyı biraz aşağı çekiyoruz
                            }}
                            title="Randevuyu iptal et"
                            >
                            ×
                            </button>
                            <p style={{ fontSize: "12px", marginTop: "4px", textAlign: "center" }}>
                            İptal Et
                            </p>
                    </div>
                )}
            </div>
        );
      })}
    </div>
  );
};

export default DoctorFutureAppointmentsPage;
