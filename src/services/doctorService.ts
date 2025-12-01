import http from "./httpClient";
import {
  DoctorFutureAppointment,
  DoctorPastAppointment,
} from "../types/domain";

// --- API-like fonksiyonlar ---

export async function getDoctorPastAppointments(
): Promise<DoctorPastAppointment[]> {
  const { data } = await http.get<DoctorPastAppointment[]>('/doctor/past-appointments');
  return data;
}

export async function getDoctorFutureAppointments(
): Promise<DoctorFutureAppointment[]> {
  const { data } = await http.get<DoctorFutureAppointment[]>('/doctor/future-appointments');
  return data;
}

export async function cancelDoctorAppointment(
  appointmentId: number
): Promise<void> {
  // await http.post(`/doctors/appointments/${appointmentId}/cancel`);
  return;
}
