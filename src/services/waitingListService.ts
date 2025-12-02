import http from "./httpClient";
import { WaitingListItem } from "../types/domain";

export async function getPatientWaitingList(): Promise<WaitingListItem[]> {
  const response = await http.get<WaitingListItem[]>("/patient/waiting-list");
  return response.data;
}

export async function getDoctorWaitingList(): Promise<WaitingListItem[]> {
    const response = await http.get<WaitingListItem[]>("/doctor/waiting-list");
    return response.data;
}

export async function joinDoctorWaitingList(doctorId: string) {
  await http.post(`/waiting-list/doctor/${doctorId}`);
}

export async function joinDepartmentWaitingList(departmentId: number) {
  await http.post(`/waiting-list/department/${departmentId}`);
}