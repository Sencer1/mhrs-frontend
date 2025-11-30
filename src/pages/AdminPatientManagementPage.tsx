// src/pages/AdminPatientManagementPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import { AdminPatient } from "../types/domain";
import { fetchAdminPatients } from "../services/adminService";
import PageContainer from "../components/layout/PageContainer";
import BackButton from "../components/common/BackButton";

type AdminPatientManagementPageProps = {
  onBack: () => void;
};

const AdminPatientManagementPage: React.FC<
  AdminPatientManagementPageProps
> = ({ onBack }) => {
  const [patients, setPatients] = useState<AdminPatient[]>([]);
  const [filterText, setFilterText] = useState("");

  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newNationalId, setNewNationalId] = useState("");
  const [newBloodGroup, setNewBloodGroup] = useState("A Rh(+)");
  const [newHeightCm, setNewHeightCm] = useState<string>("");
  const [newWeightKg, setNewWeightKg] = useState<string>("");

  useEffect(() => {
    fetchAdminPatients().then(setPatients);
  }, []);

  const visiblePatients = useMemo(() => {
    const q = filterText.toLocaleLowerCase("tr-TR");
    if (!q) return patients;

    return patients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLocaleLowerCase(
        "tr-TR"
      );
      return (
        fullName.includes(q) ||
        p.nationalId.toLocaleLowerCase("tr-TR").includes(q)
      );
    });
  }, [patients, filterText]);

  const handleAddPatient = () => {
    if (
      !newFirstName.trim() ||
      !newLastName.trim() ||
      !newNationalId.trim()
    ) {
      return;
    }

    const h = parseInt(newHeightCm, 10);
    const w = parseInt(newWeightKg, 10);

    const newPatient: AdminPatient = {
      id: `p${Date.now()}`,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      nationalId: newNationalId.trim(),
      bloodGroup: newBloodGroup,
      heightCm: isNaN(h) ? 0 : h,
      weightKg: isNaN(w) ? 0 : w,
    };

    setPatients((prev) => [...prev, newPatient]);

    setNewFirstName("");
    setNewLastName("");
    setNewNationalId("");
    setNewHeightCm("");
    setNewWeightKg("");
  };

  const handleDeletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PageContainer maxWidth={1100}>
      <BackButton onClick={onBack} />

      <h2 style={{ marginBottom: "8px" }}>Hasta Yönetimi</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Buradan sistemde kayıtlı hastaları görüntüleyebilir, filtreleyebilir ve
        yeni hasta kaydı oluşturabilirsiniz.
      </p>

      {/* yeni hasta formu */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "16px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "10px" }}>Yeni Hasta Ekle</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <input
            type="text"
            placeholder="Ad"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Soyad"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="T.C."
            value={newNationalId}
            onChange={(e) => setNewNationalId(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <select
            value={newBloodGroup}
            onChange={(e) => setNewBloodGroup(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="A Rh(+)">A Rh(+)</option>
            <option value="A Rh(-)">A Rh(-)</option>
            <option value="B Rh(+)">B Rh(+)</option>
            <option value="B Rh(-)">B Rh(-)</option>
            <option value="AB Rh(+)">AB Rh(+)</option>
            <option value="AB Rh(-)">AB Rh(-)</option>
            <option value="0 Rh(+)">0 Rh(+)</option>
            <option value="0 Rh(-)">0 Rh(-)</option>
          </select>
          <input
            type="number"
            placeholder="Boy (cm)"
            value={newHeightCm}
            onChange={(e) => setNewHeightCm(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="Kilo (kg)"
            value={newWeightKg}
            onChange={(e) => setNewWeightKg(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          onClick={handleAddPatient}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #198754",
            backgroundColor: "#198754",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Hasta Ekle
        </button>
      </div>

      {/* filtre + liste */}
      <div style={{ marginBottom: "8px" }}>
        <input
          type="text"
          placeholder="Ad / Soyad / T.C. filtrele..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "10px",
          backgroundColor: "#ffffff",
        }}
      >
        {visiblePatients.map((p) => (
          <div
            key={p.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 2fr auto",
              gap: "8px",
              alignItems: "center",
              borderBottom: "1px solid #eee",
              padding: "6px 0",
            }}
          >
            <div>
              <div>
                {p.firstName} {p.lastName}
              </div>
              <div style={{ fontSize: "13px", color: "#555" }}>
                T.C.: {p.nationalId}
              </div>
            </div>
            <div>{p.bloodGroup}</div>
            <div>
              {p.heightCm} cm / {p.weightKg} kg
            </div>
            <button
              onClick={() => handleDeletePatient(p.id)}
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                border: "1px solid #dc3545",
                backgroundColor: "#dc3545",
                color: "#fff",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Sil
            </button>
          </div>
        ))}

        {visiblePatients.length === 0 && (
          <p style={{ color: "#666", margin: 0 }}>Kayıtlı hasta bulunamadı.</p>
        )}
      </div>
    </PageContainer>
  );
};

export default AdminPatientManagementPage;
