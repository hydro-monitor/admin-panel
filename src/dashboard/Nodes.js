import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Title from "./Title";
import NodesSelect from "./NodesSelect";
import LinearProgress from "@material-ui/core/LinearProgress";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import UndoIcon from "@material-ui/icons/Undo";
import Alert from "@material-ui/lab/Alert";
import { handleErrors, sleep } from "./server";

const useStyles = makeStyles(theme => ({
  deleteButton: {
    marginBottom: theme.spacing(1)
  },
  buttonsGrid: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  titleGrid: {
    display: "inline-flex"
  },
  titleDiv: {
    alignSelf: "flex-end"
  },
  updateButton: {
    marginTop: theme.spacing(1)
  },
  configButtons: {
    display: "inline-flex",
    justifyContent: "flex-end"
  },
  restoreButton: {
    alignSelf: "flex-end",
    marginRight: "10px",
    marginBottom: "2px"
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
      <DeleteIcon /* fontSize="small" */ />
    </IconButton>
  );
}

function NodeDeleteConfirmation({ open, node, handleDeleteDialogClose }) {
  const [nodeToDelete, setNodeToDelete] = useState("");
  const handleNodeToDelete = event => {
    console.log("handleNodeToDelete");
    setNodeToDelete(event.target.value);
  };

  const [nodeToDeleteError, setNodeToDeleteError] = useState(false);
  const [nodeToDeleteErrorMessage, setNodeToDeleteErrorMessage] = useState("");
  const handleNodeToDeleteError = () => {
    setNodeToDeleteError(true);
    setNodeToDeleteErrorMessage("El nombre del nodo a borrar es incorrecto");
  };
  const handleNodeToDeleteValidation = () => {
    setNodeToDeleteError(false);
    setNodeToDeleteErrorMessage("");
  };
  const handleDeleteConfirmation = () => {
    console.log("handleDeleteConfirmation");
    console.log(nodeToDelete);
    if (nodeToDelete === node) {
      // TODO DELETE /api/nodes/{nodeName}
      handleNodeToDeleteValidation();
      handleDeleteConfirmClose();
    } else {
      handleNodeToDeleteError();
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

export default function Nodes() {
  const classes = useStyles();

  const nodes = ["lujan-1", "lujan-2", "lujan-3", "areco-1"]; // TODO get nodes from server?
  const [node, setNode] = useState(nodes[0]);

  const [config, updateConfig] = useState(undefined);
  async function fetchConfig(url) {
    await sleep(1000); // TODO Remove when testing is done
    await fetch(url)
      .then(handleErrors)
      .then(async response => {
        console.log(response);
        const json = await response.json();
        if (json == null) {
          updateConfig(null);
          return;
        }
        updateConfig(JSON.stringify(json, null, 2));
        handleDeleteNodeEnabled();
      })
      .catch(error => {
        console.log(error);
        updateConfig(null);
        handleDeleteNodeDisabled();
      });
  }
  const changeNodeAndTable = name => {
    setNode(name);
    updateConfig(undefined);
  };
  const handleConfigurationTextUpdate = event => {
    updateConfig(event.target.value);
  };

  const [deleteNodeDisabled, setDeleteNodeDisabled] = useState(true);
  const handleDeleteNodeDisabled = () => {
    setDeleteNodeDisabled(true);
  };
  const handleDeleteNodeEnabled = () => {
    setDeleteNodeDisabled(false);
  };
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const handleDeleteConfirmOpen = () => {
    setDeleteConfirmOpen(true);
  };
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };

  function useFetch(url) {
    // empty array as second argument equivalent to componentDidMount
    useEffect(() => {
      fetchConfig(url);
    }, [url]);
  }

  const getNodeConfigurationURL =
    "http://antiguos.fi.uba.ar:443/api/nodes/" + node + "/configuration";
  // "https://my-json-server.typicode.com/hydro-monitor/web-api-mock/configurations/" + node.split("-")[1];
  useFetch(getNodeConfigurationURL);
  console.log(config);

  const handleConfigurationRestore = () => {
    fetchConfig(getNodeConfigurationURL);
  };

  function renderTable() {
    return (
      <React.Fragment>
        <TextField
          id="filled-multiline-static"
          multiline
          rows="30"
          value={config}
          variant="filled"
          onChange={handleConfigurationTextUpdate}
        />

        <div className={classes.configButtons}>
          <div className={classes.restoreButton}>
            <RestoreConfigurationButton
              handleConfigurationRestore={handleConfigurationRestore}
            />
          </div>
          <div>
            <UpdateConfigurationButton node={node} configuration={config} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  function renderLoading() {
    return <LinearProgress />;
  }

  function renderError() {
    return (
      <Alert severity="error">
        No se pudo consultar la configuración del nodo {node}
      </Alert>
    );
  }

  function renderContent() {
    if (config) {
      return renderTable();
    } else if (config === undefined) {
      // Cuando todavia no obtuve el resultado del servidor
      return renderLoading();
    } else if (config === null) {
      // Cuando no hay informacion para el nodo
      return renderError();
    }
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={11} md={11} lg={11} className={classes.titleGrid}>
          <div className={classes.titleDiv}>
            <Title>Configuración de nodo</Title>
          </div>
          <div>
            <NodesSelect nodes={nodes} setParentNode={changeNodeAndTable} />
          </div>
        </Grid>
        <Grid item xs={1} md={1} lg={1} className={classes.buttonsGrid}>
          <div>
            <DeleteButton
              handleDeleteConfirmOpen={handleDeleteConfirmOpen}
              disabled={deleteNodeDisabled}
            />
            <NodeDeleteConfirmation
              open={deleteConfirmOpen}
              node={node}
              handleDeleteDialogClose={handleDeleteConfirmClose}
            />
          </div>
        </Grid>
      </Grid>
      {renderContent()}
    </React.Fragment>
  );
}
