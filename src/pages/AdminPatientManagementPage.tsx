import React, { useMemo, useState } from "react";

type AdminPatientManagementPageProps = {
  onBack: () => void;
};

type AdminPatient = {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
};

// Şimdilik sahte hasta verileri
const initialPatients: AdminPatient[] = [
  {
    id: "p1",
    firstName: "Zeynep",
    lastName: "Kurt",
    nationalId: "22222222222",
    bloodGroup: "A Rh(+)",
    heightCm: 165,
    weightKg: 58,
  },
  {
    id: "p2",
    firstName: "Mehmet",
    lastName: "Kara",
    nationalId: "33333333333",
    bloodGroup: "0 Rh(-)",
    heightCm: 178,
    weightKg: 82,
  },
  {
    id: "p3",
    firstName: "Ayşe",
    lastName: "Yıldız",
    nationalId: "44444444444",
    bloodGroup: "B Rh(+)",
    heightCm: 160,
    weightKg: 55,
  },
];

const AdminPatientManagementPage: React.FC<AdminPatientManagementPageProps> = ({
  onBack,
}) => {
  const [patients, setPatients] =
    useState<AdminPatient[]>(initialPatients);

  // arama kutusu
  const [filterText, setFilterText] = useState("");

  // yeni hasta ekleme formu
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newNationalId, setNewNationalId] = useState("");
  const [newBloodGroup, setNewBloodGroup] = useState("A Rh(+)");
  const [newHeightCm, setNewHeightCm] = useState<string>("");
  const [newWeightKg, setNewWeightKg] = useState<string>("");

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

    // formu temizle
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

      <h2 style={{ marginBottom: "8px" }}>Hasta Yönetimi</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Buradan sistemde kayıtlı hastaları görüntüleyebilir, filtreleyebilir ve
        yeni hasta kaydı oluşturabilirsiniz.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "24px",
        }}
      >
        {/* Sol: hasta listesi */}
        <div>
          <div
            style={{
              marginBottom: "10px",
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
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px 12px",
              maxHeight: "380px",
              overflowY: "auto",
              backgroundColor: "#f8f9fa",
            }}
          >
            {visiblePatients.map((p) => (
              <div
                key={p.id}
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
                      {p.firstName} {p.lastName}
                    </div>
                    <div style={{ fontSize: "12px", color: "#555" }}>
                      T.C.: {p.nationalId}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "13px", marginBottom: "4px" }}>
                  <div>
                    <strong>Kan Grubu:</strong> {p.bloodGroup}
                  </div>
                  <div>
                    <strong>Boy / Kilo:</strong> {p.heightCm} cm / {p.weightKg} kg
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
                    onClick={() => handleDeletePatient(p.id)}
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

            {visiblePatients.length === 0 && (
              <p style={{ color: "#777", fontSize: "14px" }}>
                Filtrenize göre hasta bulunamadı.
              </p>
            )}
          </div>
        </div>

        {/* Sağ: yeni hasta ekleme formu */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "12px 14px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Yeni Hasta Ekle</h3>

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
              Kan Grubu:
            </label>
            <select
              value={newBloodGroup}
              onChange={(e) => setNewBloodGroup(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                marginTop: "4px",
                boxSizing: "border-box",
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
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600 }}>
              Boy (cm):
              <input
                type="number"
                value={newHeightCm}
                onChange={(e) => setNewHeightCm(e.target.value)}
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
              Kilo (kg):
              <input
                type="number"
                value={newWeightKg}
                onChange={(e) => setNewWeightKg(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  marginTop: "4px",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>

          <button
            onClick={handleAddPatient}
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
            Hasta Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPatientManagementPage;
