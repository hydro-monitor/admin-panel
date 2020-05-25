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
import { useMountEffect } from "../common/UseMountEffect";

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
  },
  configChangesNotSaved: {
    alignSelf: "flex-end",
    marginRight: "10px",
    marginBottom: "8px"
  }
}));

export default function Nodes({
  node,
  setNode,
  nodes,
  setNodes,
  config,
  updateConfig,
  isLoadingConfig,
  setIsLoadingConfig,
  deleteNodeDisabled,
  setDeleteNodeDisabled,
  changeNodeAndTable,
  setSnackbarData
}) {
  const classes = useStyles();

  const [originalConfig, updateOriginalConfig] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [configChangesNotSaved, updateConfigChangesNotSaved] = useState("");

  useMountEffect(() => {
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
        setSnackbarData({
          open: true,
          severity: "error",
          message: "Error al intentar obtener el listado de los nodos"
        });
      }
    })();
  }, [nodes]);

  useEffect(() => {
    (async () => {
      setIsLoadingConfig(true);
      console.log("FETCH CONFIG HOOK");
      if (!isLoading) {
        console.log("FETCHING NODE CONFIG");
        try {
          await sleep(1000); // TODO Remove when testing is done
          const config = await nodesClient.getNodeConfiguration(node);
          updateConfig(config);
          updateOriginalConfig(config);
        } catch (error) {
          updateConfig("");
          updateOriginalConfig("");
          setSnackbarData({
            open: true,
            severity: "error",
            message: "El nodo no posee una configuración activa"
          });
        } finally {
          clearConfigChangesNotSaved();
          setDeleteNodeDisabled(false);
          setIsLoadingConfig(false);
        }
      }
    })();
  }, [node, isLoading, setSnackbarData]);

  const deleteOldNode = name => {
    console.log("deleting old node", name);
    var nodesUpdated = nodes.slice();
    nodesUpdated.splice(nodesUpdated.indexOf(name), 1);
    setNodes(nodesUpdated);
  };

  const clearConfigChangesNotSaved = () => {
    updateConfigChangesNotSaved("");
  };

  const setConfigChangesNotSaved = () => {
    updateConfigChangesNotSaved("Cambios de configuración no guardados");
  };

  const handleConfigurationTextUpdate = event => {
    updateConfig(event.target.value);
    setConfigChangesNotSaved();
  };

  const handleDeleteConfirmOpen = () => setDeleteConfirmOpen(true);

  const handleDeleteConfirmClose = () => setDeleteConfirmOpen(false);

  const handleConfigurationRestore = () => {
    updateConfig(originalConfig);
    clearConfigChangesNotSaved();
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
          <div className={classes.configChangesNotSaved}>
            {configChangesNotSaved}
          </div>
          <div className={classes.restoreButton}>
            <RestoreConfigurationButton
              handleConfigurationRestore={handleConfigurationRestore}
            />
          </div>
          <div>
            <UpdateConfigurationButton
              node={node}
              configuration={config}
              clearConfigChangesNotSaved={clearConfigChangesNotSaved}
              setSnackbarData={setSnackbarData}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  function renderLoading() {
    return <LinearProgress />;
  }

  function renderConfigContent() {
    if (isLoadingConfig) {
      return renderLoading();
    } else {
      return renderTable();
    }
  }

  function nextNode() {
    let i = nodes.indexOf(node);
    if (i === nodes.length - 1) {
      return nodes[0];
    }
    return nodes[i + 1];
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
              <NodesSelect
                node={node}
                setNode={setNode}
                nodes={nodes}
                setParentNode={changeNodeAndTable}
              />
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
                nextNode={nextNode()}
                handleDeleteDialogClose={handleDeleteConfirmClose}
                setParentNode={changeNodeAndTable}
                deleteOldNode={deleteOldNode}
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
