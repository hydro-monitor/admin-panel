import React, { useState } from "react";
import Dashboard from "../dashboard/Dashboard";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import NodeConfiguration from "./NodeConfiguration";
import { useStyles } from "../dashboard/dashboardStyles";
import CustomizedSnackbar from "../components/CustomizedSnackbar";

export default function ConfigurationsDashboard(props) {
  const classes = useStyles();

  const [node, setNode] = useState("");
  const [nodes, setNodes] = useState([]);
  const [config, updateConfig] = useState({});
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [nodesData, setNodesData] = useState({});
  const [nodeDescription, setNodeDescription] = useState("");
  const [configGetError, setConfigGetError] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const changeNodeAndTable = (name) => {
    console.log("changing node and table to ", name);
    setNode(name);
    setNodeDescription(nodesData[name].description);
    setConfigGetError(false);
    setIsLoadingConfig(true);
    updateConfig({});
  };

  return (
    <Dashboard {...props} title="Configuraciones">
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <NodeConfiguration
            node={node}
            setNode={setNode}
            nodes={nodes}
            setNodes={setNodes}
            setNodesData={setNodesData}
            nodeDescription={nodeDescription}
            setNodeDescription={setNodeDescription}
            config={config}
            updateConfig={updateConfig}
            isLoadingConfig={isLoadingConfig}
            setIsLoadingConfig={setIsLoadingConfig}
            changeNodeAndTable={changeNodeAndTable}
            setSnackbarData={setSnackbarData}
            configGetError={configGetError}
            setConfigGetError={setConfigGetError}
          />
        </Paper>
      </Grid>
      <CustomizedSnackbar
        props={snackbarData}
        setSnackbarData={setSnackbarData}
      />
    </Dashboard>
  );
}
