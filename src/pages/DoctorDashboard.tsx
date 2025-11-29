import React, { useState } from "react";

type DoctorInfo = {
  firstName: string;
  lastName: string;
  nationalId: string;
  hospitalName: string;
  departmentName: string;
};
//doktor bilgileri ve geçmiş geleecek randuvlar için
type DoctorDashboardProps = {
  doctor: DoctorInfo;
  onOpenPastAppointments: () => void;
  onOpenFutureAppointments: () => void;
};

// giiriş yapan doktorun bilgilerini gösterecek burası
const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ doctor, onOpenPastAppointments, onOpenFutureAppointments }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showAppointmentsMenu, setShowAppointmentsMenu] = useState(false);

// bilgilerim ksımı için burası
  const handleBilgilerimClick = () => {
    setShowInfo((prev) => !prev); // açık ise kapat, kapalı ise aç
  };
// randular sekmesine tıklanınca
  const handleRandevularimClick = () => {
  setShowAppointmentsMenu((prev) => !prev);
};


  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "24px auto" }}>

        {/* Hoş geldiniz yazısı */}
        <h1 style={{ marginBottom: "16px" }}>
        Hoş geldiniz, Dr. {doctor.firstName} {doctor.lastName}
        </h1>

        {/* Bilgilerim kutusu */}
        <div
        onClick={handleBilgilerimClick}
        style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "8px",
            cursor: "pointer",
            backgroundColor: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "700",
        }}
        >
        <span>Bilgilerim</span>
        <span style={{
            fontSize: "16px",
            fontWeight: "700",
            display:"flex",
            alignItems:"center",
        }}>
            {showInfo ? "▲" : "▼"}
        </span>
        </div>

        {/* Bilgilerim paneli (açılır/kapanır) */}
        {showInfo && (
        <div
            style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "16px",
            }}
        >
            <p><strong>İsim:</strong> {doctor.firstName}</p>
            <p><strong>Soyisim:</strong> {doctor.lastName}</p>
            <p><strong>T.C. Numarası:</strong> {doctor.nationalId}</p>
            <p><strong>Çalıştığı Hastane:</strong> {doctor.hospitalName}</p>
            <p><strong>Departman:</strong> {doctor.departmentName}</p>
        </div>
        )}

        {/* Randevularım kutusu */}
        <div
        onClick={handleRandevularimClick}
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
            fontWeight: "700",
            color: "#000",
            opacity: showAppointmentsMenu ? 0.8 : 1,
            transition: "0.2s",
        }}
        >
        <span>Randevularım</span>
        <span style={{
            fontSize: "16px",
            fontWeight:"700",
            display:"flex",
            alignItems:"center",
        }}>
            {showAppointmentsMenu ? "▲" : "▼"}
        </span>
        </div>

        {/* Randevularım paneli (açılır/kapanır) */}
        {showAppointmentsMenu && (
        <div style={{ marginTop: "8px" }}>
            <div
            onClick={onOpenPastAppointments}
            style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "8px",
                cursor: "pointer",
                backgroundColor: "#fafafa",
            }}
            >
            Geçmiş Randevularım
            </div>
            <div
            onClick={onOpenFutureAppointments}
            style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px 14px",
                cursor: "pointer",
                backgroundColor: "#fafafa",
            }}
            >
            Gelecek Randevularım
            </div>
        </div>
        )}

    </div>
    );

};

export default DoctorDashboard;
