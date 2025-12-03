// src/pages/admin/AdminPrescriptionManagementPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { AdminPrescription } from "../types/domain";
import { fetchAdminPrescriptions, deleteAdminPrescription } from "../services/adminService";
import BackButton from "../components/common/BackButton";
import PageContainer from "../components/layout/PageContainer";

type AdminPrescriptionManagementPageProps = {
  onBack: () => void;
};

export const AdminPrescriptionManagementPage: React.FC<
  AdminPrescriptionManagementPageProps
> = ({ onBack }) => {
  const [prescriptions, setPrescriptions] = useState<AdminPrescription[]>([]);
  const [filterText, setFilterText] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchAdminPrescriptions()
      .then(setPrescriptions)
      .catch((err) => {
        console.error(err);
        alert("Reçeteler yüklenirken hata oluştu.");
      })
      .finally(() => setLoading(false));
  }, []);

  const visiblePrescriptions = useMemo(() => {
    const q = filterText.toLocaleLowerCase("tr-TR");
    if (!q) return prescriptions;

    return prescriptions.filter((rx) => {
      const joinedText = (
        rx.patientName +
        " " +
        rx.doctorName +
        " " +
        rx.hospitalName +
        " " +
        rx.departmentName +
        " " +
        rx.departmentName +
        " " +
        (rx.medicines || []).join(" ") +
        " " +
        (rx.drugs || []).join(" ")
      ).toLocaleLowerCase("tr-TR");

      return joinedText.includes(q);
    });
  }, [prescriptions, filterText]);

  const handleDeletePrescription = async (id: string) => {
    if (!window.confirm("Bu reçeteyi silmek istediğinize emin misiniz?")) return;

    setLoading(true);
    try {
      await deleteAdminPrescription(id);
      setPrescriptions((prev) => prev.filter((rx) => rx.id !== id));
    } catch (err) {
      console.error(err);
      alert("Reçete silinirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <BackButton onClick={onBack} />

      <h2 style={{ marginBottom: "8px" }}>Reçete / İlaç Kayıtları</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Buradan sistemdeki reçeteleri; hastaya, doktora veya ilaç adına göre
        filtreleyebilir, gerektiğinde kaydı silebilirsiniz.
      </p>

      {/* Filtre kutusu */}
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
          placeholder="Hasta, doktor, hastane, departman veya ilaç içinde ara..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
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
        {loading && <p>Yükleniyor...</p>}
        {!loading && visiblePrescriptions.map((rx) => (
          <div
            key={rx.id}
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
              <div style={{ fontWeight: 600 }}>
                Reçete Tarihi: {rx.date || rx.prescriptionDateTime || "-"}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: "#0d6efd",
                  color: "white",
                }}
              >
                {rx.id ? rx.id.toUpperCase() : ""}
              </span>
            </div>

            <div style={{ fontSize: "13px", marginBottom: "6px" }}>
              <div>
                <strong>Hasta:</strong> {rx.patientName}
              </div>
              <div>
                <strong>Doktor:</strong> {rx.doctorName}
              </div>
              <div>
                <strong>Hastane:</strong> {rx.hospitalName}
              </div>
              <div>
                <strong>Departman:</strong> {rx.departmentName}
              </div>
            </div>

            <div style={{ fontSize: "13px", marginBottom: "6px" }}>
              <strong>İlaçlar:</strong>
              <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                {(rx.medicines || rx.drugs || []).map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "4px",
              }}
            >
              <button
                onClick={() => handleDeletePrescription(rx.id)}
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
                Sil
              </button>
            </div>
          </div>
        ))}

        {!loading && visiblePrescriptions.length === 0 && (
          <p style={{ color: "#777", fontSize: "14px" }}>
            Filtrenize uygun reçete bulunamadı.
          </p>
        )}
      </div>
    </PageContainer>
  );
};
