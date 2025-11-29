import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorPastAppointmentsPage from "./pages/DoctorPastAppointmentsPage";
import DoctorFutureAppointmentsPage from "./pages/DoctorFutureAppointmentsPage";
import PatientDashboard from "./pages/PatientDashboard";
import PatientPastAppointmentsPage from "./pages/PatientPastAppointmentsPage";
import PatientFutureAppointmentsPage from "./pages/PatientFutureAppointmentsPage";
import PatientNewAppointmentPage from "./pages/PatientNewAppointmentPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHospitalManagementPage from "./pages/AdminHospitalManagementPage";
import AdminDoctorManagementPage from "./pages/AdminDoctorManagementPage";
import AdminAppointmentLogPage from "./pages/AdminAppointmentLogPage";
import AdminPatientManagementPage from "./pages/AdminPatientManagementPage";
import AdminPrescriptionManagementPage from "./pages/AdminPrescriptionManagementPage";
import AdminWaitingListManagementPage from "./pages/AdminWaitingListManagementPage";
import AdminAdminsManagementPage from "./pages/AdminAdminsManagementPage";
import PatientRegisterPage from "./pages/PatientRegisterPage";

// doktorda açılan sayfalar
type DoctorView =
  | "DOCTOR_HOME"
  | "DOCTOR_PAST_APPOINTMENTS"
  | "DOCTOR_FUTURE_APPOINTMENTS";

// hasta için açılan sayfalar
type PatientView =
  | "PATIENT_HOME"
  | "PATIENT_PAST_APPOINTMENTS"
  | "PATIENT_FUTURE_APPOINTMENTS"
  | "PATIENT_NEW_APPOINTMENT";

// admin için açılan sayfalar
type AdminView =
  | "ADMIN_HOME"
  | "ADMIN_HOSPITALS"
  | "ADMIN_DOCTORS"
  | "ADMIN_APPOINTMENTS"
  | "ADMIN_PATIENTS"
  | "ADMIN_PRESCRIPTIONS"
  | "ADMIN_WAITING_LIST"
  | "ADMIN_ADMINS";

// giriş mi kayıt mı
type AuthView = "LOGIN" | "REGISTER";

// hasta bilgisi tipi
type PatientInfo = {
  firstName: string;
  lastName: string;
  nationalId: string;
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
};

// başlangıçta var saydığımız örnek hasta
const initialPatient: PatientInfo = {
  firstName: "Zeynep",
  lastName: "Kurt",
  nationalId: "22222222222",
  bloodGroup: "A Rh(+)",
  heightCm: 165,
  weightKg: 58,
};

function App() {
  // sahte doktor giriş bilgileri
  const fakeDoctor = {
    firstName: "Ahmet",
    lastName: "Yılmaz",
    nationalId: "1",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Kardiyoloji",
  };

  // hangi kullanıcı türüyle giriş yapıldı
  const [userType, setUserType] = useState<
    "DOCTOR" | "PATIENT" | "ADMIN" | null
  >(null);

  // doktor/hasta/admin view stateleri
  const [doctorView, setDoctorView] = useState<DoctorView>("DOCTOR_HOME");
  const [patientView, setPatientView] = useState<PatientView>("PATIENT_HOME");
  const [adminView, setAdminView] = useState<AdminView>("ADMIN_HOME");

  // giriş mi, kayıt ekranı mı?
  const [authView, setAuthView] = useState<AuthView>("LOGIN");

  // şu anki aktif hasta (login olan ya da kayıt olan kişi)
  const [currentPatient, setCurrentPatient] =
    useState<PatientInfo>(initialPatient);

  // LoginPage başarılı olunca çalışacak fonksiyon
  const handleLogin = (type: "DOCTOR" | "PATIENT" | "ADMIN") => {
    setUserType(type);

    if (type === "DOCTOR") {
      setDoctorView("DOCTOR_HOME");
    } else if (type === "PATIENT") {
      setPatientView("PATIENT_HOME");
    } else if (type === "ADMIN") {
      setAdminView("ADMIN_HOME");
    }
  };

  // Kayıt ekranında form başarıyla dolduğunda
  const handleRegister = (patient: PatientInfo) => {
    setCurrentPatient(patient);
    setUserType("PATIENT");
    setPatientView("PATIENT_HOME");
  };

  // Eğer henüz userType yoksa login / register ekranları
  if (!userType) {
    if (authView === "LOGIN") {
      return (
        <LoginPage
          onLoginSuccess={handleLogin}
          onOpenRegister={() => setAuthView("REGISTER")}
        />
      );
    }

    return (
      <PatientRegisterPage
        onBackToLogin={() => setAuthView("LOGIN")}
        onRegister={handleRegister}
      />
    );
  }

  // ==== DOKTOR EKRANLARI ====
  if (userType === "DOCTOR") {
    if (doctorView === "DOCTOR_HOME") {
      return (
        <DoctorDashboard
          doctor={fakeDoctor}
          onOpenPastAppointments={() =>
            setDoctorView("DOCTOR_PAST_APPOINTMENTS")
          }
          onOpenFutureAppointments={() =>
            setDoctorView("DOCTOR_FUTURE_APPOINTMENTS")
          }
        />
      );
    }

    if (doctorView === "DOCTOR_PAST_APPOINTMENTS") {
      return (
        <DoctorPastAppointmentsPage
          doctor={fakeDoctor}
          onBack={() => setDoctorView("DOCTOR_HOME")}
        />
      );
    }

    if (doctorView === "DOCTOR_FUTURE_APPOINTMENTS") {
      return (
        <DoctorFutureAppointmentsPage
          doctor={fakeDoctor}
          onBack={() => setDoctorView("DOCTOR_HOME")}
        />
      );
    }
  }

  // ==== HASTA EKRANLARI ====
  if (userType === "PATIENT") {
    if (patientView === "PATIENT_HOME") {
      return (
        <PatientDashboard
          patient={currentPatient}
          onOpenNewAppointment={() =>
            setPatientView("PATIENT_NEW_APPOINTMENT")
          }
          onOpenPastAppointments={() =>
            setPatientView("PATIENT_PAST_APPOINTMENTS")
          }
          onOpenFutureAppointments={() =>
            setPatientView("PATIENT_FUTURE_APPOINTMENTS")
          }
        />
      );
    }

    if (patientView === "PATIENT_PAST_APPOINTMENTS") {
      return (
        <PatientPastAppointmentsPage
          patient={currentPatient}
          onBack={() => setPatientView("PATIENT_HOME")}
        />
      );
    }

    if (patientView === "PATIENT_NEW_APPOINTMENT") {
      return (
        <PatientNewAppointmentPage
          onBack={() => setPatientView("PATIENT_HOME")}
        />
      );
    }

    if (patientView === "PATIENT_FUTURE_APPOINTMENTS") {
      return (
        <PatientFutureAppointmentsPage
          patient={currentPatient}
          onBack={() => setPatientView("PATIENT_HOME")}
        />
      );
    }
  }

  // ==== ADMIN EKRANLARI ====
  if (userType === "ADMIN") {
    if (adminView === "ADMIN_HOME") {
      return (
        <AdminDashboard
          onOpenHospitals={() => setAdminView("ADMIN_HOSPITALS")}
          onOpenDoctors={() => setAdminView("ADMIN_DOCTORS")}
          onOpenAppointments={() => setAdminView("ADMIN_APPOINTMENTS")}
          onOpenPatients={() => setAdminView("ADMIN_PATIENTS")}
          onOpenPrescriptions={() => setAdminView("ADMIN_PRESCRIPTIONS")}
          onOpenWaitingList={() => setAdminView("ADMIN_WAITING_LIST")}
          onOpenAdmins={() => setAdminView("ADMIN_ADMINS")}
        />
      );
    }

    if (adminView === "ADMIN_HOSPITALS") {
      return (
        <AdminHospitalManagementPage
          onBack={() => setAdminView("ADMIN_HOME")}
        />
      );
    }

    if (adminView === "ADMIN_DOCTORS") {
      return (
        <AdminDoctorManagementPage
          onBack={() => setAdminView("ADMIN_HOME")}
        />
      );
    }

    if (adminView === "ADMIN_APPOINTMENTS") {
      return (
        <AdminAppointmentLogPage
          onBack={() => setAdminView("ADMIN_HOME")}
        />
      );
    }

    if (adminView === "ADMIN_PATIENTS") {
      return (
        <AdminPatientManagementPage
          onBack={() => setAdminView("ADMIN_HOME")}
        />
      );
    }

    if (adminView === "ADMIN_PRESCRIPTIONS") {
      return (
        <AdminPrescriptionManagementPage
          onBack={() => setAdminView("ADMIN_HOME")}
        />
      );
    }

    if (adminView === "ADMIN_WAITING_LIST") {
      return (
        <AdminWaitingListManagementPage
          onBack={() => setAdminView("ADMIN_HOME")}
        />
      );
    }

    if (adminView === "ADMIN_ADMINS") {
      return (
        <AdminAdminsManagementPage
          onBack={() => setAdminView("ADMIN_HOME")}
        />
      );
    }
  }

  // buraya normalde düşmemesi lazım ama fallback olarak kalsın
  return (
    <div style={{ padding: "24px" }}>
      <h1>MHRS Frontend</h1>
      <p>Bu rol için ekran henüz tasarlanmadı.</p>
    </div>
  );
}

export default App;
