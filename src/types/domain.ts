export type UserRole = "DOCTOR" | "PATIENT" | "ADMIN";

export interface PatientInfo {
  firstName: string;
  lastName: string;
  nationalId: string; // T.C. Kimlik
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
}

export interface DoctorInfo {
  firstName: string;
  lastName: string;
  nationalId: string;
  hospitalName: string;
  departmentName: string;
}

export interface AppointmentBase {
  id: number;
  slotDateTime: string;  // ✔ DTO ile birebir uyumlu
  doctorFirstName: string;  // ✔
  doctorLastName: string;   // ✔
  hospitalName: string;
  departmentName: string;
}


export interface PatientPastAppointment extends AppointmentBase {
  prescriptionText: string | null;
}

export interface PatientFutureAppointment extends AppointmentBase {
  status: string;
}

export interface DoctorPastAppointment {
  id: number;
  dateTime: string;
  patientFirstName: string;
  patientLastName: string;
  prescriptionText: string;
}

export interface DoctorFutureAppointment {
  id: number;
  dateTime: string; // "2025-12-01T09:30:00"
  patientFirstName: string;
  patientLastName: string;
  status: string;
}

// Admin tarafı için temel tipler

export interface AdminHospital {
  id: string;
  name: string;
  city: string;
  district: string;
}

export interface AdminDepartment {
  id: string;
  name: string;
  hospitalId: string;
}

export interface AdminDoctor {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  hospitalId: string;
  departmentId: string;
}

export interface AdminPatient {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
}

export type AdminAppointmentStatus = "PAST" | "FUTURE" | "completed" | "cancelled" | "booked";

export interface AdminAppointment {
  id: number;
  dateTime: string;
  hospitalName: string;
  departmentName: string;
  doctorName: string;
  patientName: string;
  patientNationalId: string;
  status: AdminAppointmentStatus;
  prescriptionText?: string;
  slotDateTime?: string; // Fallback for dateTime
  date?: string; // Backend'den gelen olası tarih alanı
}

export interface AdminPrescription {
  id: string;
  date: string; // ISO date string: "2025-11-29"
  prescriptionDateTime?: string; // Backend'den gelen olası tarih alanı
  patientName: string;
  doctorName: string;
  hospitalName: string;
  departmentName: string;
  medicines: string[]; // ilaç isimleri
  drugs?: string[]; // Backend'den gelen olası ilaç listesi
}

export interface AdminWaitingItem {
  id: string;
  patientName: string;
  patientNationalId: string;
  doctorName: string;
  hospitalName: string;
  departmentName: string;
  requestedDateTime: string; // "2025-12-01 09:30"
}

export interface AdminUser {
  id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email?: string;
  nationalId?: string;
}

export type AdminDashboardSummary = {
  totalHospitals: number;
  totalDepartments: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  totalActiveAppointments: number;
  totalWaitingList: number;
};

export type BackendLoginResponse = {
  token: string;
  role: UserRole;
  firstName: string;
  lastName: string;
};

export type WaitingListItem = {
  departmentId: string | undefined;
  waitingId: number;
  level: string;
  doctorName: string;
  doctorNationalId: string;
  hospitalName: string;
  hospitalId: number;
  departmentName: string;
  patientName: string;
  patientNationalId: string;
  requestDateTime: string; // ISO string
};


