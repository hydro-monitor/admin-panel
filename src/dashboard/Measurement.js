import React from "react";
import clsx from "clsx";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import { useStyles } from "./dashboardStyles";
import Grow from "@material-ui/core/Grow";

function preventDefault(event) {
  event.preventDefault();
}

export default function Measurement({ node, measurement, timestamp }) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const parsedDate = new Date(timestamp).toString();
  return (
    <Grow in>
      <Paper className={fixedHeightPaper}>
        <Title>{node}</Title>
        <Typography component="p" variant="h4">
          {measurement} cm
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          className={classes.depositContext}
        >
          {parsedDate}
        </Typography>
        <div>
          <Link color="primary" component={RouterLink} to="/measurements">
            Ver mediciones
          </Link>
        </div>
      </Paper>
    </Grow>
  );
}
