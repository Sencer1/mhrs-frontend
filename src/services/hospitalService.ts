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
