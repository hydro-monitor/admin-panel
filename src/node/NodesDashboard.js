import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import NodesClient from "../api/NodesClient";
import CustomizedSnackbar from "../components/CustomizedSnackbar";
import { sleep } from "../common/utils";
import { isAdmin } from "../signin/utils";
import Dashboard from "../dashboard/Dashboard";
import NodeList from "./NodeList";
import NodeCreatePanel from "./NodeCreatePanel";
import { NODES_API } from "../common/constants";

const nodesClient = new NodesClient(NODES_API);

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1
  }
}));

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

export default function NodesDashboard(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [nodesData, setNodesData] = useState({});
  const [createConfirmOpen, setCreateConfirmOpen] = useState(false);
  const [nodesGetError, setNodesGetError] = useState(false);
  const [nodesEmpty, setNodesEmpty] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    severity: "",
    message: ""
  });

  const classes = useStyles();
  const fabClasses = fabStyles();

  const addNewNodeToState = (name, description) => {
    console.log("adding new node", name);
    var nodesDataUpdated = {
      [name]: { description: description },
      ...nodesData
    };
    setNodesData(nodesDataUpdated);
  };

  const deleteOldNodeFromState = name => {
    console.log("deleting old node", name);
    let { [name]: omit, ...nodesDataUpdated } = nodesData;
    setNodesData(nodesDataUpdated);
  };

  const handleCreateConfirmOpen = () => {
    setCreateConfirmOpen(true);
  };

  const handleCreateConfirmClose = () => {
    setCreateConfirmOpen(false);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await sleep(1000); // TODO Remove when testing is done
      try {
        const nodesAndDescriptions = await nodesClient.getNodes();
        setNodesData(nodesAndDescriptions);
        if (Object.entries(nodesAndDescriptions).length === 0) {
          setNodesEmpty(true);
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setNodesGetError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []); // FIXME add nodes to the hooks arr?

  function renderLoading() {
    return (
      <Grid container justify="center">
        <CircularProgress />
      </Grid>
    );
  }

  function renderNodesGetError() {
    return (
      <Alert severity="error">No se pudo consultar la lista de nodos</Alert>
    );
  }

  function renderNodesEmpty() {
    return <Alert severity="info">No hay nodos registrados</Alert>;
  }

  function renderNodes() {
    return (
      <NodeList
        nodesInfo={nodesData}
        setSnackbarData={setSnackbarData}
        deleteOldNodeFromState={deleteOldNodeFromState}
      />
    );
  }

  function renderContent() {
    if (isLoading) {
      return renderLoading();
    } else if (nodesGetError) {
      return renderNodesGetError();
    } else if (nodesEmpty) {
      return renderNodesEmpty();
    } else {
      return renderNodes();
    }
  }

  return (
    <Dashboard {...props} title="Nodos">
      {renderContent()}
      <Fab
        aria-label="add"
        color="primary"
        className={fabClasses.fab}
        onClick={handleCreateConfirmOpen}
        disabled={!isAdmin()}
      >
        <AddIcon />
      </Fab>
      <NodeCreatePanel
        open={createConfirmOpen}
        handleCreateDialogClose={handleCreateConfirmClose}
        addNewNodeToState={addNewNodeToState}
        setSnackbarData={setSnackbarData}
      />
      <CustomizedSnackbar
        props={snackbarData}
        setSnackbarData={setSnackbarData}
      />
    </Dashboard>
  );
}
