import React, { useState, useMemo } from "react";

type AdminHospitalManagementPageProps = {
  onBack: () => void;
};

// Hastaneler nasıl tutulacak
type AdminHospital = {
  id: string;
  name: string;
  city: string;
};

// Departmanlar nasıl tutulacak
type AdminDepartment = {
  id: string;
  name: string;
  hospitalId: string;
};

// Şimdilik sahte (mock) veriler
const initialHospitals: AdminHospital[] = [
  { id: "h1", name: "Ankara Şehir Hastanesi", city: "Ankara" },
  { id: "h2", name: "Ankara Eğitim ve Araştırma", city: "Ankara" },
  { id: "h3", name: "İstanbul Şehir Hastanesi", city: "İstanbul" },
];

const initialDepartments: AdminDepartment[] = [
  { id: "d1", name: "Kardiyoloji", hospitalId: "h1" },
  { id: "d2", name: "Dahiliye", hospitalId: "h1" },
  { id: "d3", name: "Ortopedi", hospitalId: "h2" },
  { id: "d4", name: "Kardiyoloji", hospitalId: "h3" },
];

const AdminHospitalManagementPage: React.FC<
  AdminHospitalManagementPageProps
> = ({ onBack }) => {
  const [hospitals, setHospitals] = useState<AdminHospital[]>(initialHospitals);
  const [departments, setDepartments] =
    useState<AdminDepartment[]>(initialDepartments);

  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(
    initialHospitals[0]?.id ?? null
  );

  // yeni hastane eklemek için stateler
  const [newHospitalName, setNewHospitalName] = useState("");
  const [newHospitalCity, setNewHospitalCity] = useState("");

  // yeni departman eklemek için state
  const [newDepartmentName, setNewDepartmentName] = useState("");

  // hastane arama kutusu (isim / şehir)
  const [hospitalFilterText, setHospitalFilterText] = useState("");

  // seçili hastanenin departmanları
  const hospitalDepartments = useMemo(
    () => departments.filter((d) => d.hospitalId === selectedHospitalId),
    [departments, selectedHospitalId]
  );

  // hastane listesinde filtre (isim+şehir)
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

    const newId = `h${Date.now()}`; // şimdilik basit id
    const newHospital: AdminHospital = {
      id: newId,
      name: newHospitalName.trim(),
      city: newHospitalCity.trim(),
    };

    setHospitals((prev) => [...prev, newHospital]);
    setNewHospitalName("");
    setNewHospitalCity("");
    setSelectedHospitalId(newId);
  };

  const handleDeleteHospital = (id: string) => {
    const remainingHospitals = hospitals.filter((h) => h.id !== id);
    const remainingDepartments = departments.filter(
      (d) => d.hospitalId !== id
    );

    setHospitals(remainingHospitals);
    setDepartments(remainingDepartments);

    if (selectedHospitalId === id) {
      setSelectedHospitalId(remainingHospitals[0]?.id ?? null);
    }
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
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "24px auto" }}>
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

      <h2 style={{ marginBottom: "8px" }}>Hastane / Departman Yönetimi</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Buradan yeni hastane ekleyebilir, mevcut hastaneleri ve hastanelere
        bağlı departmanları görüntüleyip düzenleyebilirsiniz.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1.4fr",
          gap: "24px",
        }}
      >
        {/* Sol taraf: hastaneler listesi + arama + ekleme */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "12px 16px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Hastaneler</h3>

          {/* Hastane arama kutusu */}
          <div style={{ marginBottom: "8px" }}>
            <input
              type="text"
              placeholder="Hastane adı veya şehirde ara..."
              value={hospitalFilterText}
              onChange={(e) => setHospitalFilterText(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              maxHeight: "260px",
              overflowY: "auto",
              marginBottom: "12px",
            }}
          >
            {visibleHospitals.map((h) => (
              <div
                key={h.id}
                onClick={() => setSelectedHospitalId(h.id)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "6px",
                  marginBottom: "6px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedHospitalId === h.id ? "#e3f2fd" : "white",
                  border:
                    selectedHospitalId === h.id
                      ? "1px solid #1976d2"
                      : "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{h.name}</div>
                  <div style={{ fontSize: "12px", color: "#555" }}>{h.city}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteHospital(h.id);
                  }}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "red",
                    fontSize: "14px",
                  }}
                >
                  Sil
                </button>
              </div>
            ))}

            {visibleHospitals.length === 0 && (
              <p style={{ color: "#777", fontSize: "14px" }}>
                Aramanıza uygun hastane bulunamadı.
              </p>
            )}
          </div>

          <div
            style={{
              borderTop: "1px solid #ddd",
              paddingTop: "10px",
              marginTop: "6px",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
              Yeni Hastane Ekle
            </h4>
            <input
              type="text"
              placeholder="Hastane adı"
              value={newHospitalName}
              onChange={(e) => setNewHospitalName(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                marginBottom: "6px",
                boxSizing: "border-box",
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
                marginBottom: "6px",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleAddHospital}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Hastane Ekle
            </button>
          </div>
        </div>

        {/* Sağ taraf: seçili hastanenin departmanları */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "12px 16px",
            backgroundColor: "#ffffff",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Departmanlar</h3>

          {!selectedHospitalId ? (
            <p style={{ color: "#777", fontSize: "14px" }}>
              Departmanları görmek için soldan bir hastane seçiniz.
            </p>
          ) : (
            <>
              <p style={{ color: "#555", fontSize: "14px" }}>
                Seçili hastane:{" "}
                <strong>
                  {hospitals.find((h) => h.id === selectedHospitalId)?.name}
                </strong>
              </p>

              <div
                style={{
                  maxHeight: "220px",
                  overflowY: "auto",
                  marginBottom: "12px",
                }}
              >
                {hospitalDepartments.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "6px",
                      marginBottom: "6px",
                      border: "1px solid #ddd",
                      display: "flex",
                      justifyContent: "space_between",
                      alignItems: "center",
                    }}
                  >
                    <span>{d.name}</span>
                    <button
                      onClick={() => handleDeleteDepartment(d.id)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "red",
                        fontSize: "14px",
                      }}
                    >
                      Sil
                    </button>
                  </div>
                ))}

                {hospitalDepartments.length === 0 && (
                  <p style={{ color: "#777", fontSize: "14px" }}>
                    Bu hastane için kayıtlı departman bulunmamaktadır.
                  </p>
                )}
              </div>

              <div
                style={{
                  borderTop: "1px solid #ddd",
                  paddingTop: "10px",
                  marginTop: "6px",
                }}
              >
                <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                  Yeni Departman Ekle
                </h4>
                <input
                  type="text"
                  placeholder="Departman adı"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    marginBottom: "6px",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={handleAddDepartment}
                  disabled={!selectedHospitalId}
                  style={{
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "#198754",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: selectedHospitalId ? "pointer" : "not-allowed",
                    fontSize: "14px",
                    opacity: selectedHospitalId ? 1 : 0.6,
                  }}
                >
                  Departman Ekle
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHospitalManagementPage;
