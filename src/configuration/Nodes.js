import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Title from "../dashboard/Title";
import NodesSelect from "../dashboard/NodesSelect";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { sleep } from "../common/utils";
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
      if (!isLoading) {
        try {
          await sleep(1000); // TODO Remove when testing is done
          const configuration = await nodesClient.getNodeConfiguration(node);
          addStateNamePropertyToConfiguration(configuration);
          updateConfig(configuration);
          updateOriginalConfig(configuration);
        } catch (configuration) {
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

  const addStateNamePropertyToConfiguration = configuration => {
    let stateNames = Object.keys(configuration);
    let statesNum = stateNames.length;
    for (let i = 0; i < statesNum; i++) {
      let stateName = stateNames[i];
      configuration[stateName].stateName = stateName;
    }
  };

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
    let randomStateName =
      "z" +
      Object.keys(config)
        .sort()
        .slice(-1)[0];
    let configUpdated = {
      ...config,
      [randomStateName]: {
        stateName: "",
        interval: "",
        picturesNum: "",
        upperLimit: "",
        lowerLimit: ""
      }
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

  const prepareConfigurationForUpdate = () => {
    let stateNames = Object.keys(config);
    let statesNum = stateNames.length;
    let updatedConfig = {};
    for (let i = 0; i < statesNum; i++) {
      let state = config[stateNames[i]];
      let newStateName = state.stateName;
      var clonedState = Object.assign({}, state);
      delete clonedState.stateName;
      updatedConfig[newStateName] = clonedState;
    }
    updateOriginalConfig(config);
    return updatedConfig;
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
              getUpdatedConfiguration={prepareConfigurationForUpdate}
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
          <Grid item xs={12} md={12} lg={12}>
            <Box display="flex">
              <Box
                display="inline-flex"
                justifyContent="flex-start"
                flexGrow={1}
              >
                <Box alignSelf="flex-end">
                  <Title>Configuración de nodo</Title>
                </Box>
                <Box>
                  <div>
                    <NodesSelect
                      node={node}
                      setNode={setNode}
                      nodes={nodes}
                      setParentNode={changeNodeAndTable}
                    />
                  </div>
                </Box>
              </Box>
              <Box alignSelf="flex-end">
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
              </Box>
            </Box>
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
