import React, { useEffect, useState } from "react";
import { DoctorInfo, DoctorPastAppointment } from "../types/domain";
import { getDoctorPastAppointments } from "../services/doctorService";
import PageContainer from "../components/layout/PageContainer";
import BackButton from "../components/common/BackButton";

type DoctorPastAppointmentsPageProps = {
  doctor: DoctorInfo;
  onBack: () => void;
};

const DoctorPastAppointmentsPage: React.FC<DoctorPastAppointmentsPageProps> = ({
  doctor,
  onBack,
}) => {
  const [appointments, setAppointments] = useState<DoctorPastAppointment[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorPastAppointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  const handleCardClick = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <PageContainer>
      <BackButton onClick={onBack} />

      <h2>
        Geçmiş Randevularım - Dr. {doctor.firstName} {doctor.lastName}
      </h2>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        Bu ekranda geçmişte muayene ettiğiniz hastaların randevularını ve
        yazdığınız reçeteleri görebilirsiniz.
      </p>

      {loading && <p>Yükleniyor...</p>}

      {!loading &&
        appointments.map((appt) => {
          const isExpanded = expandedId === appt.id;
          const cardStyle: React.CSSProperties = {
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "12px",
            cursor: "pointer",
            backgroundColor: isExpanded ? "#f1f8e9" : "#fafafa",
            transition: "background-color 0.2s",
          };

          return (
            <div
              key={appt.id}
              onClick={() => handleCardClick(appt.id)}
              style={cardStyle}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
              >
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
    </PageContainer>
  );
};

export default DoctorPastAppointmentsPage;
