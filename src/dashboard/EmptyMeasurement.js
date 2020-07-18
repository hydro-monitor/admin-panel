import React from "react";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import Title from "./Title";
import { useStyles } from "./dashboardStyles";

export default function EmptyMeasurement({ node }) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Grow in>
      <Paper className={fixedHeightPaper}>
        <Title>{node}</Title>
        <Typography component="p" variant="body1">
          Este nodo aún no cuenta con mediciones registradas
        </Typography>
      </Paper>
    </Grow>
  );
}
