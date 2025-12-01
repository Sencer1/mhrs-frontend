import http from "./httpClient";
import {
  PatientInfo,
  PatientPastAppointment,
  PatientFutureAppointment,
} from "../types/domain";

export async function getPatientInfo(): Promise<PatientInfo> {
  const { data } = await http.get<PatientInfo>("/patient/info");
  return data;
}

export async function getPastAppointments(): Promise<PatientPastAppointment[]> {
  const { data } = await http.get<PatientPastAppointment[]>(
    "/patient/past-appointments"
  );
  return data;
}

export async function getFutureAppointments(): Promise<PatientFutureAppointment[]> {
  const { data } = await http.get<PatientFutureAppointment[]>(
    "/patient/future-appointments"
  );
  return data;
}


export async function cancelAppointment(
  appointmentId: number
): Promise<void> {
  await http.post(`/patient/appointments/${appointmentId}/cancel`);
  return;
}

export async function registerPatient(
  payload: PatientInfo & { password: string }
): Promise<PatientInfo> {
  // const { data } = await http.post<PatientInfo>("/patients/register", payload);
  // return data;
  return payload;
}
