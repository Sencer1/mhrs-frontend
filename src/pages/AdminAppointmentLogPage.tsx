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
  const [dateFrom, setDateFrom] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [dateTo, setDateTo] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "completed" | "cancelled" | "booked"
  >("ALL");
  const [searchText, setSearchText] = useState<string>("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // useEffect kaldırıldı (Otomatik yükleme yok)

  const handleSearch = () => {
    setLoading(true);
    // Yeni aramada sayfayı başa al
    setPage(0);
    fetchAppointments(0);
  };

  const fetchAppointments = (pageIndex: number) => {
    setLoading(true);
    fetchAdminAppointments({
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      search: searchText || undefined,
      page: pageIndex,
      size: size,
    })
      .then(setAppointments)
      .catch((err) => {
        console.error(err);
        alert("Randevular yüklenirken hata oluştu.");
      })
      .finally(() => setLoading(false));
  };

  const handleToggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 0) return;
    setPage(newPage);
    fetchAppointments(newPage);
  };

  // Client-side filtering kaldırıldı, backend'den gelen veri direkt gösterilecek.
  const filteredAppointments = appointments;

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
                setStatusFilter(
                  e.target.value as
                  | "ALL"
                  | "completed"
                  | "cancelled"
                  | "booked"
                )
              }
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="ALL">Tümü</option>
              <option value="booked">Rezerve Edildi</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal Edildi</option>
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

      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: "8px 20px",
            backgroundColor: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Yükleniyor..." : "Listele"}
        </button>
      </div>


      {/* Randevu listesi */}
      <div>
        {loading && <p>Yükleniyor...</p>}
        {!loading && filteredAppointments.map((appt) => {
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
                  <div style={{ fontWeight: 600 }}>
                    {appt.date || appt.dateTime || appt.slotDateTime || "-"}
                  </div>
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
                  {appt.status === "PAST"
                    ? "Geçmiş"
                    : appt.status === "FUTURE"
                      ? "Gelecek"
                      : appt.status === "booked"
                        ? "Rezerve Edildi"
                        : appt.status === "completed"
                          ? "Tamamlandı"
                          : appt.status === "cancelled"
                            ? "İptal Edildi"
                            : appt.status}{" "}
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

        {!loading && filteredAppointments.length === 0 && (
          <p style={{ color: "#666" }}>Filtreye uyan randevu bulunamadı.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          marginTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0 || loading}
          style={{
            padding: "8px 16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor: page === 0 ? "#f0f0f0" : "white",
            cursor: page === 0 ? "not-allowed" : "pointer",
          }}
        >
          &lt; Önceki
        </button>
        <span style={{ fontWeight: 600 }}>Sayfa {page + 1}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={loading || appointments.length < size}
          style={{
            padding: "8px 16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor:
              loading || appointments.length < size ? "#f0f0f0" : "white",
            cursor:
              loading || appointments.length < size ? "not-allowed" : "pointer",
          }}
        >
          Sonraki &gt;
        </button>
      </div>
    </PageContainer >
  );
};

export default AdminAppointmentLogPage;
