import React from 'react';
import clsx from 'clsx';
import Dashboard from './Dashboard';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Measurement from './Measurement';
import { useStyles } from './dashboardStyles';

function MeasurementList() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  // FIXME Ask server for last measurements
  let latestMeasurements = [
    {"node": "lujan-1", "measurement": 60, "timestamp": "10/2/2020"},
    {"node": "lujan-2", "measurement": 560, "timestamp": "1/2/2020"},
    {"node": "lujan-3", "measurement": 220, "timestamp": "5/2/2020"},
    {"node": "areco-1", "measurement": 600, "timestamp": "8/2/2020"}
  ]

  let measurements = []
  for (let i = 0; i < latestMeasurements.length; i++) {
    measurements.push(
    <Grid item xs={12} md={4} lg={3}>
    <Paper className={fixedHeightPaper}>
      <Measurement node={latestMeasurements[i].node} measurement={latestMeasurements[i].measurement} timestamp={latestMeasurements[i].timestamp}  />
    </Paper>
    </Grid>
    )
  }
  return measurements
}

export default function InitialDashboard() {
  return (
    <Dashboard title="Inicio" >
      <MeasurementList />
    </Dashboard>
  );
}