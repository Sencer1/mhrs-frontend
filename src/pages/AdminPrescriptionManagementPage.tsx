import React, { useMemo, useState } from "react";

type AdminPrescriptionManagementPageProps = {
  onBack: () => void;
};

type AdminPrescription = {
  id: string;
  date: string; // "2025-11-29"
  patientName: string;
  doctorName: string;
  hospitalName: string;
  departmentName: string;
  medicines: string[]; // ilaç isimleri
};

// Şimdilik sahte veriler (backend gelince buradan alınacak)
const initialPrescriptions: AdminPrescription[] = [
  {
    id: "rx1",
    date: "2025-11-20",
    patientName: "Zeynep Kurt",
    doctorName: "Ahmet Yılmaz",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    medicines: ["Aspirin 100 mg", "Beloc ZOK 25 mg"],
  },
  {
    id: "rx2",
    date: "2025-11-22",
    patientName: "Mehmet Kara",
    doctorName: "Elif Demir",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Dahiliye",
    medicines: ["Metformin 850 mg"],
  },
  {
    id: "rx3",
    date: "2025-11-25",
    patientName: "Ayşe Yıldız",
    doctorName: "Mehmet Kara",
    hospitalName: "İstanbul Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    medicines: ["Atorvastatin 20 mg", "Ramipril 5 mg"],
  },
];

const AdminPrescriptionManagementPage: React.FC<
  AdminPrescriptionManagementPageProps
> = ({ onBack }) => {
  const [prescriptions, setPrescriptions] =
    useState<AdminPrescription[]>(initialPrescriptions);

  // arama kutusu: hasta, doktor, hastane, departman, ilaç
  const [filterText, setFilterText] = useState("");

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
        rx.medicines.join(" ")
      ).toLocaleLowerCase("tr-TR");

      return joinedText.includes(q);
    });
  }, [prescriptions, filterText]);

  const handleDeletePrescription = (id: string) => {
    // Şimdilik tamamen siliyoruz, ileride backend'de "sil" endpoint'ine bağlanır
    setPrescriptions((prev) => prev.filter((rx) => rx.id !== id));
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1100px", margin: "24px auto" }}>
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
        {visiblePrescriptions.map((rx) => (
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
                Reçete Tarihi: {rx.date}
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
                {rx.id.toUpperCase()}
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
                {rx.medicines.map((m) => (
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

        {visiblePrescriptions.length === 0 && (
          <p style={{ color: "#777", fontSize: "14px" }}>
            Filtrenize uygun reçete bulunamadı.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPrescriptionManagementPage;
