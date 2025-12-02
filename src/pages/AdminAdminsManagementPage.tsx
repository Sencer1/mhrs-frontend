// src/pages/admin/AdminAdminsManagementPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { AdminUser } from "../types/domain";
// admin bilgilerini çekmek oluşturmak silmek için bu importu yaptık admin services den
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

  // Yeni admin formu
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchAdmins().then((data) => setAdmins(data));
  }, []);
// arama kısmına yazılan admin için filtreleme yapan kısım
  const visibleAdmins = useMemo(() => {
    const q = searchText.toLocaleLowerCase("tr-TR");
    if (!q) return admins;

    return admins.filter((admin) =>
      admin.username.toLocaleLowerCase("tr-TR").includes(q)
    );
  }, [admins, searchText]);
// buraası yeni admin eklemek için olan kısım
  const handleAddAdmin = async () => {
    if (!newUsername.trim() || !newPassword.trim()) return;
    
    // backend e post çağrısı gönderiyoruz burda 
    const created = await createAdmin(newUsername.trim(), newPassword.trim());
    // backend den gelen admin nesnesii listeye eklemek için
    setAdmins((prev) => [...prev, created]);
    

    setNewUsername("");
    setNewPassword("");
  };
  // admin silmek için  bu kısım
  const handleDeleteAdmin = async (username: string) => {
    await deleteAdmin(username);
    // silme olduktan sonra listeden çıkarmak için burası
    setAdmins((prev) => prev.filter((a) => a.username !== username));
    
  };

  return (
    <PageContainer>
      <BackButton onClick={onBack} />

      <h2 style={{ marginBottom: "8px" }}>Admin Kullanıcı Yönetimi</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Buradan sisteme erişimi olan admin kullanıcılarını görebilir, yeni admin
        ekleyebilir veya adminleri silebilirsiniz.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "24px",
        }}
      >
        {/* SOL TARAF — Admin Listesi */}
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
              placeholder="Kullanıcı adı içinde ara..."
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
                key={admin.username}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "8px 10px",
                  marginBottom: "8px",
                  backgroundColor: "white",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "14px" }}>
                  Kullanıcı adı: {admin.username}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "6px",
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
            ))}

            {visibleAdmins.length === 0 && (
              <p style={{ color: "#777", fontSize: "14px" }}>
                Filtrenize göre admin bulunamadı.
              </p>
            )}
          </div>
        </div>

        {/* SAĞ TARAF — Admin Ekleme Formu */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "12px 14px",
            minWidth: "320px",       
            boxSizing: "border-box",
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
                  maxWidth: "100%",
                  padding: "6px 8px",
                  marginTop: "4px",
                  border: "1px solid #ccc",  
                  borderRadius: "6px",       
                  outline: "none",           
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
                  maxWidth: "100%",
                  padding: "6px 8px",
                  marginTop: "4px",
                  border: "1px solid #ccc",  
                  borderRadius: "6px",       
                  outline: "none",           
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
