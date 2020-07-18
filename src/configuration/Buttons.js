import IconButton from "@material-ui/core/IconButton";
import UndoIcon from "@material-ui/icons/Undo";
import Button from "@material-ui/core/Button";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import NodesClient from "../api/NodesClient";
import { NODES_API } from "../common/constants";

const nodesClient = new NodesClient(NODES_API);

const useStyles = makeStyles(theme => ({
  updateButton: {
    marginTop: theme.spacing(1)
  }
}));

function RestoreConfigurationButton({ handleConfigurationRestore, disabled }) {
  return (
    <IconButton
      aria-label="restore"
      size="small"
      onClick={handleConfigurationRestore}
      disabled={disabled}
    >
      <UndoIcon />
    </IconButton>
  );
}

function UpdateConfigurationButton({
  node,
  getUpdatedConfiguration,
  clearConfigChangesNotSaved,
  setSnackbarData,
  disabled
}) {
  const classes = useStyles();

  const handleConfigurationUpdate = () => {
    const configuration = getUpdatedConfiguration();
    console.log("update configuration", node, configuration);
    (async () => {
      try {
        const updatedConfiguration = await nodesClient.updateNodeConfiguration(
          node,
          configuration
        );
        console.log(updatedConfiguration);
        clearConfigChangesNotSaved();
        setSnackbarData({
          open: true,
          severity: "success",
          message: "Configuración de nodo actualizada con éxito"
        });
      } catch (e) {
        setSnackbarData({
          open: true,
          severity: "error",
          message: "Error al intentar actualizar la configuración de nodo"
        });
      }
    })();
  };

  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.updateButton}
      onClick={handleConfigurationUpdate}
      disabled={disabled}
    >
      Actualizar configuración
    </Button>
  );
}

export { RestoreConfigurationButton, UpdateConfigurationButton };
