import http, { setAuthToken } from "./httpClient";
import { UserRole, PatientInfo, DoctorInfo, BackendLoginResponse } from "../types/domain";

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

// ARTIK GERÇEK BACKEND LOGIN
export async function loginReal(
  role: UserRole,
  idOrUsername: string,
  password: string
): Promise<BackendLoginResponse> {
  // Backend LoginRequest DTO'suna göre body hazırlıyoruz:
  //  PATIENT/DOCTOR: nationalId (long) + userType
  //  ADMIN: username (string) + userType

  let body: any;

  if (role === "ADMIN") {
    // admin girişi: idOrUsername = "admin" gibi
    body = {
      userType: "ADMIN",
      username: idOrUsername,
      nationalId: null,
      password,
    };
  } else {
    // hasta/doktor girişi: idOrUsername = TCKN string
    const nationalIdNum = Number(idOrUsername);
    if (!nationalIdNum || Number.isNaN(nationalIdNum)) {
      throw new Error("Geçerli bir TCKN girilmedi");
    }

    body = {
      userType: role,        // "PATIENT" veya "DOCTOR"
      nationalId: nationalIdNum,
      username: null,
      password,
    };
  }

  // Backend'e isteği at
  const { data } = await http.post<BackendLoginResponse>("/auth/login", body);

  // Token'ı localStorage'a kaydet
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("name", `${data.firstName} ${data.lastName}`.trim());

  setAuthToken(data.token);

  return data;
}

// EXAMPLE real backend call signature for future:
// export async function login(nationalId: string, password: string): Promise<LoginResponse> {
//   const { data } = await http.post<LoginResponse>("/auth/login", { nationalId, password });
//   return data;
// }
