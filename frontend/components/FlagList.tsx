import type { FlagData } from "./FlagItem";

import FlagItem from "@components/FlagItem";
import { createStyles } from "@mantine/core";

type Props = {
  flags: Array<FlagData>;
};

export default function FlagList({ flags }: Props) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      {flags.map(({ id, name, description, status }) => (
        <FlagItem
          key={id}
          id={id}
          name={name}
          description={description}
          status={status}
          onClick={id => {
            console.log("clicked", id);
          }}
        />
      ))}
    </div>
  );
}

const useStyles = createStyles(() => ({
  container: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
  },
}));
