import http from "./httpClient";
import {
  AdminHospital,
  AdminDepartment,
  AdminDoctor,
  AdminPatient,
  AdminAppointment,
  AdminPrescription,
  AdminUser,
  AdminWaitingItem,
  AdminDashboardSummary
} from "../types/domain";

// --- MOCK DATA (eski admin sayfalarından taşındı) ---

const mockHospitals: AdminHospital[] = [
  { id: "h1", name: "Ankara Şehir Hastanesi", city: "Ankara", district: "Çankaya" },
  { id: "h2", name: "Ankara Eğitim ve Araştırma", city: "Ankara", district: "Altındağ" },
  { id: "h3", name: "İstanbul Şehir Hastanesi", city: "İstanbul", district: "Başakşehir" },
];

const mockDepartments: AdminDepartment[] = [
  { id: "d1", name: "Kardiyoloji", hospitalId: "h1" },
  { id: "d2", name: "Dahiliye", hospitalId: "h1" },
  { id: "d3", name: "Ortopedi", hospitalId: "h2" },
  { id: "d4", name: "Kardiyoloji", hospitalId: "h3" },
];

const mockDoctors: AdminDoctor[] = [
  {
    id: "doc1",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    nationalId: "10000000000",
    hospitalId: "h1",
    departmentId: "d1",
  },
  {
    id: "doc2",
    firstName: "Elif",
    lastName: "Demir",
    nationalId: "20000000000",
    hospitalId: "h1",
    departmentId: "d2",
  },
  {
    id: "doc3",
    firstName: "Mehmet",
    lastName: "Kara",
    nationalId: "30000000000",
    hospitalId: "h3",
    departmentId: "d4",
  },
];

const mockPatients: AdminPatient[] = [
  {
    id: "p1",
    firstName: "Zeynep",
    lastName: "Kurt",
    nationalId: "22222222222",
    bloodGroup: "A Rh(+)",
    heightCm: 165,
    weightKg: 58,
  },
];

const mockAppointments: AdminAppointment[] = [
  {
    id: 1,
    dateTime: "2025-10-10 09:30",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    doctorName: "Dr. Ahmet Yılmaz",
    patientName: "Zeynep Kurt",
    patientNationalId: "22222222222",
    status: "PAST",
    prescriptionText:
      "Hipertansiyon tanısı. Amlodipin 5 mg 1x1, yaşam tarzı değişikliği önerildi.",
  },
  {
    id: 2,
    dateTime: "2025-11-20 14:00",
    hospitalName: "Ankara Eğitim ve Araştırma",
    departmentName: "Dahiliye",
    doctorName: "Dr. Elif Demir",
    patientName: "Mehmet Öz",
    patientNationalId: "33333333333",
    status: "PAST",
    prescriptionText:
      "Gastrit tanısı. PPI tedavisi başlandı, kontrol 1 ay sonra.",
  },
  {
    id: 3,
    dateTime: "2025-12-05 11:15",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    doctorName: "Dr. Ahmet Yılmaz",
    patientName: "Zeynep Kurt",
    patientNationalId: "22222222222",
    status: "FUTURE",
  },
  {
    id: 4,
    dateTime: "2025-12-08 16:00",
    hospitalName: "İstanbul Şehir Hastanesi",
    departmentName: "Ortopedi",
    doctorName: "Dr. Mehmet Kara",
    patientName: "Ayşe Yılmaz",
    patientNationalId: "44444444444",
    status: "FUTURE",
  },
];

// Reçeteler (admin görünümü)
const mockAdminPrescriptions: AdminPrescription[] = [
  {
    id: "rx1",
    date: "2025-11-20",
    patientName: "Zeynep Kurt",
    doctorName: "Ahmet Yılmaz",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    medicines: ["Aspirin 100 mg", "Beloc ZOK 25 mg"],
  },
  {
    id: "rx2",
    date: "2025-11-22",
    patientName: "Mehmet Kara",
    doctorName: "Elif Demir",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Dahiliye",
    medicines: ["Metformin 850 mg"],
  },
  {
    id: "rx3",
    date: "2025-11-25",
    patientName: "Ayşe Yıldız",
    doctorName: "Mehmet Kara",
    hospitalName: "İstanbul Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    medicines: ["Atorvastatin 20 mg", "Ramipril 5 mg"],
  },
];

// Bekleme listesi (admin görünümü)
const mockAdminWaitingList: AdminWaitingItem[] = [
  {
    id: "w1",
    patientName: "Zeynep Kurt",
    patientNationalId: "22222222222",
    doctorName: "Dr. Ahmet Yılmaz",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    requestedDateTime: "2025-12-01 09:30",
  },
  {
    id: "w2",
    patientName: "Mehmet Kara",
    patientNationalId: "33333333333",
    doctorName: "Dr. Elif Demir",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Dahiliye",
    requestedDateTime: "2025-12-01 10:15",
  },
  {
    id: "w3",
    patientName: "Ayşe Yıldız",
    patientNationalId: "44444444444",
    doctorName: "Dr. Mehmet Kara",
    hospitalName: "İstanbul Şehir Hastanesi",
    departmentName: "Ortopedi",
    requestedDateTime: "2025-12-02 14:45",
  },
];

// Admin kullanıcılar
const mockAdmins: AdminUser[] = [
  {
    id: "a1",
    firstName: "Sistem",
    lastName: "Yöneticisi",
    username: "admin",
    email: "admin@example.com",
    nationalId: "99999999999",
  },
  {
    id: "a2",
    firstName: "Ayşe",
    lastName: "Yönetici",
    username: "ayse.admin",
    email: "ayse.admin@example.com",
    nationalId: "88888888888",
  },
];

// --- HOSPITAL / DEPARTMENT ---

export async function fetchAdminHospitals(): Promise<AdminHospital[]> {
  const { data } = await http.get<AdminHospital[]>("/admin/hospitals");
  return data;
}

export async function createAdminHospital(hospital: AdminHospital): Promise<AdminHospital> {
  const { data } = await http.post<AdminHospital>("/admin/hospitals", hospital);
  return data;
}

export async function deleteAdminHospital(id: string): Promise<void> {
  await http.delete(`/admin/hospitals/${id}`);
}

export async function fetchAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const { data } = await http.get<AdminDashboardSummary>("/admin/dashboardSummary");
  return data;
}

export async function fetchAdminDepartments(): Promise<AdminDepartment[]> {
  const { data } = await http.get<AdminDepartment[]>("/admin/departments");
  return data;
}

export async function createAdminDepartment(department: AdminDepartment): Promise<AdminDepartment> {
  const { data } = await http.post<AdminDepartment>("/admin/departments", department);
  return data;
}

export async function deleteAdminDepartment(id: string): Promise<void> {
  await http.delete(`/admin/departments/${id}`);
}

// --- DOCTORS ---

export async function fetchAdminDoctors(): Promise<AdminDoctor[]> {
  const { data } = await http.get<AdminDoctor[]>("/admin/doctors");
  return data;
}

export async function createAdminDoctor(doctor: AdminDoctor): Promise<AdminDoctor> {
  const { data } = await http.post<AdminDoctor>("/admin/doctors", doctor);
  return data;
}

export async function deleteAdminDoctor(id: string): Promise<void> {
  await http.delete(`/admin/doctors/${id}`);
}

// --- PATIENTS ---

export async function fetchAdminPatients(): Promise<AdminPatient[]> {
  const { data } = await http.get<AdminPatient[]>("/admin/patients");
  return data;
}

export async function createAdminPatient(patient: AdminPatient): Promise<AdminPatient> {
  const { data } = await http.post<AdminPatient>("/admin/patients", patient);
  return data;
}

export async function deleteAdminPatient(id: string): Promise<void> {
  await http.delete(`/admin/patients/${id}`);
}

// --- APPOINTMENTS LOG ---

export interface AppointmentFilterParams {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}

export async function fetchAdminAppointments(
  params: AppointmentFilterParams = {}
): Promise<AdminAppointment[]> {
  console.log("API Request -> GET /admin/appointments Params:", params);
  const { data } = await http.get<AdminAppointment[]>("/admin/appointments", {
    params,
  });
  return data;
}

export async function fetchAdminPrescriptions(): Promise<AdminPrescription[]> {
  const { data } = await http.get<AdminPrescription[]>("/admin/prescriptions");
  return data;
}

export async function deleteAdminPrescription(id: string): Promise<void> {
  await http.delete(`/admin/prescriptions/${id}`);
}

export async function fetchAdminWaitingList(): Promise<AdminWaitingItem[]> {
  const { data } = await http.get<AdminWaitingItem[]>("/admin/waiting-list");
  return data;
}

export async function deleteAdminWaitingItem(id: string): Promise<void> {
  await http.delete(`/admin/waiting-list/${id}`);
}

export async function fetchAdmins(): Promise<AdminUser[]> {
  const { data } = await http.get<AdminUser[]>("/admin/users");
  return data;
}

export async function createAdmin(admin: AdminUser): Promise<AdminUser> {
  const { data } = await http.post<AdminUser>("/admin/users", admin);
  return data;
}

export async function deleteAdmin(id: string): Promise<void> {
  await http.delete(`/admin/users/${id}`);
}
