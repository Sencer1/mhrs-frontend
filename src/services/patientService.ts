import http from "./httpClient";
import {
  PatientInfo,
  PatientPastAppointment,
  PatientFutureAppointment,
} from "../types/domain";

// MOCK DATA for now
const mockPastAppointments: PatientPastAppointment[] = [
  {
    id: 1,
    dateTime: "2025-10-10T14:30:00",
    doctorName: "Dr. Ahmet Yılmaz",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    prescriptionText: "Tansiyon ilacı: günde 1 kez.",
  },
];

const mockFutureAppointments: PatientFutureAppointment[] = [
  {
    id: 1,
    dateTime: "2025-12-01T09:30:00",
    doctorName: "Dr. Ahmet Yılmaz",
    hospitalName: "Ankara Şehir Hastanesi",
    departmentName: "Kardiyoloji",
    isCancelled: false,
  },
];

export async function getPatientInfo(): Promise<PatientInfo> {
  const { data } = await http.get<PatientInfo>("/patient/info");
  return data;
}


export async function getPastAppointments(
  patientNationalId: string
): Promise<PatientPastAppointment[]> {
  // const { data } = await http.get<PatientPastAppointment[]>(`/appointments/past`, {
  //   params: { nationalId: patientNationalId },
  // });
  // return data;
  return mockPastAppointments;
}

export async function getFutureAppointments(
  patientNationalId: string
): Promise<PatientFutureAppointment[]> {
  // const { data } = await http.get<PatientFutureAppointment[]>(`/appointments/future`, {
  //   params: { nationalId: patientNationalId },
  // });
  // return data;
  return mockFutureAppointments;
}

export async function cancelAppointment(
  appointmentId: number
): Promise<void> {
  // await http.post(`/appointments/${appointmentId}/cancel`);
  return;
}

export async function registerPatient(
  payload: PatientInfo & { password: string }
): Promise<PatientInfo> {
  // const { data } = await http.post<PatientInfo>("/patients/register", payload);
  // return data;
  return payload;
}
