import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Node from "./Node";

const styles = theme => ({});

function NodeList(props) {
  const { nodesInfo, setSnackbarData, deleteOldNodeFromState } = props;
  let nodes = [];
  const nodesNames = Object.keys(nodesInfo);
  nodesNames.forEach(id =>
    nodes.push(
      <Grid item xs={12} md={4} lg={3} key={id}>
        <Node
          node={id}
          nodeDescription={nodesInfo[id].description}
          setSnackbarData={setSnackbarData}
          deleteOldNodeFromState={deleteOldNodeFromState}
        />
      </Grid>
    )
  );
  return nodes;
}

export default withStyles(styles)(NodeList);
