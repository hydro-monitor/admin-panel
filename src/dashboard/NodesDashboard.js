import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Nodes from "../configuration/Nodes";
import { useStyles } from "./dashboardStyles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const fabStyles = makeStyles(theme => ({
  fab: {
    position: "fixed",
    bottom: "20px",
    right: "20px"
  },
  nameForm: {
    marginBottom: theme.spacing(1)
  }
}));

function NodeCreateConfirmation({ open, handleCreateDialogClose }) {
  const fabClasses = fabStyles();

  const [nodeToCreate, setNodeToCreate] = useState("");
  const handleNodeToCreate = event => {
    setNodeToCreate(event.target.value);
  };
  const [descriptionOfNodeToCreate, setDescriptionOfNodeToCreate] = useState(
    ""
  );
  const handleDescriptionOfNodeToCreate = event => {
    setDescriptionOfNodeToCreate(event.target.value);
  };

  const [nodeToCreateError, setNodeToCreateError] = useState(false);
  const [nodeToCreateErrorMessage, setNodeToCreateErrorMessage] = useState("");
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
      // TODO POST /api/nodes/ con nodeToCreate y descriptionOfNodeToCreate
      handleCreateConfirmClose();
    }
  };
  const handleCreateConfirmClose = () => {
    setNodeToCreate("");
    setDescriptionOfNodeToCreate("");
    handleCreateDialogClose();
    handleNodeToCreateValidation();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCreateConfirmClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Crear nodo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          id="name"
          label="Nombre"
          onChange={handleNodeToCreate}
          required={true}
          error={nodeToCreateError}
          helperText={nodeToCreateErrorMessage}
          className={fabClasses.nameForm}
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

export default function NodesDashboard(props) {
  const classes = useStyles();
  const fabClasses = fabStyles();

  const [createConfirmOpen, setCreateConfirmOpen] = useState(false);
  const handleCreateConfirmOpen = () => {
    setCreateConfirmOpen(true);
  };
  const handleCreateConfirmClose = () => {
    setCreateConfirmOpen(false);
  };

  return (
    <Dashboard {...props} title="Nodos">
      {/* Measurements table */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Nodes />
        </Paper>
      </Grid>
      <Fab
        aria-label="add"
        color="primary"
        className={fabClasses.fab}
        onClick={handleCreateConfirmOpen}
      >
        <AddIcon />
      </Fab>
      <NodeCreateConfirmation
        open={createConfirmOpen}
        handleCreateDialogClose={handleCreateConfirmClose}
      />
    </Dashboard>
  );
}
