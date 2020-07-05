import React from "react";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

export default function EmptyMeasurement({ node }) {
  return (
    <React.Fragment>
      <Title>{node}</Title>
      <Typography component="p" variant="body1">
        Este nodo aún no cuenta con mediciones registradas
      </Typography>
    </React.Fragment>
  );
}
