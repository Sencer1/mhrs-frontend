import http from "./httpClient";

export type DepartmentDto = {
  departmentId: number;
  branchName: string;
  hospitalId: number;
};

const BASE_PATH = "/department";

export async function getDepartmentsByHospital(hospitalId: string | number) {
  const res = await http.get<DepartmentDto[]>(`${BASE_PATH}/byHospital`, {
    params: { hospitalId },
  });
  return res.data;
}
