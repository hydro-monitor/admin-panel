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

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const useStyles = makeStyles(theme => ({
  button: {
    marginBottom: theme.spacing(1)
  }
}));

export default function Nodes() {
  const classes = useStyles();

  const nodes = ["lujan-1", "lujan-2", "lujan-3", "areco-1"]; // TODO get nodes from server?
  const [node, setNode] = useState(nodes[0]);

  const [data, updateData] = useState(undefined);
  const changeNodeAndTable = name => {
    setNode(name);
    updateData(undefined);
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const handleDeleteConfirmOpen = () => {
    setDeleteConfirmOpen(true);
  };
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };

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
  const handleDeleteConfirmation = nodeName => {
    console.log("handleDeleteConfirmation");
    console.log(nodeName);
    if (nodeName === node) {
      // TODO DELETE /api/nodes/{nodeName}
      handleNodeToDeleteValidation();
      handleDeleteConfirmClose();
    } else {
      handleNodeToDeleteError();
    }
  };

  function useFetch(url) {
    // empty array as second argument equivalent to componentDidMount
    useEffect(() => {
      async function fetchData() {
        await sleep(2000); // FIXME Remove when testing is done
        const response = await fetch(url);
        console.log(response);
        const json = await response.json();
        updateData(json);
      }
      fetchData();
    }, [url]);

    return data;
  }

  const URL =
    "http://antiguos.fi.uba.ar:443/api/nodes/" + node + "/configuration";
  const config = useFetch(URL);
  console.log(config);

  function renderTable() {
    return (
      <React.Fragment>
        <TextField
          id="filled-multiline-static"
          multiline
          rows="30"
          defaultValue={JSON.stringify(config, null, 2)}
          variant="filled"
        />
      </React.Fragment>
    );
  }

  function renderLoading() {
    return <LinearProgress />;
  }

  function renderError() {
    return (
      <LinearProgress variant="determinate" value={100} color="secondary" />
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
        <Grid item xs={11} md={11} lg={11}>
          <div style={{ display: "inline-flex" }}>
            <div style={{ alignSelf: "flex-end" }}>
              <Title>Configuración de nodo</Title>
            </div>
            <div>
              <NodesSelect nodes={nodes} setParentNode={changeNodeAndTable} />
            </div>
          </div>
        </Grid>
        <Grid
          item
          xs={1}
          md={1}
          lg={1}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end"
          }}
        >
          <div>
            <IconButton
              color="secondary"
              aria-label="delete"
              size="small"
              className={classes.button}
              onClick={handleDeleteConfirmOpen}
            >
              <DeleteIcon /* fontSize="small" */ />
            </IconButton>
            <Dialog
              open={deleteConfirmOpen}
              onClose={handleDeleteConfirmClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Eliminar nodo {node}
              </DialogTitle>
              <DialogContent>
                <DialogContentText component={"div"}>
                  <Typography gutterBottom>
                    ¿Desea eliminar el nodo {node}? De hacerlo, no recibirá más
                    sus mediciones ni podrá configurarlo.
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
                <Button
                  onClick={() => handleDeleteConfirmation(nodeToDelete)}
                  color="primary"
                >
                  Eliminar
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Grid>
      </Grid>
      {renderContent()}
    </React.Fragment>
  );
}
