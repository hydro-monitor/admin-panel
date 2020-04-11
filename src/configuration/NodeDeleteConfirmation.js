import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import NodesClient from "../api/NodesClient";

const nodesClient = new NodesClient("http://localhost:8080/api/nodes/");

export default function NodeDeleteConfirmation({
  open,
  node,
  handleDeleteDialogClose,
  setSnackbarData
}) {
  const [nodeToDelete, setNodeToDelete] = useState("");
  const handleNodeToDelete = event => {
    setNodeToDelete(event.target.value);
  };

  const [nodeToDeleteError, setNodeToDeleteError] = useState(false);
  const [nodeToDeleteErrorMessage, setNodeToDeleteErrorMessage] = useState("");
  const handleNodeToDeleteError = message => {
    setNodeToDeleteError(true);
    setNodeToDeleteErrorMessage(message);
    setSnackbarData({
      open: true,
      message: "Error al intentar borrar el nodo",
      severity: "error"
    });
  };
  const handleNodeToDeleteValidation = () => {
    setNodeToDeleteError(false);
    setNodeToDeleteErrorMessage("");
  };
  const handleDeleteConfirmation = async () => {
    console.log("handleDeleteConfirmation");
    console.log(nodeToDelete);
    if (nodeToDelete === node) {
      const ok = await nodesClient.deleteNode(nodeToDelete);
      console.log(`Result: ${ok}`);
      if (ok) {
        handleNodeToDeleteValidation();
        handleDeleteConfirmClose();
        setSnackbarData({
          open: true,
          message: "Nodo borrado satisfactoriamente",
          severity: "success"
        });
      } else {
        handleNodeToDeleteError("Error al intentar borrar el nodo");
      }
    } else {
      handleNodeToDeleteError("El nombre del nodo a borrar es incorrecto");
    }
  };
  const handleDeleteConfirmClose = () => {
    setNodeToDelete("");
    handleDeleteDialogClose();
    handleNodeToDeleteValidation();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDeleteConfirmClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Eliminar nodo {node}</DialogTitle>
      <DialogContent>
        <DialogContentText component={"div"}>
          <Typography gutterBottom>
            ¿Desea eliminar el nodo {node}? De hacerlo, no recibirá más sus
            mediciones ni podrá configurarlo.
          </Typography>
          <Typography gutterBottom>
            Para eliminar al nodo, confirme escribiendo su nombre.
          </Typography>
        </DialogContentText>
        <TextField
          autoFocus
          id="name"
          label="Nombre"
          onChange={handleNodeToDelete}
          required={true}
          error={nodeToDeleteError}
          helperText={nodeToDeleteErrorMessage}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteConfirmClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleDeleteConfirmation} color="primary">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
