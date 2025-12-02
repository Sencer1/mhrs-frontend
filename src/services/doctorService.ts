// src/services/doctorService.ts
import http from "./httpClient";
import {
  DoctorFutureAppointment,
  DoctorInfo,
  DoctorPastAppointment,
} from "../types/domain";

// Eğer domain'e koymak istemezsen burada lokal type da tanımlayabilirsin:
export type DoctorListDto = {
  doctorNationalId: number;
  firstName: string;
  lastName: string;
  departmentId: number;
  hospitalId: number;
};

export type DoctorSlotDto = {
  appointmentId: number;
  slotDateTime: string; // ISO datetime
  status: string;       // EMPTY / BOOKED / CANCELLED vs.
};

// --- Doktor paneli API'leri ---

export async function getDoctorPastAppointments(): Promise<DoctorPastAppointment[]> {
  const { data } = await http.get<DoctorPastAppointment[]>(
    "/doctor/past-appointments"
  );
  return data;
}

export async function getDoctorFutureAppointments(): Promise<DoctorFutureAppointment[]> {
  const { data } = await http.get<DoctorFutureAppointment[]>(
    "/doctor/future-appointments"
  );
  return data;
}

export async function getDoctorInfo(): Promise<DoctorInfo> {
  const { data } = await http.get<DoctorInfo>("/doctor/info");
  return data;
}

export async function cancelDoctorAppointment(
  appointmentId: number
): Promise<void> {
  await http.post(`/doctor/appointments/${appointmentId}/cancel`);
  return;
}

// --- Hasta randevu ekranı için yeni API'ler ---

export async function getDoctorsByDepartment(
  departmentId: string | number
): Promise<DoctorListDto[]> {
  const { data } = await http.get<DoctorListDto[]>("/doctor/by-department", {
    params: { departmentId },
  });
  return data;
}

export async function getDoctorSlots(
  doctorNationalId: string | number,
  date: string // "YYYY-MM-DD"
): Promise<DoctorSlotDto[]> {
  const { data } = await http.get<DoctorSlotDto[]>("/doctor/slots", {
    params: { doctorNationalId, date },
  });
  return data;
}
