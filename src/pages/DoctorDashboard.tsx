import React, { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import { DoctorInfo } from "../types/domain";
import { getDoctorInfo } from "../services/doctorService";

type DoctorDashboardProps = {
  doctor: DoctorInfo; // login'den gelen temel bilgi (fallback)
  onOpenPastAppointments: () => void;
  onOpenFutureAppointments: () => void;
};

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctor,
  onOpenPastAppointments,
  onOpenFutureAppointments,
}) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showAppointmentsMenu, setShowAppointmentsMenu] = useState<boolean>(false);

  // Backend’ten gelen güncel doktor bilgisi
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await getDoctorInfo(); // GET /doctor/info (token'dan dokturu buluyor)
        if (isMounted) {
          setDoctorInfo(data);
        }
      } catch (err) {
        console.error("getDoctorInfo error:", err);
        // backend patlarsa login'den gelen prop'u kullan
        if (isMounted) {
          setDoctorInfo(doctor);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [doctor]);

  // Gösterilecek kaynak (backend varsa onu, yoksa props)
  const info: DoctorInfo = doctorInfo ?? doctor;

  if (loading) {
    return (
      <PageContainer maxWidth={600}>
        <h1>Doktor paneli</h1>
        <p>Yükleniyor...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth={600}>
      <h1 style={{ marginBottom: "16px" }}>
        Hoş geldiniz, Dr. {info.firstName} {info.lastName}
      </h1>

      <ToggleCard
        title="Bilgilerim"
        isOpen={showInfo}
        onToggle={() => setShowInfo((prev) => !prev)}
      >
        <p>
          <strong>İsim:</strong> {info.firstName}
        </p>
        <p>
          <strong>Soyisim:</strong> {info.lastName}
        </p>
        <p>
          <strong>T.C. Numarası:</strong> {info.nationalId}
        </p>
        <p>
          <strong>Çalıştığı Hastane:</strong> {info.hospitalName}
        </p>
        <p>
          <strong>Departman:</strong> {info.departmentName}
        </p>
      </ToggleCard>

      <ToggleCard
        title="Randevularım"
        isOpen={showAppointmentsMenu}
        onToggle={() => setShowAppointmentsMenu((prev) => !prev)}
      >
        <MenuItem onClick={onOpenPastAppointments}>
          Geçmiş Randevularım
        </MenuItem>
        <MenuItem onClick={onOpenFutureAppointments}>
          Gelecek Randevularım
        </MenuItem>
      </ToggleCard>
    </PageContainer>
  );
};

type ToggleCardProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

const ToggleCard: React.FC<ToggleCardProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => (
  <div style={{ marginBottom: "12px" }}>
    <div
      onClick={onToggle}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px 16px",
        cursor: "pointer",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "16px",
        fontWeight: 700,
      }}
    >
      <span>{title}</span>
      <span style={{ fontSize: "16px", fontWeight: 700 }}>
        {isOpen ? "▲" : "▼"}
      </span>
    </div>

    {isOpen && (
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: "8px",
          padding: "12px 16px",
          marginTop: "4px",
          backgroundColor: "#fafafa",
        }}
      >
        {children}
      </div>
    )}
  </div>
);

type MenuItemProps = {
  onClick: () => void;
  children: React.ReactNode;
};

const MenuItem: React.FC<MenuItemProps> = ({ onClick, children }) => (
  <div
    onClick={onClick}
    style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px 14px",
      marginBottom: "8px",
      cursor: "pointer",
      backgroundColor: "#ffffff",
    }}
  >
    {children}
  </div>
);

export default DoctorDashboard;
