import http from "./httpClient";
import { WaitingListItem } from "../types/domain";

export async function getMyWaitingList(): Promise<WaitingListItem[]> {
  const response = await http.get<WaitingListItem[]>("/patient/waiting-list");
  return response.data;
}

