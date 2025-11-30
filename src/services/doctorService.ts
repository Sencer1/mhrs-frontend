import http from "./httpClient";
import {
  DoctorFutureAppointment,
  DoctorPastAppointment,
} from "../types/domain";

// --- MOCK DATA (eski komponetlerden taşındı) ---

const mockPastAppointments: DoctorPastAppointment[] = [
  {
    id: 1,
    dateTime: "2025-11-20 14:30",
    patientFirstName: "Mehmet",
    patientLastName: "Demir",
    prescriptionText: "Tansiyon ilacı: günde 1 kez, sabah kahvaltıdan sonra.",
  },
  {
    id: 2,
    dateTime: "2025-11-18 10:00",
    patientFirstName: "Ayşe",
    patientLastName: "Kaya",
    prescriptionText: "Ağrı kesici: ağrı oldukça, günde en fazla 3 kez.",
  },
  {
    id: 3,
    dateTime: "2025-11-15 09:15",
    patientFirstName: "Fatma",
    patientLastName: "Yıldız",
    prescriptionText: "Antibiyotik: 7 gün boyunca, günde 2 kez.",
  },
];

const mockFutureAppointments: DoctorFutureAppointment[] = [
  {
    id: 1,
    dateTime: "2025-12-01 09:30",
    patientFirstName: "Deniz",
    patientLastName: "Kara",
    isCancelled: false,
  },
  {
    id: 2,
    dateTime: "2025-12-02 11:00",
    patientFirstName: "Selin",
    patientLastName: "Arslan",
    isCancelled: false,
  },
  {
    id: 3,
    dateTime: "2025-12-03 15:15",
    patientFirstName: "Oğuz",
    patientLastName: "Çelik",
    isCancelled: false,
  },
];

// --- API-like fonksiyonlar ---

export async function getDoctorPastAppointments(
  doctorNationalId: string
): Promise<DoctorPastAppointment[]> {
  // const { data } = await http.get<DoctorPastAppointment[]>(`/doctors/${doctorNationalId}/appointments/past`);
  // return data;
  return mockPastAppointments;
}

export async function getDoctorFutureAppointments(
  doctorNationalId: string
): Promise<DoctorFutureAppointment[]> {
  // const { data } = await http.get<DoctorFutureAppointment[]>(`/doctors/${doctorNationalId}/appointments/future`);
  // return data;
  return mockFutureAppointments;
}

export async function cancelDoctorAppointment(
  appointmentId: number
): Promise<void> {
  // await http.post(`/doctors/appointments/${appointmentId}/cancel`);
  return;
}
