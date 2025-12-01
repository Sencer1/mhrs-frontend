import React, { useEffect, useState } from "react";
import BackButton from "../components/common/BackButton";
import PageContainer from "../components/layout/PageContainer";
import {
  PatientInfo,
  PatientPastAppointment,
} from "../types/domain";
import { getPastAppointments } from "../services/patientService";

type PatientPastAppointmentsPageProps = {
  patient: PatientInfo;
  onBack: () => void;
};

const PatientPastAppointmentsPage: React.FC<
  PatientPastAppointmentsPageProps
> = ({ patient, onBack }) => {
  const [appointments, setAppointments] = useState<PatientPastAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPastAppointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer maxWidth={720}>
      <BackButton onClick={onBack} />

      <h2 style={{ marginBottom: "8px" }}>
        Geçmiş Randevularım - {patient.firstName} {patient.lastName}
      </h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Bu ekranda geçmiş randevularınızı ve bu randevulara ait reçete
        özetlerini görebilirsiniz.
      </p>

      {loading && <p>Yükleniyor...</p>}

      {!loading && appointments.length === 0 && (
        <p style={{ color: "#666" }}>
          Geçmiş randevu kaydınız bulunmamaktadır.
        </p>
      )}

      {!loading &&
        appointments.map((appt) => (
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
              <strong>Tarih / Saat:</strong> {appt.slotDateTime}
            </p>
            <p>
              <strong>Doktor:</strong> {appt.doctorFirstName} {appt.doctorLastName}
            </p>
            <p>
              <strong>Hastane:</strong> {appt.hospitalName}
            </p>
            <p>
              <strong>Departman:</strong> {appt.departmentName}
            </p>
            <div style={{ marginTop: "6px" }}>
              <strong>Reçete Özeti:</strong>
              <p style={{ marginTop: "4px" }}>{appt.prescriptionText}</p>
            </div>
          </div>
        ))}
    </PageContainer>
  );
};

export default PatientPastAppointmentsPage;
