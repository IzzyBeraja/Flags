import type { Status } from "@components/Nodes/CardNode/CardNode";

export function boolToStatus(status: boolean | null): Status {
  if (status == null) return "error";
  return status ? "pass" : "fail";
}
