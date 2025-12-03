import http from "./httpClient";

export type CityDto = string;

export type HospitalDto = {
  hospitalId: number;
  name: string;
  city: string;
  district: string;
  streetAddress: string;
  phoneNumber: string;
};

const BASE_PATH = "/hospital";

export async function getCities(): Promise<CityDto[]> {
  const res = await http.get<CityDto[]>(`${BASE_PATH}/cities`);
  return res.data;
}

export async function searchHospitals(options: {
  city: string;
  district?: string | null;
}): Promise<HospitalDto[]> {
  const params: Record<string, string> = { city: options.city };
  if (options.district) {
    params.district = options.district;
  }

  const res = await http.get<HospitalDto[]>(`${BASE_PATH}/search`, {
    params,
  });
  return res.data;
}

// Admin paneli için: DB'deki tüm hastaneleri getir
export async function getAllHospitals(): Promise<HospitalDto[]> {
  const res = await http.get<HospitalDto[]>(`${BASE_PATH}/all`);
  return res.data;
}

export type CreateHospitalPayload = {
  name: string;
  city: string;
  district?: string;
  streetAddress?: string;
  phoneNumber?: string;
};

export async function createHospital(
  payload: CreateHospitalPayload
): Promise<HospitalDto> {
  const res = await http.post<HospitalDto>(`${BASE_PATH}`, payload);
  return res.data;
}
