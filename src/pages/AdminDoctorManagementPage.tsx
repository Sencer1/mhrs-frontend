// src/pages/AdminDoctorManagementPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  AdminDoctor,
  AdminHospital,
  AdminDepartment,
} from "../types/domain";
import {
  fetchAdminDoctors,
  fetchAdminHospitals,
  fetchAdminDepartments,
  createAdminDoctor,
  deleteAdminDoctor,
} from "../services/adminService";
import PageContainer from "../components/layout/PageContainer";
import BackButton from "../components/common/BackButton";

type AdminDoctorManagementPageProps = {
  onBack: () => void;
};

const AdminDoctorManagementPage: React.FC<
  AdminDoctorManagementPageProps
> = ({ onBack }) => {
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [hospitals, setHospitals] = useState<AdminHospital[]>([]);
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);

  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newNationalId, setNewNationalId] = useState("");
  const [newHospitalId, setNewHospitalId] = useState<string>("");
  const [newDepartmentId, setNewDepartmentId] = useState<string>("");

  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchAdminDoctors(),
      fetchAdminHospitals(),
      fetchAdminDepartments(),
    ])
      .then(([docs, hs, ds]) => {
        setDoctors(docs);
        setHospitals(hs);
        setDepartments(ds);
        if (!newHospitalId && hs.length > 0) {
          setNewHospitalId(hs[0].id);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Veriler yüklenirken hata oluştu.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDepartments = useMemo(
    () => departments.filter((d) => d.hospitalId === newHospitalId),
    [departments, newHospitalId]
  );

  useEffect(() => {
    if (filteredDepartments.length > 0 && !newDepartmentId) {
      setNewDepartmentId(filteredDepartments[0].id);
    }
  }, [filteredDepartments, newDepartmentId]);

  const visibleDoctors = useMemo(() => {
    const q = filterText.toLocaleLowerCase("tr-TR");
    if (!q) return doctors;
    return doctors.filter((doc) => {
      const fullName = `${doc.firstName} ${doc.lastName}`.toLocaleLowerCase(
        "tr-TR"
      );
      return (
        fullName.includes(q) ||
        doc.nationalId.toLocaleLowerCase("tr-TR").includes(q)
      );
    });
  }, [doctors, filterText]);

  const handleAddDoctor = async () => {
    if (
      !newFirstName.trim() ||
      !newLastName.trim() ||
      !newNationalId.trim() ||
      !newHospitalId ||
      !newDepartmentId
    ) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }

    setLoading(true);
    try {
      const newDocPayload: AdminDoctor = {
        id: "", // Backend will assign ID
        firstName: newFirstName.trim(),
        lastName: newLastName.trim(),
        nationalId: newNationalId.trim(),
        hospitalId: newHospitalId,
        departmentId: newDepartmentId,
      };

      const createdDoc = await createAdminDoctor(newDocPayload);
      setDoctors((prev) => [...prev, createdDoc]);

      setNewFirstName("");
      setNewLastName("");
      setNewNationalId("");
      alert("Doktor başarıyla eklendi.");
    } catch (error) {
      console.error(error);
      alert("Doktor eklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!window.confirm("Bu doktoru silmek istediğinize emin misiniz?")) return;

    setLoading(true);
    try {
      await deleteAdminDoctor(id);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error(error);
      alert("Doktor silinirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getHospitalName = (id: string) =>
    hospitals.find((h) => h.id === id)?.name ?? "-";

  const getDepartmentName = (id: string) =>
    departments.find((d) => d.id === id)?.name ?? "-";

  return (
    <PageContainer maxWidth={1100}>
      <BackButton onClick={onBack} />

      <h2 style={{ marginBottom: "8px" }}>Doktor Yönetimi</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Buradan yeni doktor ekleyebilir, mevcut doktorların bilgilerini
        görüntüleyebilir ve sistemden kaldırabilirsiniz.
      </p>

      {/* üst: doktor ekleme formu */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "16px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "10px" }}>Yeni Doktor Ekle</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
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
          <select
            value={newHospitalId}
            onChange={(e) => {
              setNewHospitalId(e.target.value);
              setNewDepartmentId("");
            }}
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <select
            value={newDepartmentId}
            onChange={(e) => setNewDepartmentId(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            {filteredDepartments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddDoctor}
            disabled={loading}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #198754",
              backgroundColor: loading ? "#ccc" : "#198754",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {loading ? "Ekleniyor..." : "Doktor Ekle"}
          </button>
        </div>
      </div>

      {/* filtre + liste */}
      <div style={{ marginBottom: "8px" }}>
        <input
          type="text"
          placeholder="Ad / Soyad / TC filtrele..."
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
        {visibleDoctors.map((doc) => (
          <div
            key={doc.id}
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
                {doc.firstName} {doc.lastName}
              </div>
              <div style={{ fontSize: "13px", color: "#555" }}>
                T.C.: {doc.nationalId}
              </div>
            </div>
            <div>{getHospitalName(doc.hospitalId)}</div>
            <div>{getDepartmentName(doc.departmentId)}</div>
            <button
              onClick={() => handleDeleteDoctor(doc.id)}
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

        {visibleDoctors.length === 0 && (
          <p style={{ color: "#666", margin: 0 }}>Kayıtlı doktor bulunamadı.</p>
        )}
      </div>
    </PageContainer>
  );
};

export default AdminDoctorManagementPage;
