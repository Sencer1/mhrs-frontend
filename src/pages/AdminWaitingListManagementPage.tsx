// src/pages/admin/AdminWaitingListManagementPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { AdminWaitingItem } from "../types/domain";
import { fetchAdminWaitingList } from "../services/adminService";
import BackButton from "../components/common/BackButton";
import PageContainer from "../components/layout/PageContainer";

type AdminWaitingListManagementPageProps = {
  onBack: () => void;
};

export const AdminWaitingListManagementPage: React.FC<
  AdminWaitingListManagementPageProps
> = ({ onBack }) => {
  const [waitingList, setWaitingList] = useState<AdminWaitingItem[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchAdminWaitingList().then((data) => setWaitingList(data));
  }, []);

  const visibleItems = useMemo(() => {
    const q = searchText.toLocaleLowerCase("tr-TR");
    if (!q) return waitingList;

    return waitingList.filter((item) => {
      const text = (
        item.patientName +
        " " +
        item.patientNationalId +
        " " +
        item.doctorName +
        " " +
        item.hospitalName +
        " " +
        item.departmentName
      ).toLocaleLowerCase("tr-TR");

      return text.includes(q);
    });
  }, [waitingList, searchText]);

  const handleDeleteItem = (id: string) => {
    // TODO: backend delete endpoint’ine bağla
    setWaitingList((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <PageContainer>
      <BackButton onClick={onBack} />

      <h2 style={{ marginBottom: "8px" }}>Bekleme Listesi Yönetimi</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Bu ekrandan tüm hastanelerdeki bekleme listesini görebilir, filtreleyebilir
        ve gerekirse listeden kayıt silebilirsiniz.
      </p>

      {/* Arama kutusu */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 600 }}>Filtre:</span>
        <input
          type="text"
          placeholder="Hasta, T.C., doktor, hastane veya departman içinde ara..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            flex: 1,
            padding: "6px 8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Liste */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "10px 12px",
          maxHeight: "420px",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
        }}
      >
        {visibleItems.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "8px 10px",
              marginBottom: "8px",
              backgroundColor: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>
                  {item.requestedDateTime}
                </div>
                <div style={{ fontSize: "13px", color: "#555" }}>
                  {item.hospitalName} - {item.departmentName}
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: "12px" }}>
                <div>
                  <strong>Hasta:</strong> {item.patientName}
                </div>
                <div style={{ color: "#555" }}>
                  T.C.: {item.patientNationalId}
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: "13px",
                marginBottom: "4px",
              }}
            >
              <strong>Doktor:</strong> {item.doctorName}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "4px",
              }}
            >
              <button
                onClick={() => handleDeleteItem(item.id)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid #dc3545",
                  backgroundColor: "white",
                  color: "#dc3545",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Listeden Sil
              </button>
            </div>
          </div>
        ))}

        {visibleItems.length === 0 && (
          <p style={{ color: "#777", fontSize: "14px" }}>
            Filtrenize uygun bekleme listesi kaydı bulunamadı.
          </p>
        )}
      </div>
    </PageContainer>
  );
};
