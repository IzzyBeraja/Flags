import type { UserData } from "@hooks/flagRules";

import { Accordion, Checkbox, Select, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useCallback } from "react";
import { TestPipe } from "tabler-icons-react";

const os = [
  { label: "Android", value: "android" },
  { label: "iOS", value: "ios" },
  { label: "Windows", value: "windows" },
];

type Props = {
  userData: UserData;
  onUserDataChange: (userData: UserData) => void;
};

export default function Testing({ userData, onUserDataChange }: Props) {
  const { userId = "", dob, currentOS } = userData;

  const updateUserData = useCallback(
    <K extends keyof UserData>(key: K, value: UserData[K]) => {
      onUserDataChange({ ...userData, [key]: value });
    },
    [userData, onUserDataChange]
  );

  return (
    <Accordion.Item value="Testing">
      <Accordion.Control icon={<TestPipe size={"1.5rem"} />}>
        Testing
      </Accordion.Control>
      <Accordion.Panel>
        <Stack>
          <TextInput
            label="User Id"
            placeholder="User Id"
            value={userId ?? ""}
            onChange={e => updateUserData("userId", e.target.value)}
          />
          <DateInput
            value={dob}
            onChange={e => updateUserData("dob", e)}
            label="Date of Birth"
            placeholder="Date of birth"
          />
          <Select
            data={os}
            label="Operating System"
            searchable
            nothingFound="Unknown OS"
            value={currentOS}
            onChange={e => updateUserData("currentOS", e)}
          />
          <Checkbox
            label="Employee"
            checked={userData.employee ?? false}
            onChange={e => updateUserData("employee", e.currentTarget.checked)}
          />
          <Checkbox
            label="Tester"
            checked={userData.tester ?? false}
            onChange={e => updateUserData("tester", e.currentTarget.checked)}
          />
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
