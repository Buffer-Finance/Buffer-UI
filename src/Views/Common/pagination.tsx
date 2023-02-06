import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { makeStyles } from "@mui/styles";
import { PaginationItem } from "@mui/material";

const useStyles = makeStyles(() => ({
  ul: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem",
    "& .MuiPaginationItem-root": {
      color: "#fff",
      fontSize: "1.4rem",
    },
    "&.MuiPagination-ul ": {
      flexWrap: "nowrap",
    },
    "& button.Mui-selected": {
      background: "var(--primary)",
      fontWeight: "600",
      "&:hover": {
        background: "var(--primary)",
      },
    },
  },
}));

export default function BasicPagination(props) {
  const cs = useStyles();

  return (
    <Stack spacing={2}>
      <Pagination
        count={props.count}
        classes={{
          root: cs.ul,
          text: "text-1",
        }}
        onChange={props.onChange}
        defaultPage={1}
        renderItem={(item) => <PaginationItem {...item} />}
      />
    </Stack>
  );
}
