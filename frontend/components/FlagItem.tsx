import { Group, UnstyledButton, Text, Tooltip } from "@mantine/core";

export type StatusType = "pass" | "fail" | "disabled";
export type FlagType = {
  id: string;
  name: string;
  description: string;
  status: StatusType;
};

type Props = FlagType & {
  onClick: (id: string) => void;
};

export default function FlagItem({
  id,
  name,
  description,
  status,
  onClick,
}: Props) {
  const statusIcon = () => {
    switch (status) {
      case "pass":
        return "🟢";
      case "fail":
        return "🔴";
      case "disabled":
        return "⚫";
    }
  };

  return (
    <Tooltip label={description}>
      <UnstyledButton onClick={() => onClick(id)}>
        <Group spacing="xs">
          <Text>{statusIcon()}</Text>
          <Text>{name}</Text>
        </Group>
      </UnstyledButton>
    </Tooltip>
  );
}
