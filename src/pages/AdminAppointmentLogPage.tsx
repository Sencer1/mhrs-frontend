// src/pages/AdminAppointmentLogPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import { AdminAppointment } from "../types/domain";
import { fetchAdminAppointments } from "../services/adminService";
import PageContainer from "../components/layout/PageContainer";
import BackButton from "../components/common/BackButton";

type AdminAppointmentLogPageProps = {
  onBack: () => void;
};

const AdminAppointmentLogPage: React.FC<AdminAppointmentLogPageProps> = ({
  onBack,
}) => {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAST" | "FUTURE">(
    "ALL"
  );
  const [searchText, setSearchText] = useState<string>("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchAdminAppointments().then(setAppointments);
  }, []);

  const handleToggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredAppointments = useMemo(() => {
    const q = searchText.toLocaleLowerCase("tr-TR");

    return appointments.filter((appt) => {
      const apptDate = appt.dateTime.slice(0, 10);

      if (dateFrom && apptDate < dateFrom) return false;
      if (dateTo && apptDate > dateTo) return false;

      if (statusFilter === "PAST" && appt.status !== "PAST") return false;
      if (statusFilter === "FUTURE" && appt.status !== "FUTURE") return false;

      if (q) {
        const text = `${appt.doctorName} ${appt.patientName} ${appt.patientNationalId} ${appt.hospitalName} ${appt.departmentName}`.toLocaleLowerCase(
          "tr-TR"
        );
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [appointments, dateFrom, dateTo, statusFilter, searchText]);

  return (
    <PageContainer maxWidth={1100}>
      <BackButton onClick={onBack} />

      <h2 style={{ marginBottom: "8px" }}>Randevu Kayıt Defteri</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Bu ekrandan tüm geçmiş ve gelecek randevuları görebilir, tarih aralığı
        ve metne göre filtreleyebilirsiniz. Randevu kartına tıklayınca reçete
        özetini görebilirsiniz.
      </p>

      {/* Filtre alanı */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "10px 12px",
          marginBottom: "16px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            marginBottom: "10px",
          }}
        >
          <div>
            <label style={{ fontSize: "13px" }}>Başlangıç Tarihi</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: "13px" }}>Bitiş Tarihi</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: "13px" }}>Durum</label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "ALL" | "PAST" | "FUTURE")
              }
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="ALL">Tümü</option>
              <option value="PAST">Geçmiş</option>
              <option value="FUTURE">Gelecek</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: "13px" }}>Metne göre ara</label>
          <input
            type="text"
            placeholder="Doktor, hasta, T.C., hastane, departman..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      </div>

      {/* Randevu listesi */}
      <div>
        {filteredAppointments.map((appt) => {
          const isExpanded = expandedId === appt.id;
          return (
            <div
              key={appt.id}
              onClick={() => handleToggleExpand(appt.id)}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px 12px",
                marginBottom: "10px",
                backgroundColor: "#ffffff",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1fr",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{appt.dateTime}</div>
                  <div style={{ fontSize: "13px", color: "#555" }}>
                    {appt.hospitalName} - {appt.departmentName}
                  </div>
                </div>
                <div>
                  <div>{appt.doctorName}</div>
                  <div style={{ fontSize: "13px", color: "#555" }}>
                    {appt.patientName} ({appt.patientNationalId})
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: "13px" }}>
                  {appt.status === "PAST" ? "Geçmiş" : "Gelecek"}{" "}
                  <span>{isExpanded ? "▲" : "▼"}</span>
                </div>
              </div>

              {isExpanded && appt.prescriptionText && (
                <div style={{ marginTop: "8px", fontSize: "14px" }}>
                  <strong>Reçete özeti:</strong>
                  <p style={{ marginTop: "4px" }}>{appt.prescriptionText}</p>
                </div>
              )}
            </div>
          );
        })}

        {filteredAppointments.length === 0 && (
          <p style={{ color: "#666" }}>Filtreye uyan randevu bulunamadı.</p>
        )}
      </div>
    </PageContainer>
  );
};

export default AdminAppointmentLogPage;
