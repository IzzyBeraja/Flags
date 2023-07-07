import { useSetState } from "@mantine/hooks";
import { useMemo } from "react";

export type Results = Record<string, boolean>;

export type UserData = {
  userId: string | null;
  dob: Date | null;
  currentOS: string | null;
  employee: boolean | null;
  tester: boolean | null;
};

export type FlagResults = [
  userData: UserData,
  setUserData: (userData: UserData) => void,
  results: Results
];

export function useFlagResults(initialData: UserData): FlagResults {
  const [userData, setUserData] = useSetState<UserData>(initialData);

  const results = useMemo(
    () => ({
      rule1: userData.userId === "123",
      rule2: (userData.dob ?? new Date()) > new Date("01/01/2000"),
      rule3: userData.currentOS === "ios",
      rule4: userData.currentOS === "android",
      rule5: userData.employee === true,
      rule6: userData.tester === true,
    }),
    [userData]
  );

  return [userData, setUserData, results];
}
