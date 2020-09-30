import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Title from "../dashboard/Title";
import TextField from "@material-ui/core/TextField";
import Grow from "@material-ui/core/Grow";
import NodesSelect from "../components/NodesSelect";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import { sleep } from "../common/utils";
import {
  RestoreConfigurationButton,
  UpdateConfigurationButton,
} from "./Buttons";
import NodesClient from "../api/NodesClient";
import { isNumeric } from "../common/utils";
import ConfigurationForm from "./ConfigurationForm";
import { isAdmin } from "../signin/utils";
import { useMountEffect } from "../common/UseMountEffect";
import { NODES_API } from "../common/constants";

const nodesClient = new NodesClient(NODES_API);

const useStyles = makeStyles((theme) => ({
  configButtons: {
    display: "inline-flex",
    justifyContent: "flex-end",
  },
  restoreButton: {
    alignSelf: "flex-end",
    marginRight: "10px",
    marginBottom: "2px",
  },
  configChangesNotSaved: {
    alignSelf: "flex-end",
    marginRight: "10px",
    marginBottom: "8px",
  },
  description: {
    paddingTop: "10px",
    paddingBottom: "10px",
  },
}));

export default function NodeConfiguration({
  node,
  setNode,
  nodes,
  setNodes,
  setNodesData,
  nodeDescription,
  setNodeDescription,
  config,
  updateConfig,
  isLoadingConfig,
  setIsLoadingConfig,
  changeNodeAndTable,
  setSnackbarData,
  configGetError,
  setConfigGetError,
}) {
  const classes = useStyles();

  const [originalConfig, updateOriginalConfig] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [configChangesNotSaved, updateConfigChangesNotSaved] = useState("");
  const [nodesGetError, setNodesGetError] = useState(false);
  const [nodesEmpty, setNodesEmpty] = useState(false);

  useMountEffect(() => {
    (async () => {
      setIsLoading(true);
      await sleep(1000); // TODO Remove when testing is done
      try {
        const nodesAndDescriptions = await nodesClient.getNodes();
        setNodesData(nodesAndDescriptions);
        const nodeList = Object.keys(nodesAndDescriptions).sort();
        setNodes(nodeList);
        if (Object.entries(nodesAndDescriptions).length === 0) {
          setNodesEmpty(true);
          return;
        }
        setNode(nodeList[0]);
        setNodeDescription(nodesAndDescriptions[nodeList[0]].description);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setNodes([]);
        setNodesGetError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  });

  useEffect(() => {
    (async () => {
      setIsLoadingConfig(true);
      if (!isLoading && !nodesEmpty) {
        try {
          await sleep(1000); // TODO Remove when testing is done
          const configuration = await nodesClient.getNodeConfiguration(node);
          addStateNamePropertyToConfiguration(configuration);
          updateConfig(configuration);
          updateOriginalConfig(configuration);
        } catch (error) {
          console.log("error get config", error);
          updateConfig({});
          updateOriginalConfig({});
          if (error.message === "Not Found") {
            setSnackbarData({
              open: true,
              severity: "error",
              message: "El nodo no posee una configuración activa",
            });
          } else {
            // If the error is not found, allow to send a config, if not, set config get error
            setConfigGetError(true);
          }
        } finally {
          clearConfigChangesNotSaved();
          setIsLoadingConfig(false);
        }
      }
    })();
  }, [node, isLoading, setSnackbarData]);

  const addStateNamePropertyToConfiguration = (configuration) => {
    let stateNames = Object.keys(configuration);
    let statesNum = stateNames.length;
    for (let i = 0; i < statesNum; i++) {
      let stateName = stateNames[i];
      configuration[stateName].stateName = stateName;
    }
  };

  const clearConfigChangesNotSaved = () => {
    updateConfigChangesNotSaved("");
  };

  const setConfigChangesNotSaved = () => {
    updateConfigChangesNotSaved("Cambios de configuración no guardados");
  };

  const handleConfigurationUpdate = (stateName, propName, value) => {
    if (propName !== "stateName" && isNumeric(value)) {
      value = parseInt(value);
    }
    let configUpdated = {};
    if (!(stateName in config)) {
      configUpdated = {
        [stateName]: { stateName: stateName, [propName]: value },
        ...config,
      };
    } else {
      let { [stateName]: oldState, ...configWithoutUpdatedState } = config;
      let { [propName]: omit, ...stateWithoutUpdatedProp } = oldState;
      configUpdated = {
        [stateName]: { [propName]: value, ...stateWithoutUpdatedProp },
        ...configWithoutUpdatedState,
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
        picturesNum: 1,
        upperLimit: "",
        lowerLimit: "",
      },
    };
    updateConfig(configUpdated);
    setConfigChangesNotSaved();
  };

  const handleCustomStateDeletion = (deletedStateName) => {
    let { [deletedStateName]: omit, ...configUpdated } = config;
    updateConfig(configUpdated);
    setConfigChangesNotSaved();
  };

  const handleConfigurationRestore = () => {
    updateConfig(originalConfig);
    clearConfigChangesNotSaved();
    setSnackbarData({
      open: true,
      severity: "info",
      message: "Configuración de nodo restaurada",
    });
  };

  const prepareConfigurationForUpdate = () => {
    let stateNames = Object.keys(config);
    let statesNum = stateNames.length;
    let updatedConfig = {};
    for (let i = 0; i < statesNum; i++) {
      let state = config[stateNames[i]];
      let newStateName = state.stateName;
      var clonedState = Object.assign({ picturesNum: 1 }, state);
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
        <Grow in>
          <div>
            <ConfigurationForm
              config={config}
              handleConfigurationUpdate={handleConfigurationUpdate}
              handleCustomStateAddition={handleCustomStateAddition}
              handleCustomStateDeletion={handleCustomStateDeletion}
              disabled={!isAdmin()}
            />
          </div>
        </Grow>

        <Grow in>
          <div className={classes.configButtons}>
            <div className={classes.configChangesNotSaved}>
              {configChangesNotSaved}
            </div>
            <div className={classes.restoreButton}>
              <RestoreConfigurationButton
                handleConfigurationRestore={handleConfigurationRestore}
                disabled={!isAdmin()}
              />
            </div>
            <div>
              <UpdateConfigurationButton
                node={node}
                getUpdatedConfiguration={prepareConfigurationForUpdate}
                clearConfigChangesNotSaved={clearConfigChangesNotSaved}
                setSnackbarData={setSnackbarData}
                disabled={!isAdmin()}
              />
            </div>
          </div>
        </Grow>
      </React.Fragment>
    );
  }

  function renderLoading() {
    return <LinearProgress />;
  }

  function renderConfigContent() {
    if (isLoadingConfig) {
      return renderLoading();
    } else if (configGetError) {
      return renderConfigGetError();
    } else {
      return renderTable();
    }
  }

  function renderNodesGetError() {
    return (
      <Alert severity="error">No se pudo consultar la lista de nodos</Alert>
    );
  }

  function renderNodesEmpty() {
    return <Alert severity="info">No hay nodos registrados</Alert>;
  }

  function renderConfigGetError() {
    return (
      <Alert severity="error">
        No se pudo consultar la configuración del nodo {node}
      </Alert>
    );
  }

  function renderConfig() {
    return (
      <React.Fragment>
        <Grow in>
          <Grid container>
            <Grid item xs={12} md={12} lg={12}>
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
            </Grid>
            <Grid item xs={12} md={12} lg={12} className={classes.description}>
              <TextField
                label="Descripción"
                value={nodeDescription}
                variant="outlined"
                fullWidth
                multiline
                disabled
              />
            </Grid>
          </Grid>
        </Grow>
        {renderConfigContent()}
      </React.Fragment>
    );
  }

  function renderContent() {
    if (isLoading) {
      return renderLoading();
    } else if (nodesGetError) {
      return renderNodesGetError();
    } else if (nodesEmpty) {
      return renderNodesEmpty();
    } else {
      return renderConfig();
    }
  }

  return <React.Fragment>{renderContent()}</React.Fragment>;
}
