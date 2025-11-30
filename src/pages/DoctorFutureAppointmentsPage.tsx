// src/pages/DoctorFutureAppointmentsPage.tsx
import React, { useEffect, useState } from "react";
import { DoctorInfo, DoctorFutureAppointment } from "../types/domain";
import {
  getDoctorFutureAppointments,
  cancelDoctorAppointment,
} from "../services/doctorService";
import PageContainer from "../components/layout/PageContainer";
import BackButton from "../components/common/BackButton";

type DoctorFutureAppointmentsPageProps = {
  doctor: DoctorInfo;
  onBack: () => void;
};

const DoctorFutureAppointmentsPage: React.FC<
  DoctorFutureAppointmentsPageProps
> = ({ doctor, onBack }) => {
  const [appointments, setAppointments] = useState<DoctorFutureAppointment[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorFutureAppointments(doctor.nationalId)
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, [doctor.nationalId]);

  const handleCancel = async (id: number) => {
    await cancelDoctorAppointment(id);
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, isCancelled: true } : appt
      )
    );
  };

  return (
    <PageContainer>
      <BackButton onClick={onBack} />

      <h2>
        Gelecek Randevularım - Dr. {doctor.firstName} {doctor.lastName}
      </h2>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        Bu ekranda gelecekteki randevularınızı görebilir ve isterseniz iptal
        edebilirsiniz.
      </p>

      {loading && <p>Yükleniyor...</p>}

      {!loading &&
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
                padding: "10px 12px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: "50px",
                backgroundColor: "#fafafa",
                ...fadedStyle,
              }}
            >
              <div>
                <p style={{ margin: 0 }}>
                  <strong>{appt.dateTime}</strong>
                </p>
                <p style={{ margin: 0 }}>
                  {appt.patientFirstName} {appt.patientLastName}
                </p>
                {appt.isCancelled && (
                  <p
                    style={{
                      color: "black",
                      marginTop: "4px",
                      fontSize: "14px",
                    }}
                  >
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
                      marginTop: "10px",
                    }}
                    title="Randevuyu iptal et"
                  >
                    ×
                  </button>
                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "4px",
                      textAlign: "center",
                    }}
                  >
                    İptal Et
                  </p>
                </div>
              )}
            </div>
          );
        })}
    </PageContainer>
  );
};

export default DoctorFutureAppointmentsPage;
