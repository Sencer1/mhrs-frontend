import React, { useMemo, useState } from "react";

type AdminAppointmentLogPageProps = {
  onBack: () => void;
};

// randevu yapısı (şimdilik basit mock)
type AdminAppointment = {
  id: number;
  dateTime: string; // "2025-12-01 09:30"
  hospitalName: string;
  departmentName: string;
  doctorName: string;
  patientName: string;
  patientNationalId: string;
  status: "PAST" | "FUTURE"; // geçmiş / gelecek
  prescriptionText?: string; // reçete özeti
};

// örnek randevular
const initialAppointments: AdminAppointment[] = [
  {
    id: 1,
    dateTime: "2025-10-10 09:30",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    doctorName: "Dr. Ahmet Yılmaz",
    patientName: "Zeynep Kurt",
    patientNationalId: "22222222222",
    status: "PAST",
    prescriptionText:
      "Hipertansiyon tanısı. Amlodipin 5 mg 1x1, yaşam tarzı değişikliği önerildi.",
  },
  {
    id: 2,
    dateTime: "2025-11-20 14:00",
    hospitalName: "Ankara Eğitim ve Araştırma",
    departmentName: "Dahiliye",
    doctorName: "Dr. Elif Demir",
    patientName: "Mehmet Öz",
    patientNationalId: "33333333333",
    status: "PAST",
    prescriptionText: "Gastrit tanısı. PPI tedavisi başlandı, kontrol 1 ay sonra.",
  },
  {
    id: 3,
    dateTime: "2025-12-05 11:15",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    doctorName: "Dr. Ahmet Yılmaz",
    patientName: "Zeynep Kurt",
    patientNationalId: "22222222222",
    status: "FUTURE",
  },
  {
    id: 4,
    dateTime: "2025-12-08 16:00",
    hospitalName: "İstanbul Şehir Hastanesi",
    departmentName: "Ortopedi",
    doctorName: "Dr. Mehmet Kara",
    patientName: "Ayşe Yılmaz",
    patientNationalId: "44444444444",
    status: "FUTURE",
  },
];

const AdminAppointmentLogPage: React.FC<AdminAppointmentLogPageProps> = ({
  onBack,
}) => {
  // tüm randevular (şimdilik sabit mock, backend gelince API'den gelecek)
  const [appointments] = useState<AdminAppointment[]>(initialAppointments);

  // filtreler
  const [dateFrom, setDateFrom] = useState<string>(""); // başlangıç tarihi (yyyy-mm-dd)
  const [dateTo, setDateTo] = useState<string>(""); // bitiş tarihi
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAST" | "FUTURE">(
    "ALL"
  );
  const [searchText, setSearchText] = useState<string>("");

  // hangi kart açılmış (reçete detayları için)
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // kart tıklanınca aç/kapa
  const handleToggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // filtrelenmiş randevular
  const filteredAppointments = useMemo(() => {
    const q = searchText.toLocaleLowerCase("tr-TR");

    return appointments.filter((appt) => {
      const apptDate = appt.dateTime.slice(0, 10); // "2025-12-05"

      // tarih aralığı filtresi
      if (dateFrom && apptDate < dateFrom) {
        return false;
      }
      if (dateTo && apptDate > dateTo) {
        return false;
      }

      // geçmiş / gelecek filtresi
      if (statusFilter === "PAST" && appt.status !== "PAST") {
        return false;
      }
      if (statusFilter === "FUTURE" && appt.status !== "FUTURE") {
        return false;
      }

      // arama filtresi (doktor, hasta, tc, hastane, departman)
      if (q) {
        const text =
          `${appt.doctorName} ${appt.patientName} ${appt.patientNationalId} ${appt.hospitalName} ${appt.departmentName}`.toLocaleLowerCase(
            "tr-TR"
          );
        if (!text.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, dateFrom, dateTo, statusFilter, searchText]);

  return (
    <div style={{ padding: "24px", maxWidth: "1100px", margin: "24px auto" }}>
      {/* geri butonu */}
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
        {/* Tarih ve durum filtresi */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            marginBottom: "10px",
          }}
        >
          <div>
            <div
              style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}
            >
              Başlangıç Tarihi
            </div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <div
              style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}
            >
              Bitiş Tarihi
            </div>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <div
              style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}
            >
              Durum
            </div>
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
                boxSizing: "border-box",
              }}
            >
              <option value="ALL">Hepsi</option>
              <option value="PAST">Sadece Geçmiş</option>
              <option value="FUTURE">Sadece Gelecek</option>
            </select>
          </div>
        </div>

        {/* Metin arama kutusu */}
        <div>
          <div
            style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}
          >
            Arama
          </div>
          <input
            type="text"
            placeholder="Hasta adı, doktor adı, T.C., hastane veya departman..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Randevu listesi (scroll'lu) */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "10px 12px",
          maxHeight: "480px",
          overflowY: "auto",
          backgroundColor: "#ffffff",
        }}
      >
        {filteredAppointments.map((appt) => {
          const isExpanded = expandedId === appt.id;
          const isPast = appt.status === "PAST";

          return (
            <div
              key={appt.id}
              onClick={() => handleToggleExpand(appt.id)}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px 12px",
                marginBottom: "8px",
                backgroundColor: isExpanded ? "#f1f3f5" : "#f8f9fa",
                cursor: "pointer",
              }}
            >
              {/* Üst bilgiler */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{appt.dateTime}</div>
                  <div style={{ fontSize: "13px", color: "#555" }}>
                    {appt.hospitalName} - {appt.departmentName}
                  </div>
                  <div style={{ fontSize: "13px", color: "#555" }}>
                    Doktor: {appt.doctorName}
                  </div>
                </div>

                <div style={{ textAlign: "right", fontSize: "13px" }}>
                  <div>
                    <strong>Hasta:</strong> {appt.patientName}
                  </div>
                  <div style={{ fontSize: "12px", color: "#555" }}>
                    T.C.: {appt.patientNationalId}
                  </div>
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "12px",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      display: "inline-block",
                      border: "1px solid",
                      borderColor: isPast ? "#6c757d" : "#0d6efd",
                      color: isPast ? "#6c757d" : "#0d6efd",
                    }}
                  >
                    {isPast ? "Geçmiş Randevu" : "Gelecek Randevu"}
                  </div>
                </div>
              </div>

              {/* Aç/Kapa işareti */}
              <div
                style={{
                  fontSize: "12px",
                  color: "#555",
                  textAlign: "right",
                  marginTop: "4px",
                }}
              >
                {isExpanded ? "Detayı gizlemek için tıklayın ▲" : "Detay için tıklayın ▼"}
              </div>

              {/* Reçete / detay paneli */}
              {isExpanded && (
                <div
                  style={{
                    marginTop: "8px",
                    borderTop: "1px solid #ccc",
                    paddingTop: "8px",
                    fontSize: "13px",
                  }}
                >
                  <div style={{ marginBottom: "4px", fontWeight: 600 }}>
                    Reçete / Notlar:
                  </div>
                  {appt.prescriptionText ? (
                    <p style={{ margin: 0 }}>{appt.prescriptionText}</p>
                  ) : (
                    <p style={{ margin: 0, color: "#777" }}>
                      Bu randevuya ait kayıtlı bir reçete bulunmamaktadır.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredAppointments.length === 0 && (
          <p style={{ color: "#777", fontSize: "14px" }}>
            Seçili filtrelere göre randevu bulunamadı.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentLogPage;
