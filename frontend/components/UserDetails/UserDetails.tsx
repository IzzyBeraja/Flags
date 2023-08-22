import { Avatar, Box, Group, UnstyledButton, Text, createStyles } from "@mantine/core";
import { getCookie } from "cookies-next";

export default function UserDetails() {
  const cookie = getCookie("user");
  const { classes } = useStyles();

  return !cookie ? (
    <UnstyledButton className={classes.container}>
      <Group>
        <Avatar variant="filled">F</Avatar>
        <Box>
          <Text size="sm">Firstname Lastname</Text>
        </Box>
      </Group>
    </UnstyledButton>
  ) : null;
}

const useStyles = createStyles(theme => ({
  container: {
    ":hover": {
      backgroundColor: theme.colors.dark[6],
    },
    borderRadius: "0.25em",
    padding: "0.5em",
    width: "100%",
  },
}));
