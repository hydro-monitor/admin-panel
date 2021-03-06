import React from "react";
import Dashboard from "../dashboard/Dashboard";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Measurements from "./Measurements";
import { useStyles } from "../dashboard/dashboardStyles";

export default function MeasurementsDashboard(props) {
  const classes = useStyles();
  return (
    <Dashboard {...props} title="Mediciones">
      {/* Measurements table */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Measurements />
        </Paper>
      </Grid>
    </Dashboard>
  );
}
