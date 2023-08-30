import { v4 } from "uuid";

export const genRouteUUID = (): string => {
  return v4();
};
