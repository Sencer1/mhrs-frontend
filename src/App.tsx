// src/App.tsx
import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import PatientRegisterPage from "./pages/PatientRegisterPage";
import PatientDashboard from "./pages/PatientDashboard";
import PatientPastAppointmentsPage from "./pages/PatientPastAppointmentsPage";
import PatientFutureAppointmentsPage from "./pages/PatientFutureAppointmentsPage";
import PatientNewAppointmentPage from "./pages/PatientNewAppointmentPage";
import PatientWaitingListsPage from "./pages/PatientWaitingListsPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorPastAppointmentsPage from "./pages/DoctorPastAppointmentsPage";
import DoctorFutureAppointmentsPage from "./pages/DoctorFutureAppointmentsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHospitalManagementPage from "./pages/AdminHospitalManagementPage";
import AdminDoctorManagementPage from "./pages/AdminDoctorManagementPage";
import AdminAppointmentLogPage from "./pages/AdminAppointmentLogPage";
import AdminPatientManagementPage from "./pages/AdminPatientManagementPage";
import { AdminPrescriptionManagementPage } from "./pages/AdminPrescriptionManagementPage";
import { AdminWaitingListManagementPage } from "./pages/AdminWaitingListManagementPage";
import { AdminAdminsManagementPage } from "./pages/AdminAdminsManagementPage";

import { UserRole, PatientInfo, DoctorInfo } from "./types/domain";

type DoctorView =
  | "DOCTOR_HOME"
  | "DOCTOR_PAST_APPOINTMENTS"
  | "DOCTOR_FUTURE_APPOINTMENTS";

type PatientView =
  | "PATIENT_HOME"
  | "PATIENT_PAST_APPOINTMENTS"
  | "PATIENT_FUTURE_APPOINTMENTS"
  | "PATIENT_NEW_APPOINTMENT"
  | "PATIENT_WAITING_LISTS";

type AdminView =
  | "ADMIN_HOME"
  | "ADMIN_HOSPITALS"
  | "ADMIN_DOCTORS"
  | "ADMIN_APPOINTMENTS"
  | "ADMIN_PATIENTS"
  | "ADMIN_PRESCRIPTIONS"
  | "ADMIN_WAITING_LIST"
  | "ADMIN_ADMINS";

type AuthView = "LOGIN" | "REGISTER";

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [authView, setAuthView] = useState<AuthView>("LOGIN");

  const [doctorView, setDoctorView] = useState<DoctorView>("DOCTOR_HOME");
  const [patientView, setPatientView] = useState<PatientView>("PATIENT_HOME");
  const [adminView, setAdminView] = useState<AdminView>("ADMIN_HOME");

  const [currentPatient, setCurrentPatient] = useState<PatientInfo | null>(null);
  const [currentDoctor, setCurrentDoctor] = useState<DoctorInfo | null>(null);

  const handleLoginSuccess = (
    role: UserRole,
    payload?: { patient?: PatientInfo; doctor?: DoctorInfo }
  ) => {
    setUserRole(role);

    // name'i loginReal içinde localStorage'a yazmıştık
    const storedName = localStorage.getItem("name") ?? "";
    const [firstNameFromStore, ...rest] = storedName.split(" ");
    const lastNameFromStore = rest.join(" ");

    if (role === "PATIENT") {
      // LoginMock kullanıyorsan payload gelir, loginReal'de gelmez.
      // İkisini de desteklemek için payload varsa onu, yoksa minimum dummy objeyi kullanıyoruz.
      const basePatient: PatientInfo =
        payload?.patient ??
        ({
          firstName: firstNameFromStore || "",
          lastName: lastNameFromStore || "",
          nationalId: "",    // gerçek değer /patient/info'dan gelecek
          bloodGroup: "",
          heightCm: 0,
          weightKg: 0,
        } as PatientInfo);

      setCurrentPatient(basePatient);
      setPatientView("PATIENT_HOME");
    }

    if (role === "DOCTOR") {
      const baseDoctor: DoctorInfo =
        payload?.doctor ??
        ({
          firstName: firstNameFromStore || "",
          lastName: lastNameFromStore || "",
          nationalId: "",
          hospitalName: "",
          departmentName: "",
        } as DoctorInfo);

      setCurrentDoctor(baseDoctor);
      setDoctorView("DOCTOR_HOME");
    }

    if (role === "ADMIN") {
      setAdminView("ADMIN_HOME");
    }
  };

  const handleRegister = (patient: PatientInfo) => {
  alert("Kayıt başarılı, lütfen giriş yapınız.");
  setCurrentPatient(null);
  setUserRole(null);

  // Login ekranına dön
  setAuthView("LOGIN");
};

  // === Auth flow ===
  if (!userRole) {
    if (authView === "LOGIN") {
      return (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onOpenRegister={() => setAuthView("REGISTER")}
        />
      );
    }

    return (
      <PatientRegisterPage
        onBackToLogin={() => setAuthView("LOGIN")}
        onRegister={(p) => handleRegister(p)}
      />
    );
  }

  // === Doctor flow ===
  if (userRole === "DOCTOR" && currentDoctor) {
    if (doctorView === "DOCTOR_HOME") {
      return (
        <DoctorDashboard
          doctor={currentDoctor}
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
          doctor={currentDoctor}
          onBack={() => setDoctorView("DOCTOR_HOME")}
        />
      );
    }

    if (doctorView === "DOCTOR_FUTURE_APPOINTMENTS") {
      return (
        <DoctorFutureAppointmentsPage
          doctor={currentDoctor}
          onBack={() => setDoctorView("DOCTOR_HOME")}
        />
      );
    }
  }

  // === Patient flow ===
  if (userRole === "PATIENT" && currentPatient) {
    if (patientView === "PATIENT_HOME") {
      return (
        <PatientDashboard
          onOpenNewAppointment={() =>
            setPatientView("PATIENT_NEW_APPOINTMENT")
          }
          onOpenPastAppointments={() =>
            setPatientView("PATIENT_PAST_APPOINTMENTS")
          }
          onOpenFutureAppointments={() =>
            setPatientView("PATIENT_FUTURE_APPOINTMENTS")
          }
          onOpenWaitingLists={() =>
            setPatientView("PATIENT_WAITING_LISTS")
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
    if (patientView === "PATIENT_WAITING_LISTS"){
      return(
        <PatientWaitingListsPage
          patient={currentPatient}
          onBack={() => setPatientView("PATIENT_HOME")}
        />
      );
    }
    
  }


  // === Admin flow ===
  if (userRole === "ADMIN") {
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

  return (
    <div style={{ padding: "24px" }}>
      <h1>MHRS Frontend</h1>
      <p>Bu rol için ekran henüz tasarlanmadı.</p>
    </div>
  );
}

export default App;
