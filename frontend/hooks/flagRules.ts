import { useForceUpdate, useSetState } from "@mantine/hooks";
import { useEffect, useState } from "react";

export type Results = Record<string, boolean>;

export type UserData = {
  userId: string | null;
  dob: Date | null;
  currentOS: string | null;
  employee: boolean | null;
  tester: boolean | null;
};

export type UseFlagResults = [
  userData: UserData,
  setUserData: (userData: UserData) => void,
  results: FlagMap
];

export type FlagMap = Map<string, FlagRule>;

export type FlagRule = {
  id: string;
  label: string;
  description: string;
  rule: (userData: UserData) => boolean;
  result?: boolean;
};

export const initialRules = new Map<string, FlagRule>([
  [
    "rule1",
    {
      description: "User ID is 123",
      id: "rule1",
      label: "User ID",
      rule: (userData: UserData) => userData.userId === "123",
    },
  ],
  [
    "rule2",
    {
      description: "User is over 21",
      id: "rule2",
      label: "User Age",
      rule: (userData: UserData) =>
        (userData.dob ?? new Date()) > new Date("01/01/2000"),
    },
  ],
  [
    "rule3",
    {
      description: "User is on iOS",
      id: "rule3",
      label: "On iOS",
      rule: (userData: UserData) => userData.currentOS === "ios",
    },
  ],
  [
    "rule4",
    {
      description: "User is on Android",
      id: "rule4",
      label: "On Android",
      rule: (userData: UserData) => userData.currentOS === "android",
    },
  ],
  [
    "rule5",
    {
      description: "User is an employee",
      id: "rule5",
      label: "Is Employee",
      rule: (userData: UserData) => userData.employee === true,
    },
  ],
  [
    "rule6",
    {
      description: "User is a tester",
      id: "rule6",
      label: "Is Tester",
      rule: (userData: UserData) => userData.tester === true,
    },
  ],
]);

export function useFlagResults(
  initialData: UserData,
  initialRules?: FlagMap
): UseFlagResults {
  const [userData, setUserData] = useSetState<UserData>(initialData);
  const [rulesMap] = useState<FlagMap>(initialRules ?? new Map());
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    rulesMap.forEach((value, key) => {
      rulesMap.set(key, { ...value, result: value.rule(userData) });
    });
    forceUpdate();
  }, [userData]);

  return [userData, setUserData, rulesMap];
}

/**
 rule1: userData.userId === "123",
  rule2: (userData.dob ?? new Date()) > new Date("01/01/2000"),
  rule3: userData.currentOS === "ios",
  rule4: userData.currentOS === "android",
  rule5: userData.employee === true,
  rule6: userData.tester === true,
 */
