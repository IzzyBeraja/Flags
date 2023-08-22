import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun, Moon } from "tabler-icons-react";

export default function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      size="lg"
      onClick={() => toggleColorScheme()}
      sx={theme => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.blue[6],
      })}
    >
      {colorScheme === "dark" ? (
        <Sun size={20} strokeWidth={1.5} />
      ) : (
        <Moon size={20} strokeWidth={1.5} />
      )}
    </ActionIcon>
  );
}
