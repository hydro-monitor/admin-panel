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
import EditableTextField from "../components/EditableTextField";
import NodeDeleteConfirmation from "./NodeDeleteConfirmation";
import NodesClient from "../api/NodesClient";
import { useMountEffect } from "../common/UseMountEffect";
import { NODES_API } from "../common/constants";
import { isNumeric } from "../common/utils";
import ConfigurationForm from "./ConfigurationForm";

const nodesClient = new NodesClient(NODES_API);

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
  },
  description: {
    paddingTop: "10px",
    paddingBottom: "10px"
  },
  deleteButton: {
    marginBottom: theme.spacing(1)
  }
}));

export default function Nodes({
  node,
  setNode,
  nodes,
  setNodes,
  nodesData,
  setNodesData,
  nodeDescription,
  setNodeDescription,
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

  const [originalConfig, updateOriginalConfig] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [configChangesNotSaved, updateConfigChangesNotSaved] = useState("");

  useMountEffect(() => {
    (async () => {
      console.log("FETCH NODES HOOK");
      setIsLoading(true);
      await sleep(1000); // TODO Remove when testing is done
      try {
        const nodesAndDescriptions = await nodesClient.getNodes();
        setNodesData(nodesAndDescriptions);
        const nodeList = Object.keys(nodesAndDescriptions).sort();
        setNodes(nodeList);
        setNode(nodeList[0]);
        setNodeDescription(nodesAndDescriptions[nodeList[0]].description);
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
          updateConfig({});
          updateOriginalConfig({});
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
    // Delete old description
    let { [name]: omit, ...nodesDataUpdated } = nodesData;
    setNodesData(nodesDataUpdated);
  };

  const clearConfigChangesNotSaved = () => {
    updateConfigChangesNotSaved("");
  };

  const setConfigChangesNotSaved = () => {
    updateConfigChangesNotSaved("Cambios de configuración no guardados");
  };

  const handleConfigurationUpdate = (stateName, propName, value) => {
    let configUpdated = {};
    if (!(stateName in config)) {
      configUpdated = {
        [stateName]: { [propName]: value },
        ...config
      };
    } else {
      let { [stateName]: oldState, ...configWithoutUpdatedState } = config;
      let { [propName]: omit, ...stateWithoutUpdatedProp } = oldState;
      if (propName !== "stateName" && isNumeric(value)) {
        value = parseInt(value);
      }
      configUpdated = {
        [stateName]: { [propName]: value, ...stateWithoutUpdatedProp },
        ...configWithoutUpdatedState
      };
    }
    updateConfig(configUpdated);
    setConfigChangesNotSaved();
  };

  const handleCustomStateAddition = () => {
    let randomStateName = Math.floor(Math.random() * 101);
    let configUpdated = {
      [randomStateName]: {
        interval: "",
        picturesNum: "",
        upperLimit: "",
        lowerLimit: ""
      },
      ...config
    };
    updateConfig(configUpdated);
    setConfigChangesNotSaved();
  };

  const handleCustomStateDeletion = deletedStateName => {
    let { [deletedStateName]: omit, ...configUpdated } = config;
    updateConfig(configUpdated);
    setConfigChangesNotSaved();
  };

  const handleDeleteConfirmOpen = () => setDeleteConfirmOpen(true);

  const handleDeleteConfirmClose = () => setDeleteConfirmOpen(false);

  const handleConfigurationRestore = () => {
    updateConfig(originalConfig);
    clearConfigChangesNotSaved();
    setSnackbarData({
      open: true,
      severity: "info",
      message: "Configuración de nodo restaurada"
    });
  };

  const handleDescriptionUpdate = () => {
    // TODO Add PUT to update description
    console.log("Saving new descrption", nodeDescription);
  };

  console.log("CONFIG DEBBUG ACA: ", config);

  function renderTable() {
    return (
      <React.Fragment>
        <ConfigurationForm
          config={config}
          handleConfigurationUpdate={handleConfigurationUpdate}
          handleCustomStateAddition={handleCustomStateAddition}
          handleCustomStateDeletion={handleCustomStateDeletion}
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
        <Grid container>
          <Grid item xs={10} md={10} lg={10} className={classes.titleGrid}>
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
          <Grid item xs={2} md={2} lg={2} className={classes.buttonsGrid}>
            <div>
              <DeleteButton
                onClick={handleDeleteConfirmOpen}
                disabled={deleteNodeDisabled}
                classes={classes.deleteButton}
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
          <Grid item xs={12} md={12} lg={12} className={classes.description}>
            <EditableTextField
              label="Descripción"
              value={nodeDescription}
              setValue={setNodeDescription}
              onSave={handleDescriptionUpdate}
            />
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
