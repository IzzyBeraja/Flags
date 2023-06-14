import {
  Group as M_Group,
  UnstyledButton as M_UnstyledButton,
  Text as M_Text,
  Tooltip as M_Tooltip,
} from "@mantine/core";

export type StatusType = "pass" | "fail" | "disabled";
export type FlagData = {
  id: string;
  name: string;
  description: string;
  status: StatusType;
};

type Props = FlagData & {
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
    <M_Tooltip label={description}>
      <M_UnstyledButton onClick={() => onClick(id)}>
        <M_Group spacing="xs">
          <M_Text>{statusIcon()}</M_Text>
          <M_Text>{name}</M_Text>
        </M_Group>
      </M_UnstyledButton>
    </M_Tooltip>
  );
}
