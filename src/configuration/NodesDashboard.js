import React, { useState } from "react";
import Dashboard from "../dashboard/Dashboard";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Nodes from "./Nodes";
import { useStyles } from "../dashboard/dashboardStyles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import NodesClient from "../api/NodesClient";
import CustomizedSnackbar from "../components/CustomizedSnackbar";
import { NODES_API } from "../common/constants";

const nodesClient = new NodesClient(NODES_API);

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

function NodeCreateConfirmation({
  open,
  handleCreateDialogClose,
  setParentNode,
  addNewNode,
  setSnackbarData
}) {
  const fabClasses = fabStyles();

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
      addNewNode(nodeName, description);
      setParentNode(nodeName, description);
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

  const [node, setNode] = useState("");
  const [nodes, setNodes] = useState([]);
  const [config, updateConfig] = useState({});
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [deleteNodeDisabled, setDeleteNodeDisabled] = useState(true);
  const [nodesData, setNodesData] = useState({});
  const [nodeDescription, setNodeDescription] = useState("");

  const changeNodeAndTable = (name, description) => {
    console.log("changing node and table to ", name);
    setNode(name);
    if (description) {
      setNodeDescription(description);
    } else {
      setNodeDescription(nodesData[name].description);
    }
    setDeleteNodeDisabled(true);
    setIsLoadingConfig(true);
    updateConfig({});
  };

  console.log("ACA PARA DEBUGGEAR", nodesData);

  const addNewNode = (name, description) => {
    console.log("adding new node", name);
    var nodesUpdated = nodes.slice();
    nodesUpdated.push(name);
    setNodes(nodesUpdated);
    // Add new description
    var nodesDataUpdated = {
      [name]: { description: description },
      ...nodesData
    };
    setNodesData(nodesDataUpdated);
  };

  const [createConfirmOpen, setCreateConfirmOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    severity: "",
    message: ""
  });

  const handleCreateConfirmOpen = () => {
    setCreateConfirmOpen(true);
  };

  const handleCreateConfirmClose = () => {
    setCreateConfirmOpen(false);
  };

  return (
    <Dashboard {...props} title="Nodos">
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Nodes
            node={node}
            setNode={setNode}
            nodes={nodes}
            setNodes={setNodes}
            nodesData={nodesData}
            setNodesData={setNodesData}
            nodeDescription={nodeDescription}
            setNodeDescription={setNodeDescription}
            config={config}
            updateConfig={updateConfig}
            isLoadingConfig={isLoadingConfig}
            setIsLoadingConfig={setIsLoadingConfig}
            deleteNodeDisabled={deleteNodeDisabled}
            setDeleteNodeDisabled={setDeleteNodeDisabled}
            changeNodeAndTable={changeNodeAndTable}
            setSnackbarData={setSnackbarData}
          />
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
        setParentNode={changeNodeAndTable}
        addNewNode={addNewNode}
        setSnackbarData={setSnackbarData}
      />
      <CustomizedSnackbar
        props={snackbarData}
        setSnackbarData={setSnackbarData}
      />
    </Dashboard>
  );
}
