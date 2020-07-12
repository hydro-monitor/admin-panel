import IconButton from "@material-ui/core/IconButton";
import UndoIcon from "@material-ui/icons/Undo";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
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

function DeleteButton({ size, tooltip, classes, onClick, disabled }) {
  const btn = () => (
    <IconButton
      color="secondary"
      aria-label="delete"
      size={size || "small"}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      <DeleteIcon />
    </IconButton>
  );
  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <div>{btn()}</div>
      </Tooltip>
    );
  }
  return btn();
}

export { RestoreConfigurationButton, UpdateConfigurationButton, DeleteButton };
