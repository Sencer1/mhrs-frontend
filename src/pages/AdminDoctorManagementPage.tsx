import React, { useMemo, useState } from "react";

type AdminDoctorManagementPageProps = {
  onBack: () => void;
};

// doktorların tutulma biçimi
type AdminDoctor = {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  hospitalId: string;
  departmentId: string;
};

type AdminHospital = {
  id: string;
  name: string;
};

type AdminDepartment = {
  id: string;
  name: string;
  hospitalId: string;
};

// şimdilik sabit/mock hastane ve departmanlar
const hospitals: AdminHospital[] = [
  { id: "h1", name: "Ankara Şehir Hastanesi" },
  { id: "h2", name: "Ankara Eğitim ve Araştırma" },
  { id: "h3", name: "İstanbul Şehir Hastanesi" },
];

const departments: AdminDepartment[] = [
  { id: "d1", name: "Kardiyoloji", hospitalId: "h1" },
  { id: "d2", name: "Dahiliye", hospitalId: "h1" },
  { id: "d3", name: "Ortopedi", hospitalId: "h2" },
  { id: "d4", name: "Kardiyoloji", hospitalId: "h3" },
];

// örnek doktor verileri
const initialDoctors: AdminDoctor[] = [
  {
    id: "doc1",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    nationalId: "10000000000",
    hospitalId: "h1",
    departmentId: "d1",
  },
  {
    id: "doc2",
    firstName: "Elif",
    lastName: "Demir",
    nationalId: "20000000000",
    hospitalId: "h1",
    departmentId: "d2",
  },
  {
    id: "doc3",
    firstName: "Mehmet",
    lastName: "Kara",
    nationalId: "30000000000",
    hospitalId: "h3",
    departmentId: "d4",
  },
];

const AdminDoctorManagementPage: React.FC<AdminDoctorManagementPageProps> = ({
  onBack,
}) => {
  // doktor listesi
  const [doctors, setDoctors] = useState<AdminDoctor[]>(initialDoctors);

  // yeni doktor ekleme formu için stateler
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newNationalId, setNewNationalId] = useState("");
  const [newHospitalId, setNewHospitalId] = useState<string>("h1");
  const [newDepartmentId, setNewDepartmentId] = useState<string>("");

  // arama kutusu (ad/soyad/TC)
  const [filterText, setFilterText] = useState("");

  // seçili hastaneye göre departmanlar
  const filteredDepartments = useMemo(
    () => departments.filter((d) => d.hospitalId === newHospitalId),
    [newHospitalId]
  );

  // sayfa açıldığında veya hastane değişince departman seçimini ayarla
  React.useEffect(() => {
    if (filteredDepartments.length > 0 && !newDepartmentId) {
      setNewDepartmentId(filteredDepartments[0].id);
    }
  }, [filteredDepartments, newDepartmentId]);

  // ekranda gösterilecek doktorlar (filtre uygulanmış hali)
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

  const handleAddDoctor = () => {
    if (
      !newFirstName.trim() ||
      !newLastName.trim() ||
      !newNationalId.trim() ||
      !newHospitalId ||
      !newDepartmentId
    ) {
      return;
    }

    const newDoc: AdminDoctor = {
      id: `doc${Date.now()}`,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      nationalId: newNationalId.trim(),
      hospitalId: newHospitalId,
      departmentId: newDepartmentId,
    };

    setDoctors((prev) => [...prev, newDoc]);

    // formu temizle
    setNewFirstName("");
    setNewLastName("");
    setNewNationalId("");
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  const getHospitalName = (id: string) =>
    hospitals.find((h) => h.id === id)?.name ?? "-";

  const getDepartmentName = (id: string) =>
    departments.find((d) => d.id === id)?.name ?? "-";

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

      <h2 style={{ marginBottom: "8px" }}>Doktor Yönetimi</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Buradan yeni doktor ekleyebilir, mevcut doktorların bilgilerini
        görüntüleyebilir ve sistemden kaldırabilirsiniz.
      </p>

      {/* Doktor arama kutusu */}
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
          placeholder="Ad, soyad veya T.C. içinde ara..."
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "24px",
        }}
      >
        {/* Sol: doktor listesi (scroll'lu) */}
        <div>
          <h3 style={{ marginTop: 0 }}>Doktor Listesi</h3>

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px 12px",
              maxHeight: "380px",
              overflowY: "auto",
              backgroundColor: "#f8f9fa",
            }}
          >
            {visibleDoctors.map((doc) => (
              <div
                key={doc.id}
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
                      {doc.firstName} {doc.lastName}
                    </div>
                    <div style={{ fontSize: "12px", color: "#555" }}>
                      T.C.: {doc.nationalId}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                  <div>
                    <strong>Hastane:</strong> {getHospitalName(doc.hospitalId)}
                  </div>
                  <div>
                    <strong>Departman:</strong>{" "}
                    {getDepartmentName(doc.departmentId)}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => handleDeleteDoctor(doc.id)}
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

            {visibleDoctors.length === 0 && (
              <p style={{ color: "#777", fontSize: "14px" }}>
                Filtrenize göre doktor bulunamadı.
              </p>
            )}
          </div>
        </div>

        {/* Sağ: yeni doktor ekleme formu */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "12px 14px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Yeni Doktor Ekle</h3>

          <div style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600 }}>
              Ad:
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  marginTop: "4px",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600 }}>
              Soyad:
              <input
                type="text"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  marginTop: "4px",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600 }}>
              T.C. Kimlik No:
              <input
                type="text"
                value={newNationalId}
                onChange={(e) => setNewNationalId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  marginTop: "4px",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600 }}>
              Hastane:
            </label>
            <select
              value={newHospitalId}
              onChange={(e) => {
                setNewHospitalId(e.target.value);
                setNewDepartmentId("");
              }}
              style={{
                width: "100%",
                padding: "6px 8px",
                marginTop: "4px",
                boxSizing: "border-box",
              }}
            >
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600 }}>
              Departman:
            </label>
            <select
              value={newDepartmentId}
              onChange={(e) => setNewDepartmentId(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                marginTop: "4px",
                boxSizing: "border-box",
              }}
            >
              {filteredDepartments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
              {filteredDepartments.length === 0 && (
                <option value="">Bu hastanede departman yok</option>
              )}
            </select>
          </div>

          <button
            onClick={handleAddDoctor}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#198754",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            Doktor Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctorManagementPage;
