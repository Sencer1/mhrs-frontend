// src/pages/admin/AdminAdminsManagementPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { AdminUser } from "../types/domain";
import { fetchAdmins, createAdmin, deleteAdmin } from "../services/adminService";
import BackButton from "../components/common/BackButton";
import PageContainer from "../components/layout/PageContainer";

type AdminAdminsManagementPageProps = {
  onBack: () => void;
};

export const AdminAdminsManagementPage: React.FC<
  AdminAdminsManagementPageProps
> = ({ onBack }) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchText, setSearchText] = useState("");

  // yeni admin ekleme formu için stateler
  // yeni admin ekleme formu için stateler
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchAdmins()
      .then((data) => {
        // Backend'den id gelmezse username'i id olarak kullan
        const mappedData = data.map((a) => ({
          ...a,
          id: a.id || a.username,
        }));
        setAdmins(mappedData);
      })
      .catch((err) => {
        console.error(err);
        alert("Adminler yüklenirken hata oluştu.");
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleAdmins = useMemo(() => {
    const q = searchText.toLocaleLowerCase("tr-TR");
    if (!q) return admins;

    return admins.filter((admin) => {
      const text = admin.username.toLocaleLowerCase("tr-TR");

      return text.includes(q);
    });
  }, [admins, searchText]);

  const handleAddAdmin = () => {
    if (
      !newUsername.trim() ||
      !newPassword.trim()
    ) {
      return;
    }

    setLoading(true);
    // Backend POST /api/admin/users
    const newAdminPayload: AdminUser = {
      id: "", // Backend atayacak
      username: newUsername.trim(),
      // password alanı AdminUser tipinde yok, backend muhtemelen ayrı alıyor veya tip güncellenmeli.
      // Şimdilik AdminUser tipini güncellemeden gönderemeyiz, ancak backend bekliyorsa
      // payload'ı any veya genişletilmiş bir tip olarak gönderebiliriz.
      // Varsayım: Backend şifreyi de bekliyor.
      password: newPassword.trim(),
    } as AdminUser & { password?: string };

    createAdmin(newAdminPayload)
      .then((createdAdmin) => {
        setAdmins((prev) => [
          ...prev,
          { ...createdAdmin, id: createdAdmin.id || createdAdmin.username },
        ]);
        // formu temizle
        setNewUsername("");
        setNewPassword("");
      })
      .catch((err) => {
        console.error(err);
        alert("Admin eklenirken hata oluştu.");
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteAdmin = (username: string) => {
    if (!window.confirm("Bu admini silmek istediğinize emin misiniz?")) return;

    setLoading(true);
    deleteAdmin(username)
      .then(() => {
        setAdmins((prev) => prev.filter((a) => a.username !== username));
      })
      .catch((err) => {
        console.error(err);
        alert("Admin silinirken hata oluştu.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <PageContainer>
      <BackButton onClick={onBack} />

      <h2 style={{ marginBottom: "8px" }}>Admin Kullanıcı Yönetimi</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Buradan sisteme erişimi olan admin kullanıcıları görebilir, yeni admin
        ekleyebilir veya yetkisini kaldırmak istediğiniz adminleri
        silebilirsiniz.
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
              placeholder="Kullanıcı adı ara..."
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
            {loading && <p>Yükleniyor...</p>}
            {!loading && visibleAdmins.map((admin) => (
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
                      Kullanıcı adı: {admin.username}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "4px",
                    }}
                  >
                    <button
                      onClick={() => handleDeleteAdmin(admin.username)}
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
              </div>
            ))}

            {!loading && visibleAdmins.length === 0 && (
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
    </PageContainer>
  );
};
