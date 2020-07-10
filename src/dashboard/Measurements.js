import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Title from "./Title";
import NodesSelect from "./NodesSelect";
import LinearProgress from "@material-ui/core/LinearProgress";
import PhotoIcon from "@material-ui/icons/Photo";
import Alert from "@material-ui/lab/Alert";
import { handleErrors } from "../common/server";
import { sleep } from "../common/utils";
import NodesClient from "../api/NodesClient";
import { WEB_API, NODES_API } from "../common/constants";
import { isAdmin } from "../signin/utils";
import CustomizedSnackbar from "../components/CustomizedSnackbar";

const nodesClient = new NodesClient(NODES_API);

function manualReadingBoolToString(wasManual) {
  if (wasManual) {
    return "Sí";
  }
  return "No";
}

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3)
  },
  description: {
    paddingTop: "10px",
    paddingBottom: "10px"
  },
  newMeasurementButton: {
    marginBottom: theme.spacing(1)
  }
}));

function ManualMeasurementButton({ classes, onClick, disabled }) {
  return (
    <IconButton
      aria-label="new"
      size="small"
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      <AddIcon />
    </IconButton>
  );
}

function PhotoLink({ node, readingId }) {
  const [photoNotFound, setPhotoNotFound] = useState(false);

  async function fetchConfig(url) {
    await fetch(url)
      .then(handleErrors)
      .then(async response => {
        console.log(response);
        setPhotoNotFound(false);
      })
      .catch(error => {
        console.log(error);
        setPhotoNotFound(true);
      });
  }
  function useFetch(url) {
    // empty array as second argument equivalent to componentDidMount
    useEffect(() => {
      fetchConfig(url);
    }, [url]);
  }

  const getReadingPhotoURL =
    WEB_API + "/api/nodes/" + node + "/readings/" + readingId + "/photos";
  useFetch(getReadingPhotoURL);

  return (
    <IconButton
      aria-label="photo"
      size="small"
      disabled={photoNotFound}
      href={getReadingPhotoURL}
    >
      <PhotoIcon />
    </IconButton>
  );
}

export default function Measurements() {
  const classes = useStyles();

  const [nodes, setNodes] = useState([]);
  const [node, setNode] = useState("");
  const [data, updateData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [nodesData, setNodesData] = useState({});
  const [nodeDescription, setNodeDescription] = useState("");
  const [nodesGetError, setNodesGetError] = useState(false);
  const [nodesEmpty, setNodesEmpty] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    severity: "",
    message: ""
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await sleep(1000); // TODO Remove when testing is done
      try {
        const nodesAndDescriptions = await nodesClient.getNodes();
        setNodesData(nodesAndDescriptions);
        const nodeList = Object.keys(nodesAndDescriptions).sort();
        setNodes(nodeList);
        if (Object.entries(nodesAndDescriptions).length === 0) {
          setNodesEmpty(true);
          return;
        }
        setNode(nodeList[0]);
        setNodeDescription(nodesAndDescriptions[nodeList[0]].description);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setNodes([]);
        setNodesGetError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log("FETCH DATA HOOK");
      setIsLoadingData(true);
      if (!isLoading && !nodesEmpty) {
        await sleep(1000); // TODO Remove when testing is done
        await fetch(WEB_API + "/api/nodes/" + node + "/readings")
          .then(handleErrors)
          .then(async response => {
            console.log(response);
            const json = await response.json();
            updateData(json);
            setIsLoadingData(false);
          })
          .catch(error => {
            console.log(error);
            updateData(null);
            setIsLoadingData(false);
          });
      }
    };
    fetchData();
  }, [node, isLoading]); // FIXME review hooks

  console.log(nodes, node, data, isLoading, isLoadingData);

  const changeNodeAndTable = name => {
    setNode(name);
    setNodeDescription(nodesData[name].description);
    setIsLoadingData(true);
    updateData(undefined);
  };

  const handleNewMeasurementRequest = () => {
    console.log("Request new measurement");
    // TODO integrar con web-api
    // open snack with measurement result of request, for example, the success snack would be:
    setSnackbarData({
      open: true,
      severity: "success",
      message: "Medición manual pedida"
    });
  };

  function renderData() {
    return (
      <React.Fragment>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Nivel de agua</TableCell>
              <TableCell>Medición Manual</TableCell>
              <TableCell align="right">Foto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <TableRow key={row.readingId}>
                <TableCell>{row.readingId}</TableCell>
                <TableCell>{row.readingTime}</TableCell>
                <TableCell>{row.waterLevel}</TableCell>
                <TableCell>
                  {manualReadingBoolToString(row.manualReading)}
                </TableCell>
                <TableCell align="right">
                  <PhotoLink node={node} readingId={row.readingId} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className={classes.seeMore}>
          <Link color="primary" href="#" onClick={preventDefault}>
            Ver más mediciones
          </Link>
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
        No se pudieron consultar las mediciones del nodo {node}
      </Alert>
    );
  }

  function renderNoMeasurements() {
    return <Alert severity="info">El nodo {node} no tiene mediciones</Alert>;
  }

  function renderNodesGetError() {
    return (
      <Alert severity="error">No se pudo consultar la lista de nodos</Alert>
    );
  }

  function renderNodesEmpty() {
    return <Alert severity="info">No hay nodos registrados</Alert>;
  }

  function renderMeasurementsGetError() {
    return (
      <Alert severity="error">
        No se pudo consultar la lista de mediciones para el nodo {node}
      </Alert>
    );
  }

  function renderTableContent() {
    if (isLoadingData) {
      return renderLoading();
    } else if (!isLoadingData && data === null) {
      return renderError();
    } else if (!isLoadingData && Array.isArray(data) && data.length === 0) {
      return renderNoMeasurements();
    } else if (!isLoadingData && data === null) {
      return renderMeasurementsGetError();
    } else {
      return renderData();
    }
  }

  function renderTable() {
    return (
      <React.Fragment>
        <Grid container>
          {}
          <Grid item xs={12} md={12} lg={12}>
            <Box display="flex">
              <Box
                display="inline-flex"
                justifyContent="flex-start"
                flexGrow={1}
              >
                <Box alignSelf="flex-end">
                  <Title>Mediciones de nodo</Title>
                </Box>
                <Box>
                  <div>
                    <NodesSelect
                      node={node}
                      setNode={setNode}
                      nodes={nodes}
                      setParentNode={changeNodeAndTable}
                    />
                  </div>
                </Box>
              </Box>
              <Box alignSelf="flex-end">
                <ManualMeasurementButton
                  onClick={handleNewMeasurementRequest}
                  disabled={!isAdmin()}
                  classes={classes.newMeasurementButton}
                />
              </Box>
            </Box>
          </Grid>
          {}
          <Grid item xs={12} md={12} lg={12} className={classes.description}>
            <TextField
              label="Descripción"
              value={nodeDescription}
              variant="outlined"
              fullWidth
              multiline
              disabled
            />
          </Grid>
        </Grid>
        {renderTableContent()}
        <CustomizedSnackbar
          props={snackbarData}
          setSnackbarData={setSnackbarData}
        />
      </React.Fragment>
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
      return renderTable();
    }
  }

  return <React.Fragment>{renderContent()}</React.Fragment>;
}
