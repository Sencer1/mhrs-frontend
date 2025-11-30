import React, { useState } from "react";
import PageContainer from "../components/layout/PageContainer";

type DoctorInfo = {
  firstName: string;
  lastName: string;
  nationalId: string;
  hospitalName: string;
  departmentName: string;
};

type DoctorDashboardProps = {
  doctor: DoctorInfo;
  onOpenPastAppointments: () => void;
  onOpenFutureAppointments: () => void;
};

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctor,
  onOpenPastAppointments,
  onOpenFutureAppointments,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showAppointmentsMenu, setShowAppointmentsMenu] = useState(false);

  return (
    <PageContainer maxWidth={600}>
      <h1 style={{ marginBottom: "16px" }}>
        Hoş geldiniz, Dr. {doctor.firstName} {doctor.lastName}
      </h1>

      <ToggleCard
        title="Bilgilerim"
        isOpen={showInfo}
        onToggle={() => setShowInfo((prev) => !prev)}
      >
        <p>
          <strong>İsim:</strong> {doctor.firstName}
        </p>
        <p>
          <strong>Soyisim:</strong> {doctor.lastName}
        </p>
        <p>
          <strong>T.C. Numarası:</strong> {doctor.nationalId}
        </p>
        <p>
          <strong>Çalıştığı Hastane:</strong> {doctor.hospitalName}
        </p>
        <p>
          <strong>Departman:</strong> {doctor.departmentName}
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
