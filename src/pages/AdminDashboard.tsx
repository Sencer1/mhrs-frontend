import React, { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import { fetchAdminDashboardSummary } from "../services/adminService";
import { AdminDashboardSummary } from "../types/domain";

type AdminDashboardProps = {
  onOpenHospitals: () => void;
  onOpenDoctors: () => void;
  onOpenAppointments: () => void;
  onOpenPatients: () => void;
  onOpenPrescriptions: () => void;
  onOpenWaitingList: () => void;
  onOpenAdmins: () => void;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenHospitals,
  onOpenDoctors,
  onOpenAppointments,
  onOpenPatients,
  onOpenPrescriptions,
  onOpenWaitingList,
  onOpenAdmins,
}) => {
  // Backend’den gelecek veriyi state’e koyuyoruz
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] =  useState(true);

   useEffect(() => {
    fetchAdminDashboardSummary()
      .then((data) => setSummary(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer>
      <h1 style={{ marginBottom: "8px" }}>Admin Paneli</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Sistem genel durumunu buradan görebilir; hastane, departman, doktor,
        hasta, randevu, bekleme listesi, reçete ve admin kullanıcı yönetimi
        işlemlerini yapabilirsiniz.
      </p>

      {/* İstatistik kartları */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          title="Toplam Hastane"
          value={summary?.totalHospitals ?? 0}
          loading={loading}
        />
        <StatCard
          title="Toplam Departman"
          value={summary?.totalDepartments ?? 0}
          loading={loading}
        />
        <StatCard
          title="Toplam Doktor"
          value={summary?.totalDoctors ?? 0}
          loading={loading}
        />
        <StatCard
          title="Toplam Hasta"
          value={summary?.totalPatients ?? 0}
          loading={loading}
        />
        <StatCard
          title="Toplam Randevu"
          value={summary?.totalAppointments ?? 0}
          loading={loading}
        />
        <StatCard
          title="Aktif Randevu"
          value={summary?.totalActiveAppointments ?? 0}
          loading={loading}
        />
        <StatCard
          title="Bekleme Listesindeki Hasta"
          value={summary?.totalWaitingList ?? 0}
          loading={loading}
        />
      </div>

      {/* Yönetim menüsü */}
      <h2 style={{ marginBottom: "16px" }}>Yönetim Menüsü</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "16px",
        }}
      >
        <MenuCard
          title="Hastane / Departman Yönetimi"
          description="Hastane ekleme / silme, departman yönetimi."
          onClick={onOpenHospitals}
        />
        <MenuCard
          title="Doktor Yönetimi"
          description="Doktor ekleme / silme, atama işlemleri."
          onClick={onOpenDoctors}
        />
        <MenuCard
          title="Randevu Kayıt Defteri"
          description="Geçmiş ve gelecek randevuları görüntüleyin."
          onClick={onOpenAppointments}
        />
        <MenuCard
          title="Hasta Yönetimi"
          description="Hasta bilgilerini ve kayıtlarını yönetin."
          onClick={onOpenPatients}
        />
        <MenuCard
          title="Reçete / İlaç Kayıtları"
          description="Reçeteleri inceleyin."
          onClick={onOpenPrescriptions}
        />
        <MenuCard
          title="Bekleme Listesi"
          description="Bekleme listelerinde bulunan hastaları takip edin."
          onClick={onOpenWaitingList}
        />
        <MenuCard
          title="Admin Kullanıcıları"
          description="Admin hesaplarını yönetin."
          onClick={onOpenAdmins}
        />
      </div>
    </PageContainer>
  );
};

type StatCardProps = {
  title: string;
  value: number;
  loading?: boolean;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, loading }) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "12px 16px",
      backgroundColor: "#f8f9fa",
    }}
  >
    <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>
      {title}
    </div>
    <div style={{ fontSize: "22px", fontWeight: 700 }}>
      {loading ? "…" : value}
    </div>
  </div>
);

type MenuCardProps = {
  title: string;
  description: string;
  onClick: () => void;
};

const MenuCard: React.FC<MenuCardProps> = ({ title, description, onClick }) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "16px",
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div>
      <h3 style={{ margin: 0, marginBottom: "8px" }}>{title}</h3>
      <p style={{ margin: 0, color: "#555", fontSize: "14px" }}>{description}</p>
    </div>
    <button
      onClick={onClick}
      style={{
        marginTop: "12px",
        alignSelf: "flex-start",
        padding: "6px 12px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#0d6efd",
        color: "white",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      Yönetim ekranına git
    </button>
  </div>
);

export default AdminDashboard;