import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Dashboard from "./Dashboard";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Measurement from "./Measurement";
import { useStyles } from "./dashboardStyles";
import { handleErrors, sleep } from "./server";
import { makeStyles } from "@material-ui/core/styles";

const webAPI = "http://localhost:8080"; //"http://antiguos.fi.uba.ar:443";

function MeasurementList({ nodes }) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  // FIXME Ask server for last measurements
  const latestMeasurements = [
    { measurement: 60, timestamp: "10/2/2020" },
    { measurement: 560, timestamp: "1/2/2020" },
    { measurement: 220, timestamp: "5/2/2020" },
    { measurement: 600, timestamp: "8/2/2020" }
  ];

  let measurements = [];
  for (let i = 0; i < nodes.length; i++) {
    measurements.push(
      <Grid item xs={12} md={4} lg={3} key={i}>
        <Paper className={fixedHeightPaper}>
          <Measurement
            node={nodes[i]}
            measurement={
              latestMeasurements[i % latestMeasurements.length].measurement
            }
            timestamp={
              latestMeasurements[i % latestMeasurements.length].timestamp
            }
          />
        </Paper>
      </Grid>
    );
  }
  return measurements;
}

export default function InitialDashboard(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [nodes, setNodes] = useState([]);
  const nodesURL = webAPI + "/api/nodes";
  useEffect(() => {
    const fetchNodes = async () => {
      console.log("FETCH NODES HOOK");
      setIsLoading(true);
      await sleep(2000); // TODO Remove when testing is done
      await fetch(nodesURL)
        .then(handleErrors)
        .then(async response => {
          console.log(response);
          const json = await response.json();
          const nodesList = json.map(item => item.id).sort();
          setNodes(nodesList);
          setIsLoading(false);
        })
        .catch(error => {
          console.log(error);
          setNodes([]);
          // Render error
          setIsLoading(false);
        });
    };
    fetchNodes();
  }, [nodesURL]);

  function renderLastMeasurements() {
    return (
      <Dashboard {...props} title="Inicio">
        <MeasurementList nodes={nodes} />
      </Dashboard>
    );
  }

  const useStyles = makeStyles(theme => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1
    }
  }));
  const classes = useStyles();

  function renderLoading() {
    return (
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  function renderContent() {
    if (isLoading) {
      return renderLoading();
    } else {
      return renderLastMeasurements();
    }
  }

  return <React.Fragment>{renderContent()}</React.Fragment>;
}
