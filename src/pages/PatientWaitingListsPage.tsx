import React, { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import { PatientInfo, WaitingListItem } from "../types/domain";
import { getMyWaitingList } from "../services/waitingListService";


type PatientWaitingListsPageProps = {
  patient: PatientInfo;
  onBack: () => void;
};

const PatientWaitingListsPage: React.FC<PatientWaitingListsPageProps> = ({
  patient,
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

      const data = await getMyWaitingList();
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


  return (
    <PageContainer maxWidth={900}>
      <h1 style={{ marginBottom: 16 }}>
        Bekleme Listelerim
      </h1>

      <p style={{ marginBottom: 16, color: "#555" }}>
        {patient.firstName} {patient.lastName} – T.C. {patient.nationalId}
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
        <p>Şu anda herhangi bir bekleme listesinde kaydınız bulunmamaktadır.</p>
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
                <th style={thStyle}>Doktor</th>
                <th style={thStyle}>Hastane</th>
                <th style={thStyle}>Bölüm</th>
                <th style={thStyle}>Talep Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const date = new Date(item.requestDateTime);
                const formatted =
                  isNaN(date.getTime())
                    ? item.requestDateTime
                    : date.toLocaleString("tr-TR");

                return (
                  <tr key={item.waitingId}>
                    <td style={tdStyle}>{item.waitingId}</td>
                    <td style={tdStyle}>{item.level}</td>
                    <td style={tdStyle}>
                      {item.doctorName
                        ? item.doctorName
                        : item.doctorNationalId}
                    </td>
                    <td style={tdStyle}>
                      {item.hospitalName ?? item.hospitalId}
                    </td>
                    <td style={tdStyle}>
                      {item.departmentName ?? item.departmentId}
                    </td>
                    <td style={tdStyle}>{formatted}</td>
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

export default PatientWaitingListsPage;
