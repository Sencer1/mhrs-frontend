import axios from "axios";

export async function getCities() {
  const res = await axios.get("/api/cities");
  return res.data; // CityDto[]
}

export async function getHospitalsByCity(cityId: string) {
  const res = await axios.get("/api/hospitals", { params: { cityId } });
  return res.data; // HospitalDto[]
}

export async function getDepartmentsByHospital(hospitalId: string) {
  const res = await axios.get("/api/departments", { params: { hospitalId } });
  return res.data; // DepartmentDto[]
}

export async function getDoctorsByDepartment(departmentId: string) {
  const res = await axios.get("/api/doctors", { params: { departmentId } });
  return res.data; // DoctorDto[]
}

export async function getDoctorSlots(doctorId: string, date: string) {
  const res = await axios.get("/api/appointment-slots", {
    params: { doctorId, date },
  });
  return res.data; // AppointmentSlotDto[]
}

export async function createAppointment(payload: {
  patientNationalId: string;
  doctorId: string;
  dateTime: string; // ISO
}) {
  const res = await axios.post("/api/appointments", payload);
  return res.data;
}

export async function joinDoctorWaitingList(payload: {
  doctorId: string;
  patientNationalId: string;
}) {
  const res = await axios.post(
    `/api/waiting-list/doctor/${payload.doctorId}`,
    { patientNationalId: payload.patientNationalId }
  );
  return res.data;
}

export async function joinDepartmentWaitingList(payload: {
  departmentId: string;
  patientNationalId: string;
}) {
  const res = await axios.post(
    `/api/waiting-list/department/${payload.departmentId}`,
    { patientNationalId: payload.patientNationalId }
  );
  return res.data;
}
