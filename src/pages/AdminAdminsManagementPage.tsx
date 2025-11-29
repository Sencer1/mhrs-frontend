import React, { useMemo, useState } from "react";

type AdminAdminsManagementPageProps = {
  onBack: () => void;
};

type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  nationalId: string;
};

// Şimdilik mock admin listesi
const initialAdmins: AdminUser[] = [
  {
    id: "a1",
    firstName: "Sistem",
    lastName: "Yöneticisi",
    username: "admin",
    email: "admin@example.com",
    nationalId: "99999999999",
  },
  {
    id: "a2",
    firstName: "Ayşe",
    lastName: "Yönetici",
    username: "ayse.admin",
    email: "ayse.admin@example.com",
    nationalId: "88888888888",
  },
];

const AdminAdminsManagementPage: React.FC<AdminAdminsManagementPageProps> = ({
  onBack,
}) => {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);

  const [searchText, setSearchText] = useState("");

  // yeni admin ekleme formu için stateler
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newNationalId, setNewNationalId] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const visibleAdmins = useMemo(() => {
    const q = searchText.toLocaleLowerCase("tr-TR");
    if (!q) return admins;

    return admins.filter((admin) => {
      const text = (
        admin.firstName +
        " " +
        admin.lastName +
        " " +
        admin.username +
        " " +
        admin.email +
        " " +
        admin.nationalId
      ).toLocaleLowerCase("tr-TR");

      return text.includes(q);
    });
  }, [admins, searchText]);

  const handleAddAdmin = () => {
    if (
      !newFirstName.trim() ||
      !newLastName.trim() ||
      !newUsername.trim() ||
      !newEmail.trim() ||
      !newNationalId.trim() ||
      !newPassword.trim()
    ) {
      return;
    }

    const newAdmin: AdminUser = {
      id: `a${Date.now()}`,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      username: newUsername.trim(),
      email: newEmail.trim(),
      nationalId: newNationalId.trim(),
    };

    setAdmins((prev) => [...prev, newAdmin]);

    // formu temizle
    setNewFirstName("");
    setNewLastName("");
    setNewUsername("");
    setNewEmail("");
    setNewNationalId("");
    setNewPassword("");

    // Not: Şifreyi şu an sadece mock olarak istiyoruz.
    // Gerçek projede bu bilgi backend'e gönderilip hashlenerek saklanacak.
  };

  const handleDeleteAdmin = (id: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
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

      <h2 style={{ marginBottom: "8px" }}>Admin Kullanıcı Yönetimi</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Buradan sisteme erişimi olan admin kullanıcıları görebilir, yeni admin
        ekleyebilir veya yetkisini kaldırmak istediğiniz adminleri silebilirsiniz.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "24px",
        }}
      >
        {/* Sol: admin listesi */}
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
              placeholder="Ad, soyad, kullanıcı adı, e-posta veya T.C. içinde ara..."
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
            {visibleAdmins.map((admin) => (
              <div
                key={admin.id}
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
                      {admin.firstName} {admin.lastName}
                    </div>
                    <div style={{ fontSize: "12px", color: "#555" }}>
                      Kullanıcı adı: {admin.username}
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#555" }}>
                    T.C.: {admin.nationalId}
                  </div>
                </div>

                <div style={{ fontSize: "13px", marginBottom: "4px" }}>
                  <strong>E-posta:</strong> {admin.email}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "4px",
                  }}
                >
                  <button
                    onClick={() => handleDeleteAdmin(admin.id)}
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
                    Admini Sil
                  </button>
                </div>
              </div>
            ))}

            {visibleAdmins.length === 0 && (
              <p style={{ color: "#777", fontSize: "14px" }}>
                Filtrenize göre admin bulunamadı.
              </p>
            )}
          </div>
        </div>

        {/* Sağ: yeni admin ekleme formu */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "12px 14px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Yeni Admin Ekle</h3>

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
              Kullanıcı adı:
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
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
              E-posta:
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
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
              Şifre:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
            onClick={handleAddAdmin}
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
            Admin Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAdminsManagementPage;
