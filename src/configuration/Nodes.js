import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Title from "../dashboard/Title";
import NodesSelect from "../dashboard/NodesSelect";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { sleep } from "../dashboard/server";
import {
  RestoreConfigurationButton,
  UpdateConfigurationButton,
  DeleteButton
} from "./Buttons";
import NodeDeleteConfirmation from "./NodeDeleteConfirmation";
import NodesClient from "../api/NodesClient";

const webAPI = "http://localhost:8080"; //"http://antiguos.fi.uba.ar:443";
const nodesClient = new NodesClient("http://localhost:8080/api/nodes");

const useStyles = makeStyles(theme => ({
  buttonsGrid: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  titleGrid: {
    display: "inline-flex"
  },
  titleDiv: {
    alignSelf: "flex-end"
  },
  configButtons: {
    display: "inline-flex",
    justifyContent: "flex-end"
  },
  restoreButton: {
    alignSelf: "flex-end",
    marginRight: "10px",
    marginBottom: "2px"
  }
}));

export default function Nodes() {
  const classes = useStyles();

  const [nodes, setNodes] = useState([]);
  const [node, setNode] = useState("");
  const [config, updateConfig] = useState(undefined);
  const [originalConfig, updateOriginalConfig] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "Test",
    severity: "info"
  });
  const nodesURL = webAPI + "/api/nodes";

  useEffect(() => {
    (async () => {
      console.log("FETCH NODES HOOK");
      setIsLoading(true);
      await sleep(1000); // TODO Remove when testing is done
      try {
        const nodeList = await nodesClient.getNodes();
        setNodes(nodeList);
        setNode(nodeList[0]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setNodes([]);
        // TODO handle loading on error
      }
    })();
  }, [nodesURL]);

  useEffect(() => {
    (async () => {
      console.log("FETCH CONFIG HOOK");
      setIsLoadingConfig(true);
      if (!isLoading) {
        try {
          await sleep(1000); // TODO Remove when testing is done
          updateConfig(await nodesClient.getNodeConfiguration(node));
          handleDeleteNodeEnabled();
          setIsLoadingConfig(false);
        } catch (error) {
          console.log(error);
          updateConfig("");
          handleDeleteNodeDisabled();
          setIsLoadingConfig(false);
        }
      }
    })();
  }, [node, isLoading]); // FIXME review hooks

  useEffect(() => setSnackbarData(snackbarData), [snackbarData]);

  console.log(nodes, node, config, isLoading, isLoadingConfig);

  const changeNodeAndTable = name => {
    setNode(name);
    setIsLoadingConfig(true);
    updateConfig(undefined);
  };

  const handleConfigurationTextUpdate = event => {
    updateConfig(event.target.value);
  };

  const [deleteNodeDisabled, setDeleteNodeDisabled] = useState(true);

  const handleDeleteNodeDisabled = () => setDeleteNodeDisabled(true);

  const handleDeleteNodeEnabled = () => setDeleteNodeDisabled(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDeleteConfirmOpen = () => setDeleteConfirmOpen(true);

  const handleDeleteConfirmClose = () => setDeleteConfirmOpen(false);

  const handleConfigurationRestore = () => {
    updateConfig(originalConfig);
  };

  function renderTable() {
    return (
      <React.Fragment>
        <TextField
          id="filled-multiline-static"
          multiline
          rows="30"
          value={config}
          variant="filled"
          onChange={handleConfigurationTextUpdate}
        />

        <div className={classes.configButtons}>
          <div className={classes.restoreButton}>
            <RestoreConfigurationButton
              handleConfigurationRestore={handleConfigurationRestore}
            />
          </div>
          <div>
            <UpdateConfigurationButton node={node} configuration={config} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  function renderLoading() {
    return <LinearProgress />;
  }

  function renderError() {
    setSnackbarData({
      open: true,
      message: `No se pudo consultar la configuración del nodo ${node}`,
      severity: "error"
    });
  }

  function renderConfigContent() {
    if (isLoadingConfig) {
      return renderLoading();
    } else if (!isLoadingConfig && config === null) {
      return renderError();
    } else {
      return renderTable();
    }
  }

  function renderConfig() {
    return (
      <React.Fragment>
        <Grid container spacing={3}>
          <Grid item xs={11} md={11} lg={11} className={classes.titleGrid}>
            <div className={classes.titleDiv}>
              <Title>Configuración de nodo</Title>
            </div>
            <div>
              <NodesSelect nodes={nodes} setParentNode={changeNodeAndTable} />
            </div>
          </Grid>
          <Grid item xs={1} md={1} lg={1} className={classes.buttonsGrid}>
            <div>
              <DeleteButton
                handleDeleteConfirmOpen={handleDeleteConfirmOpen}
                disabled={deleteNodeDisabled}
              />
              <NodeDeleteConfirmation
                open={deleteConfirmOpen}
                node={node}
                handleDeleteDialogClose={handleDeleteConfirmClose}
                setSnackbarData={setSnackbarData}
              />
            </div>
          </Grid>
        </Grid>
        {renderConfigContent()}
      </React.Fragment>
    );
  }

  function renderContent() {
    if (isLoading) {
      return renderLoading();
    } else {
      return renderConfig();
    }
  }

  return <React.Fragment>{renderContent()}</React.Fragment>;
}
