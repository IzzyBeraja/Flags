import { Accordion, Select, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import { TestPipe } from "tabler-icons-react";

export default function Testing() {
  const [userId, setUserId] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [_, setCurrentOS] = useState<string | null>("");

  const os = [
    { label: "Android", value: "android" },
    { label: "iOS", value: "ios" },
    { label: "Windows", value: "windows" },
  ];

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
            value={userId}
            onChange={e => setUserId(e.target.value)}
          />
          <DateInput
            value={date}
            onChange={setDate}
            label="Date of Birth"
            placeholder="Date of birth"
          />
          <Select
            data={os}
            label="Operating System"
            searchable
            nothingFound="Unknown OS"
            onChange={setCurrentOS}
          />
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
