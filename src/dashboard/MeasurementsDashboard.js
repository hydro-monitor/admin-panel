import React from "react";
import Dashboard from "./Dashboard";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Measurements from "./Measurements";
import { useStyles } from "./dashboardStyles";

export default function MeasurementsDashboard() {
  const classes = useStyles();
  return (
    <Dashboard title="Mediciones">
      {/* Measurements table */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Measurements />
        </Paper>
      </Grid>
    </Dashboard>
  );
}