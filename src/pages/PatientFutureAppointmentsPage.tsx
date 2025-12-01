import React, { useEffect, useState } from "react";
import {
  PatientInfo,
  PatientFutureAppointment,
} from "../types/domain";
import {
  getFutureAppointments,
  cancelAppointment,
} from "../services/patientService";
import PageContainer from "../components/layout/PageContainer";
import BackButton from "../components/common/BackButton";

type Props = {
  patient: PatientInfo;
  onBack: () => void;
};

const PatientFutureAppointmentsPage: React.FC<Props> = ({ patient, onBack }) => {
  const [appointments, setAppointments] = useState<PatientFutureAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFutureAppointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    await cancelAppointment(id);

    // status güncelle
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id
          ? { ...appt, status: "CANCELLED_BY_PATIENT" }
          : appt
      )
    );
  };

  return (
    <PageContainer>
      <BackButton onClick={onBack} />

      <h2>
        Gelecek Randevularım – {patient.firstName} {patient.lastName}
      </h2>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        Bu ekranda ileri tarihteki randevularınızı görüntüleyebilir ve iptal edebilirsiniz.
      </p>

      {loading && <p>Yükleniyor...</p>}

      {!loading && appointments.length === 0 && (
        <p style={{ color: "#666" }}>
          İleri tarihte randevunuz bulunmamaktadır.
        </p>
      )}

      {!loading &&
        appointments.map((appt) => {
          const isCancelled = appt.status?.startsWith("CANCELLED");

          const fadedStyle = isCancelled
            ? { opacity: 0.5, backgroundColor: "#f5f5f5" }
            : {};

          let cancelMessage = "";
          if (appt.status === "CANCELLED_BY_DOCTOR") {
            cancelMessage = "Bu randevunuz doktor tarafından iptal edilmiştir.";
          } else if (appt.status === "CANCELLED_BY_PATIENT") {
            cancelMessage = "Bu randevunuz hasta tarafından iptal edilmiştir.";
          }

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
                alignItems: "center",
                ...fadedStyle,
              }}
            >
              <div>
                <p style={{ margin: 0 }}>
                  <strong>Tarih / Saat:</strong> {appt.slotDateTime}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Doktor:</strong> {appt.doctorFirstName} {appt.doctorLastName}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Hastane:</strong> {appt.hospitalName} –{" "}
                  {appt.departmentName}
                </p>

                {isCancelled && cancelMessage && (
                  <p style={{ color: "black", marginTop: "8px" }}>
                    {cancelMessage}
                  </p>
                )}
              </div>

              {!isCancelled && (
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
        })}
    </PageContainer>
  );
};

export default PatientFutureAppointmentsPage;
