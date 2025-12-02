import React, { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import { DoctorInfo, WaitingListItem } from "../types/domain";
import { getDoctorWaitingList } from "../services/waitingListService";
import { cancelWaitingList } from "../services/patientService"; // ister ayrı doctorService'e taşıyabilirsin

type DoctorWaitingListsPageProps = {
  doctor: DoctorInfo;
  onBack: () => void;
};

const DoctorWaitingListsPage: React.FC<DoctorWaitingListsPageProps> = ({
  doctor,
  onBack,
}) => {
  const [items, setItems] = useState<WaitingListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getDoctorWaitingList();
        setItems(data);
      } catch (err: any) {
        console.error(err);
        setError("Bekleme listesi yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCancel = async (waitingId: number) => {
    try {
      await cancelWaitingList(waitingId);
      setItems((prev) => prev.filter((x) => x.waitingId !== waitingId));
    } catch (err) {
      console.error(err);
      alert("Bekleme listesi kaydı iptal edilemedi.");
    }
  };

  return (
    <PageContainer maxWidth={900}>
      <h1 style={{ marginBottom: 16 }}>Bekleme Listem</h1>

      <p style={{ marginBottom: 16, color: "#555" }}>
        {doctor.firstName} {doctor.lastName} – {doctor.departmentName} ({doctor.hospitalName})
      </p>

      <button
        onClick={onBack}
        style={{
          marginBottom: 16,
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          backgroundColor: "#f5f5f5",
          cursor: "pointer",
        }}
      >
        Geri dön
      </button>

      {loading && <p>Yükleniyor...</p>}

      {error && (
        <p style={{ color: "red", marginTop: 8 }}>
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <p>Şu anda sizin için oluşturulmuş herhangi bir bekleme listesi kaydı bulunmamaktadır.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 8,
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Bekleme ID</th>
                <th style={thStyle}>Seviye</th>
                <th style={thStyle}>Hasta</th>
                <th style={thStyle}>Hastane</th>
                <th style={thStyle}>Bölüm</th>
                <th style={thStyle}>Talep Tarihi</th>
                <th style={thStyle}>İptal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const date = new Date(item.requestDateTime);
                const formatted = isNaN(date.getTime())
                  ? item.requestDateTime
                  : date.toLocaleString("tr-TR");

                return (
                  <tr key={item.waitingId}>
                    <td style={tdStyle}>{item.waitingId}</td>
                    <td style={tdStyle}>{item.level}</td>
                    <td style={tdStyle}>
                      {/* WaitingListItem tipinde hasta adın varsa onu yaz; yoksa TCKN göster */}
                      {"patientName" in item && (item as any).patientName
                        ? (item as any).patientName
                        : (item as any).patientNationalId}
                    </td>
                    <td style={tdStyle}>
                      {item.hospitalName ?? item.hospitalId}
                    </td>
                    <td style={tdStyle}>
                      {item.departmentName ?? item.departmentId}
                    </td>
                    <td style={tdStyle}>{formatted}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleCancel(item.waitingId)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#ff4d4d",
                          color: "white",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #ddd",
  fontWeight: 600,
  fontSize: 14,
};

const tdStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #eee",
  fontSize: 14,
};

export default DoctorWaitingListsPage;
