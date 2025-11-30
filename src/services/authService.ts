import http from "./httpClient";
import { UserRole, PatientInfo, DoctorInfo } from "../types/domain";

type LoginResponse =
  | { role: "ADMIN" }
  | { role: "DOCTOR"; doctor: DoctorInfo }
  | { role: "PATIENT"; patient: PatientInfo };

// MOCK: replace with real HTTP later
export async function loginMock(
  nationalId: string,
  password: string
): Promise<LoginResponse> {
  const DOCTOR_TC = "1";
  const PATIENT_TC = "2";
  const ADMIN_TC = "9";
  const CORRECT_PASSWORD = "1234";
  const ADMIN_PASSWORD = "admin";

  if (nationalId === ADMIN_TC && password === ADMIN_PASSWORD) {
    return { role: "ADMIN" };
  }

  if (nationalId === DOCTOR_TC && password === CORRECT_PASSWORD) {
    return {
      role: "DOCTOR",
      doctor: {
        firstName: "Ahmet",
        lastName: "Yılmaz",
        nationalId: DOCTOR_TC,
        hospitalName: "Ankara Şehir Hastanesi",
        departmentName: "Kardiyoloji",
      },
    };
  }

  if (nationalId === PATIENT_TC && password === CORRECT_PASSWORD) {
    return {
      role: "PATIENT",
      patient: {
        firstName: "Zeynep",
        lastName: "Kurt",
        nationalId: "22222222222",
        bloodGroup: "A Rh(+)",
        heightCm: 165,
        weightKg: 58,
      },
    };
  }

  throw new Error("INVALID_CREDENTIALS");
}

// EXAMPLE real backend call signature for future:
// export async function login(nationalId: string, password: string): Promise<LoginResponse> {
//   const { data } = await http.post<LoginResponse>("/auth/login", { nationalId, password });
//   return data;
// }
