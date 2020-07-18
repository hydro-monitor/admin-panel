import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { sleep } from "../common/utils";
import EmptyMeasurement from "./EmptyMeasurement";
import Measurement from "./Measurement";
import { handleErrors } from "../common/server";
import { WEB_API } from "../common/constants";

function MeasurementList({ nodes }) {
  let measurements = [];
  Object.keys(nodes).forEach(id => {
    if (nodes[id]) {
      measurements.push(
        <Grid item xs={12} md={4} lg={3} key={id}>
          <Measurement
            node={id}
            measurement={nodes[id].waterLevel}
            timestamp={nodes[id].readingTime}
          />
        </Grid>
      );
    } else {
      measurements.push(
        <Grid item xs={12} md={4} lg={3} key={id}>
          <EmptyMeasurement node={id} />
        </Grid>
      );
    }
  });
  return measurements;
}

export default function InitialDashboard(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [nodes, setNodes] = useState([]);
  const nodesURL = WEB_API + "/api/nodes/last-reading";
  useEffect(() => {
    const fetchNodes = async () => {
      setIsLoading(true);
      await sleep(1000); // TODO Remove when testing is done
      await fetch(nodesURL)
        .then(handleErrors)
        .then(async response => {
          const json = await response.json();
          setNodes(json);
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

  function renderLoading() {
    return (
      <Dashboard {...props} title="Inicio">
        <Grid container justify="center">
          <CircularProgress />
        </Grid>
      </Dashboard>
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
