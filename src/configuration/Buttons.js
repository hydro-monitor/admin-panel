import IconButton from "@material-ui/core/IconButton";
import UndoIcon from "@material-ui/icons/Undo";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  deleteButton: {
    marginBottom: theme.spacing(1)
  },
  updateButton: {
    marginTop: theme.spacing(1)
  }
}));

function RestoreConfigurationButton({ handleConfigurationRestore }) {
  return (
    <IconButton
      aria-label="restore"
      size="small"
      onClick={handleConfigurationRestore}
    >
      <UndoIcon />
    </IconButton>
  );
}

function UpdateConfigurationButton({ node, configuration }) {
  const classes = useStyles();

  const handleConfigurationUpdate = () => {
    console.log("update configuration", node, configuration);
    // TODO POST or PUT /api/nodes/<node>/configurations
  };

  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.updateButton}
      onClick={handleConfigurationUpdate}
    >
      Actualizar configuración
    </Button>
  );
}

function DeleteButton({ handleDeleteConfirmOpen, disabled }) {
  const classes = useStyles();

  return (
    <IconButton
      color="secondary"
      aria-label="delete"
      size="small"
      className={classes.deleteButton}
      onClick={handleDeleteConfirmOpen}
      disabled={disabled}
    >
      <DeleteIcon />
    </IconButton>
  );
}

export { RestoreConfigurationButton, UpdateConfigurationButton, DeleteButton };
