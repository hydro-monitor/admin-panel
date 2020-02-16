import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1
  }
});

export default function Measurement({ node, measurement, timestamp }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>{node}</Title>
      <Typography component="p" variant="h4">
        {measurement} metros
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        tomada el {timestamp}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Ver mediciones
        </Link>
      </div>
    </React.Fragment>
  );
}
