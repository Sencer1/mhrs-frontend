import React, { useMemo, useState, useEffect } from "react";
import {
  AdminHospital,
  AdminDepartment,
} from "../types/domain";
import {
  getAllHospitals,
  HospitalDto,
  createHospital,
} from "../services/hospitalService";
import {
  getDepartmentsByHospital,
  DepartmentDto,
  createDepartment,
  deleteDepartment,
} from "../services/departmentService";
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

  // 1) Sayfa açıldığında DB'den hastaneleri çek
  useEffect(() => {
    const loadHospitals = async () => {
      const hospitalDtos: HospitalDto[] = await getAllHospitals();

      const adminHospitals: AdminHospital[] = hospitalDtos.map((h) => ({
        id: String(h.hospitalId),
        name: h.name,
        city: h.city,
      }));

      setHospitals(adminHospitals);

      if (adminHospitals.length > 0) {
        setSelectedHospitalId(adminHospitals[0].id);
      } else {
        setSelectedHospitalId(null);
        setDepartments([]);
      }
    };

    loadHospitals();
  }, []);

  // 2) Seçili hastane değiştikçe o hastanenin departmanlarını gerçek DB'den çek
  useEffect(() => {
    const loadDepartments = async () => {
      if (!selectedHospitalId) {
        setDepartments([]);
        return;
      }

      const hospitalIdNum = Number(selectedHospitalId);
      if (Number.isNaN(hospitalIdNum)) {
        setDepartments([]);
        return;
      }

      const deptDtos: DepartmentDto[] = await getDepartmentsByHospital(
        hospitalIdNum
      );

      const adminDepts: AdminDepartment[] = deptDtos.map((d) => ({
        id: String(d.departmentId),
        name: d.branchName,
        hospitalId: String(selectedHospitalId),
      }));

      setDepartments(adminDepts);
    };

    loadDepartments();
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

  const handleAddHospital = async () => {
    const name = newHospitalName.trim();
    const city = newHospitalCity.trim();

    if (!name || !city) return;

    try {
      const created = await createHospital({
        name,
        city,
      });

      const newHospital: AdminHospital = {
        id: String(created.hospitalId),
        name: created.name,
        city: created.city,
      };

      setHospitals((prev) => [...prev, newHospital]);
      setSelectedHospitalId(newHospital.id);
      setNewHospitalName("");
      setNewHospitalCity("");
    } catch (err) {
      console.error("Hastane oluşturulurken hata oluştu", err);
      alert("Hastane kaydedilirken bir hata oluştu.");
    }
  };

  const handleAddDepartment = async () => {
    if (!selectedHospitalId || !newDepartmentName.trim()) return;

    const hospitalIdNum = Number(selectedHospitalId);
    if (Number.isNaN(hospitalIdNum)) return;

    try {
      const created = await createDepartment({
        hospitalId: hospitalIdNum,
        branchName: newDepartmentName.trim(),
      });

      const newDept: AdminDepartment = {
        id: String(created.departmentId),
        name: created.branchName,
        hospitalId: selectedHospitalId,
      };

      setDepartments((prev) => [...prev, newDept]);
      setNewDepartmentName("");
    } catch (err) {
      console.error("Departman oluşturulurken hata oluştu", err);
      alert("Departman kaydedilirken bir hata oluştu.");
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    const confirmed = window.confirm(
      "Bu departmanı silmek istediğinize emin misiniz?"
    );
    if (!confirmed) return;

    const numericId = Number(id);
    if (Number.isNaN(numericId)) return;

    try {
      await deleteDepartment(numericId);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Departman silinirken hata oluştu", err);
      alert("Departman silinirken bir hata oluştu. (Bağlı doktor/randevu olabilir)");
    }
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
