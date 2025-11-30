import React from "react";
import PageContainer from "../components/layout/PageContainer";

// Admin’in hangi ekrana gideceğini üst komponent (App.tsx) yönetiyor
type AdminDashboardProps = {
  onOpenHospitals: () => void;
  onOpenDoctors: () => void;
  onOpenAppointments: () => void;
  onOpenPatients: () => void;
  onOpenPrescriptions: () => void;
  onOpenWaitingList: () => void;
  onOpenAdmins: () => void;
};

// Şimdilik mock istatistikler, backend geldiğinde servis katmanına taşınır
const mockStats = {
  totalHospitals: 5,
  totalDepartments: 18,
  totalDoctors: 42,
  totalPatients: 1200,
  totalAppointments: 3500,
  totalActiveAppointments: 120,
  totalWaitingList: 15,
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
        <StatCard title="Toplam Hastane" value={mockStats.totalHospitals} />
        <StatCard title="Toplam Departman" value={mockStats.totalDepartments} />
        <StatCard title="Toplam Doktor" value={mockStats.totalDoctors} />
        <StatCard title="Toplam Hasta" value={mockStats.totalPatients} />
        <StatCard title="Toplam Randevu" value={mockStats.totalAppointments} />
        <StatCard
          title="Aktif Randevu"
          value={mockStats.totalActiveAppointments}
        />
        <StatCard
          title="Bekleme Listesindeki Hasta"
          value={mockStats.totalWaitingList}
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
          description="Hastane ekleme / silme, hastane içindeki departmanları ekleme / kaldırma işlemlerini yönetin."
          onClick={onOpenHospitals}
        />
        <MenuCard
          title="Doktor Yönetimi"
          description="Doktor ekleme / silme, doktorların hangi hastane ve departmanda çalıştığını yönetin."
          onClick={onOpenDoctors}
        />
        <MenuCard
          title="Randevu Kayıt Defteri"
          description="Geçmiş ve gelecek randevuları filtreleyerek görüntüleyin."
          onClick={onOpenAppointments}
        />
        <MenuCard
          title="Hasta Yönetimi"
          description="Tüm hastaların temel bilgilerini görüntüleyin, gerektiğinde yeni hasta kaydı oluşturun."
          onClick={onOpenPatients}
        />
        <MenuCard
          title="Reçete / İlaç Kayıtları"
          description="Yazılmış reçeteleri hasta, doktor veya ilaç adına göre inceleyin."
          onClick={onOpenPrescriptions}
        />
        <MenuCard
          title="Bekleme Listesi"
          description="Doktorların bekleme listesinde bulunan hastaları görüntüleyin."
          onClick={onOpenWaitingList}
        />
        <MenuCard
          title="Admin Kullanıcıları"
          description="Sisteme erişimi olan admin kullanıcıları görüntüleyin, yeni admin ekleyin veya kaldırın."
          onClick={onOpenAdmins}
        />
      </div>
    </PageContainer>
  );
};

type StatCardProps = {
  title: string;
  value: number;
};

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
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
    <div style={{ fontSize: "22px", fontWeight: 700 }}>{value}</div>
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
