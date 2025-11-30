// src/pages/AdminHospitalManagementPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  AdminHospital,
  AdminDepartment,
} from "../types/domain";
import {
  fetchAdminHospitals,
  fetchAdminDepartments,
} from "../services/adminService";
import PageContainer from "../components/layout/PageContainer";
import BackButton from "../components/common/BackButton";

type AdminHospitalManagementPageProps = {
  onBack: () => void;
};

const AdminHospitalManagementPage: React.FC<
  AdminHospitalManagementPageProps
> = ({ onBack }) => {
  const [hospitals, setHospitals] = useState<AdminHospital[]>([]);
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);

  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(
    null
  );

  const [newHospitalName, setNewHospitalName] = useState("");
  const [newHospitalCity, setNewHospitalCity] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");

  const [hospitalFilterText, setHospitalFilterText] = useState("");

  useEffect(() => {
    Promise.all([fetchAdminHospitals(), fetchAdminDepartments()]).then(
      ([hs, ds]) => {
        setHospitals(hs);
        setDepartments(ds);
        if (!selectedHospitalId && hs.length > 0) {
          setSelectedHospitalId(hs[0].id);
        }
      }
    );
  }, [selectedHospitalId]);

  const hospitalDepartments = useMemo(
    () => departments.filter((d) => d.hospitalId === selectedHospitalId),
    [departments, selectedHospitalId]
  );

  const visibleHospitals = useMemo(() => {
    const q = hospitalFilterText.toLocaleLowerCase("tr-TR");
    if (!q) return hospitals;
    return hospitals.filter((h) => {
      const text = `${h.name} ${h.city}`.toLocaleLowerCase("tr-TR");
      return text.includes(q);
    });
  }, [hospitals, hospitalFilterText]);

  const handleAddHospital = () => {
    if (!newHospitalName.trim() || !newHospitalCity.trim()) return;

    const newId = `h${Date.now()}`;
    const newHospital: AdminHospital = {
      id: newId,
      name: newHospitalName.trim(),
      city: newHospitalCity.trim(),
    };

    setHospitals((prev) => [...prev, newHospital]);
    setNewHospitalName("");
    setNewHospitalCity("");
  };

  const handleAddDepartment = () => {
    if (!selectedHospitalId || !newDepartmentName.trim()) return;

    const newId = `d${Date.now()}`;
    const newDept: AdminDepartment = {
      id: newId,
      name: newDepartmentName.trim(),
      hospitalId: selectedHospitalId,
    };

    setDepartments((prev) => [...prev, newDept]);
    setNewDepartmentName("");
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <PageContainer maxWidth={1100}>
      <BackButton onClick={onBack} />

      <h2 style={{ marginBottom: "8px" }}>Hastane / Departman Yönetimi</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Buradan hastane ekleyebilir/silebilir, hastanelere bağlı departmanları
        yönetebilirsiniz.
      </p>

      {/* üst: hastane listesi + ekleme */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* sol: hastane listesi */}
        <div>
          <h3 style={{ marginBottom: "8px" }}>Hastaneler</h3>
          <input
            type="text"
            placeholder="İsim/şehir filtrele..."
            value={hospitalFilterText}
            onChange={(e) => setHospitalFilterText(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "8px",
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              maxHeight: "260px",
              overflowY: "auto",
              backgroundColor: "#f8f9fa",
            }}
          >
            {visibleHospitals.map((h) => (
              <div
                key={h.id}
                onClick={() => setSelectedHospitalId(h.id)}
                style={{
                  padding: "8px 10px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  backgroundColor:
                    selectedHospitalId === h.id ? "#e3f2fd" : "transparent",
                }}
              >
                <div style={{ fontWeight: 600 }}>{h.name}</div>
                <div style={{ fontSize: "13px", color: "#555" }}>{h.city}</div>
              </div>
            ))}
            {visibleHospitals.length === 0 && (
              <div style={{ padding: "8px 10px", color: "#777" }}>
                Kayıtlı hastane bulunamadı.
              </div>
            )}
          </div>
        </div>

        {/* sağ: yeni hastane/departman ekleme */}
        <div>
          <h3 style={{ marginBottom: "8px" }}>Yeni Hastane Ekle</h3>
          <div style={{ marginBottom: "8px" }}>
            <input
              type="text"
              placeholder="Hastane adı"
              value={newHospitalName}
              onChange={(e) => setNewHospitalName(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginBottom: "6px",
              }}
            />
            <input
              type="text"
              placeholder="Şehir"
              value={newHospitalCity}
              onChange={(e) => setNewHospitalCity(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <button
            onClick={handleAddHospital}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #1976d2",
              backgroundColor: "#1976d2",
              color: "#fff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Hastane Ekle
          </button>

          <hr style={{ margin: "16px 0" }} />

          <h3 style={{ marginBottom: "8px" }}>
            Seçili Hastaneye Departman Ekle
          </h3>
          <input
            type="text"
            placeholder="Departman adı"
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "6px",
            }}
          />
          <button
            onClick={handleAddDepartment}
            disabled={!selectedHospitalId}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #198754",
              backgroundColor: !selectedHospitalId ? "#ccc" : "#198754",
              color: "#fff",
              cursor: !selectedHospitalId ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Departman Ekle
          </button>
        </div>
      </div>

      {/* alt: seçili hastanenin departmanları */}
      <div>
        <h3 style={{ marginBottom: "8px" }}>Seçili Hastanenin Departmanları</h3>
        {selectedHospitalId == null && (
          <p style={{ color: "#666" }}>Lütfen bir hastane seçiniz.</p>
        )}

        {selectedHospitalId != null &&
          (hospitalDepartments.length === 0 ? (
            <p style={{ color: "#666" }}>
              Bu hastane için kayıtlı departman bulunmamaktadır.
            </p>
          ) : (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px 12px",
                backgroundColor: "#f8f9fa",
              }}
            >
              {hospitalDepartments.map((dept) => (
                <div
                  key={dept.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span>{dept.name}</span>
                  <button
                    onClick={() => handleDeleteDepartment(dept.id)}
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
            </div>
          ))}
      </div>
    </PageContainer>
  );
};

export default AdminHospitalManagementPage;
