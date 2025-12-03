import http from "./httpClient";

export type DepartmentDto = {
  departmentId: number;
  branchName: string;
  hospitalId: number; // backend bunu göndermiyor, biz frontend'de set ediyoruz
};

const BASE_PATH = "/department";

export async function getDepartmentsByHospital(hospitalId: string | number) {
  const res = await http.get<DepartmentDto[]>(`${BASE_PATH}/byHospital`, {
    params: { hospitalId },
  });
  return res.data;
}

export type CreateDepartmentPayload = {
  hospitalId: number;
  branchName: string;
};

export async function createDepartment(
  payload: CreateDepartmentPayload
): Promise<DepartmentDto> {
  const res = await http.post<DepartmentDto>(`${BASE_PATH}`, payload);
  return res.data;
}

export async function deleteDepartment(
  departmentId: number
): Promise<void> {
  await http.delete(`${BASE_PATH}/${departmentId}`);
}
