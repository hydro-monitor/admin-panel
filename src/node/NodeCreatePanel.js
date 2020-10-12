import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Alert from "@material-ui/lab/Alert";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import NodesClient from "../api/NodesClient";
import { NODES_API } from "../common/constants";
import CopiableTextField from "../components/CopiableTextField";

const nodesClient = new NodesClient(NODES_API);

const styles = (theme) => ({
  nextStepButton: {
    marginLeft: theme.spacing(1),
  },
});

function NodeCreatePanel({
  classes,
  open,
  handleCreateDialogClose,
  addNewNodeToState,
  setSnackbarData,
}) {
  const [nodeToCreate, setNodeToCreate] = useState("");
  const [nodeToCreateError, setNodeToCreateError] = useState(false);
  const [nodeToCreateErrorMessage, setNodeToCreateErrorMessage] = useState("");
  const [nodePassword, setNodePassword] = useState("");

  const [nodeCreateStep, setNodeCreateStep] = useState(0);
  const nodeCreateStepStart = "Crear nodo";
  const nodeCreateStepWaiting = "Esperar creación";
  const nodeCreateStepShowPassword = "Guardar contraseña";
  const nodeCreateStepDone = "Terminar creación";
  const getSteps = () => {
    return [
      nodeCreateStepStart,
      nodeCreateStepWaiting,
      nodeCreateStepShowPassword,
      nodeCreateStepDone,
    ];
  };
  const steps = getSteps();
  const handleResetStep = () => {
    setNodeCreateStep(0);
  };
  const prepareForNextStep = (step) => {
    switch (step) {
      case 0:
        return handleCreateConfirmation();
      case 1:
        return;
      case 2:
        handleNextStep(); // Go to confirm close step
        return;
      case 3:
        return handleCreateConfirmClose();
      default:
        return "Unknown step";
    }
  };
  const handleNextStep = () => {
    setNodeCreateStep((prevActiveStep) => prevActiveStep + 1);
  };
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return newNodeDialog();
      case 1:
        return waitingNewNode();
      case 2:
        return newNodeSuccess();
      case 3:
        return newNodeSuccess();
      default:
        return "Unknown step";
    }
  };
  const getStepButtonText = (step) => {
    switch (step) {
      case 0:
        return "Siguiente";
      case 1:
        return "Siguiente";
      case 2:
        return "Cerrar";
      case 3:
        return "Sí, cerrar";
      default:
        return "Unknown";
    }
  };

  const handleNodeToCreate = (event) => {
    setNodeToCreate(event.target.value);
  };

  const [descriptionOfNodeToCreate, setDescriptionOfNodeToCreate] = useState(
    ""
  );

  const handleDescriptionOfNodeToCreate = (event) => {
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
      handleNextStep(); // Go to waiting step
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
      })();
    }
  };

  const handleCreateConfirmClose = () => {
    handleCreateDialogClose();
    handleResetStep();
    setNodeToCreate("");
    setDescriptionOfNodeToCreate("");
    setNodePassword("");
    handleNodeToCreateValidation();
  };

  const handleNodeCreationResult = async (response, nodeName, description) => {
    if (response.ok) {
      try {
        const updatedConfiguration = await nodesClient.updateNodeConfiguration(
          // TODO conviene ponerlo en el server, es probable que caiga en un cassandra que no conoce del nuevo nodo y falle la carga de su config
          nodeName,
          { default: { interval: 21600, picturesNum: 1 } }
        );
        console.log(
          "default config created successfully",
          updatedConfiguration
        );
      } catch (e) {
        console.log("error creating default config", e);
      }
      const json = await response.json();
      console.log("JSON response was: ", json);
      setNodePassword(json.password); // TODO change to password
      addNewNodeToState(nodeName, description);
      handleNextStep(); // Go to show password step
    } else {
      handleCreateConfirmClose();
      setSnackbarData({
        open: true,
        severity: "error",
        message: `Error al crear nodo: ${response.body}`,
      });
    }
  };

  function newNodeDialog() {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  function waitingNewNode() {
    return (
      <React.Fragment>
        <DialogTitle id="form-dialog-title">
          Creando nodo {nodeToCreate}
        </DialogTitle>
        <DialogContent>
          <LinearProgress />
        </DialogContent>
      </React.Fragment>
    );
  }

  function newNodeSuccess() {
    return (
      <React.Fragment>
        <DialogTitle id="form-dialog-title">
          Nodo {nodeToCreate} creado
        </DialogTitle>
        <DialogContent>
          <DialogContentText component={"div"}>
            <Typography gutterBottom>
              El nodo {nodeToCreate} fue creado satisfactoriamente. Para
              utilizarlo, debe configurarlo con la siguiente contraseña:
            </Typography>
            <CopiableTextField
              label="Contraseña de nodo"
              value={nodePassword}
            />
          </DialogContentText>
          <Alert severity="warning">
            Sin esta contraseña el nodo no podrá cargar mediciones. De perderla,
            se deberá recrear el nodo para obtener una nueva.
          </Alert>
        </DialogContent>
      </React.Fragment>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleCreateConfirmClose}
      aria-labelledby="form-dialog-title"
    >
      {getStepContent(nodeCreateStep)}
      <Stepper activeStep={nodeCreateStep}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <DialogActions>
        {nodeCreateStep === steps.length - 1
          ? "¿Ya guardó la contraseña del nodo?"
          : ""}
        <Button
          variant="contained"
          color="primary"
          className={classes.nextStepButton}
          onClick={() => prepareForNextStep(nodeCreateStep)}
        >
          {getStepButtonText(nodeCreateStep)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withStyles(styles)(NodeCreatePanel);
