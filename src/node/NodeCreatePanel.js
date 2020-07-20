import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import NodesClient from "../api/NodesClient";
import { NODES_API } from "../common/constants";

const nodesClient = new NodesClient(NODES_API);

const styles = theme => ({
  updateButton: {
    marginTop: theme.spacing(1)
  }
});

function NodeCreatePanel({
  classes,
  open,
  handleCreateDialogClose,
  addNewNodeToState,
  setSnackbarData
}) {
  const [nodeToCreate, setNodeToCreate] = useState("");
  const [nodeToCreateError, setNodeToCreateError] = useState(false);
  const [nodeToCreateErrorMessage, setNodeToCreateErrorMessage] = useState("");

  const handleNodeToCreate = event => {
    setNodeToCreate(event.target.value);
  };

  const [descriptionOfNodeToCreate, setDescriptionOfNodeToCreate] = useState(
    ""
  );

  const handleDescriptionOfNodeToCreate = event => {
    setDescriptionOfNodeToCreate(event.target.value);
  };

  const handleNodeToCreateError = () => {
    setNodeToCreateError(true);
    setNodeToCreateErrorMessage("El nombre del nodo no puede ser vacío");
  };

  const handleNodeToCreateValidation = () => {
    setNodeToCreateError(false);
    setNodeToCreateErrorMessage("");
  };

  const handleCreateConfirmation = () => {
    console.log("handleCreateConfirmation");
    console.log(nodeToCreate);
    if (nodeToCreate.localeCompare("") === 0) {
      handleNodeToCreateError();
    } else {
      (async () => {
        const response = await nodesClient.createNode(
          nodeToCreate,
          descriptionOfNodeToCreate
        );
        handleNodeCreationResult(
          response,
          nodeToCreate,
          descriptionOfNodeToCreate
        );
        handleCreateConfirmClose();
      })();
    }
  };

  const handleCreateConfirmClose = () => {
    setNodeToCreate("");
    setDescriptionOfNodeToCreate("");
    handleCreateDialogClose();
    handleNodeToCreateValidation();
  };

  const handleNodeCreationResult = (response, nodeName, description) => {
    if (response.ok) {
      setSnackbarData({
        open: true,
        severity: "success",
        message: "Nodo creado con éxito"
      });
      addNewNodeToState(nodeName, description);
    } else {
      setSnackbarData({
        open: true,
        severity: "error",
        message: `Error al crear nodo: ${response.body}`
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCreateConfirmClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Crear nuevo nodo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          id="name"
          label="Nombre"
          onChange={handleNodeToCreate}
          required={true}
          error={nodeToCreateError}
          helperText={nodeToCreateErrorMessage}
          className={classes.nameForm}
          fullWidth
        />
        <TextField
          id="description"
          label="Descripción"
          value={descriptionOfNodeToCreate}
          onChange={handleDescriptionOfNodeToCreate}
          multiline
          rows="4"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreateConfirmClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleCreateConfirmation} color="primary">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withStyles(styles)(NodeCreatePanel);
