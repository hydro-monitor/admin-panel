import React from "react";
import Dashboard from "./Dashboard";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Nodes from "./Nodes";
import { useStyles } from "./dashboardStyles";

export default function NodesDashboard(props) {
  const classes = useStyles();
  return (
    <Dashboard {...props} title="Nodos">
      {/* Measurements table */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Nodes />
        </Paper>
      </Grid>
    </Dashboard>
  );
}
