import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Grow from "@material-ui/core/Grow";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Title from "./Title";
import NodesSelect from "./NodesSelect";
import LinearProgress from "@material-ui/core/LinearProgress";
import PhotoIcon from "@material-ui/icons/Photo";
import Alert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { handleErrors } from "../common/server";
import { sleep, not, union, intersection } from "../common/utils";
import NodesClient from "../api/NodesClient";
import ReadingsClient from "../api/ReadingsClient";
import { WEB_API, NODES_API } from "../common/constants";
import { isAdmin } from "../signin/utils";
import CustomizedSnackbar from "../components/CustomizedSnackbar";
import DeleteButton from "../components/DeleteButton";
import Chart from "./ChartComponent";
import store from "store";

const nodesClient = new NodesClient(NODES_API);
const readingsClient = new ReadingsClient(NODES_API);

function manualReadingBoolToString(wasManual) {
  if (wasManual) {
    return "Manual";
  }
  return "Programada";
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
  },
  deleteMeasurementsButton: {
    paddingLeft: "20px"
  }
}));

const pictureStyles = makeStyles(theme => ({
  img: {
    maxHeight: "100%",
    maxWidth: "100%"
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
  const classes = pictureStyles();
  const [photoNotFound, setPhotoNotFound] = useState(false);
  const [open, setOpen] = useState(false);
  const getReadingPhotoURL =
    WEB_API + "/api/nodes/" + node + "/readings/" + readingId + "/photos";

  async function fetchConfig(url) {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${store.get("token")}`);
    await fetch(url, { headers: myHeaders })
      .then(handleErrors)
      .then(async response => {
        console.log("picture response is: ", response);
        setPhotoNotFound(false);
      })
      .catch(error => {
        console.log(error);
        setPhotoNotFound(true);
      });
  }

  return (
    <React.Fragment>
      <IconButton
        aria-label="photo"
        size="small"
        onClick={() => {
          fetchConfig(getReadingPhotoURL);
          setOpen(true);
        }}
      >
        <PhotoIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              {photoNotFound ? (
                <Alert severity="warning">
                  No existe ninguna foto asociada a esta medición.
                </Alert>
              ) : (
                <img className={classes.img} src={getReadingPhotoURL} />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
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
  const [checked, setChecked] = useState([]);
  const [readingsPageState, setReadingsPageState] = useState("");
  const [theresMoreReadings, setTheresMoreReadings] = useState(true);
  const readingsPageSize = 15;

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
        try {
          const {
            json,
            newReadingsPageState,
            theresMoreReadings
          } = await readingsClient.getReadings(
            node,
            readingsPageSize,
            readingsPageState
          );
          updateData(json);
          setReadingsPageState(newReadingsPageState);
          if (!theresMoreReadings) {
            setTheresMoreReadings(false);
          }
          setIsLoadingData(false);
        } catch (error) {
          console.log(error);
          updateData(null);
          setIsLoadingData(false);
        }
      }
    };
    fetchData();
  }, [node, isLoading]); // FIXME review hooks

  console.log(
    nodes,
    node,
    data,
    isLoading,
    isLoadingData,
    "checked: ",
    checked
  );

  const changeNodeAndTable = name => {
    setNode(name);
    setNodeDescription(nodesData[name].description);
    setIsLoadingData(true);
    updateData(undefined);
    setChecked([]);
    setReadingsPageState("");
    setTheresMoreReadings(true);
  };

  const handleNewMeasurementRequest = async () => {
    console.log("Request new measurement");
    if (await nodesClient.updateNode(node, { manualReading: true })) {
      setSnackbarData({
        open: true,
        severity: "success",
        message: "Medición manual pedida"
      });
    } else {
      setSnackbarData({
        open: true,
        severity: "error",
        message: "Error al pedir una medición manual"
      });
    }
  };

  const handleDeleteCheckToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleDeleteToggleAll = items => () => {
    if (numberOfDeletesChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const numberOfDeletesChecked = items => intersection(checked, items).length;

  const handleDeleteMeasurement = async items => {
    console.log("Deleting items: ", items);
    setSnackbarData({
      open: true,
      severity: "info",
      message: "Eliminando mediciones seleccionadas"
    });

    const result = readingsClient.deleteReadings(node, items);
    await sleep(1000); // TODO Remove when web api integration is done

    updateData(not(data, checked));
    setChecked([]);

    if (result) {
      setSnackbarData({
        open: true,
        severity: "success",
        message: "Mediciones eliminadas"
      });
    } else {
      setSnackbarData({
        open: true,
        severity: "error",
        message: "Una o más mediciones no pudieron ser borradas"
      });
    }
  };

  const handleLoadMoreReadings = async event => {
    event.preventDefault();
    if (theresMoreReadings) {
      try {
        const {
          json,
          newReadingsPageState,
          theresMoreReadings
        } = await readingsClient.getReadings(
          node,
          readingsPageSize,
          readingsPageState
        );
        if (Array.isArray(json)) {
          updateData(data.concat(json));
        }
        setReadingsPageState(newReadingsPageState);
        if (!theresMoreReadings) {
          setTheresMoreReadings(false);
        }
      } catch (error) {
        console.log(error);
        // snack showing error
      }
    }
  };

  function renderData() {
    return (
      <React.Fragment>
        <Chart data={Array.isArray(data) ? data : []} />
        <Grow in>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    size="small"
                    onClick={handleDeleteToggleAll(data)}
                    checked={
                      numberOfDeletesChecked(data) === data.length &&
                      data.length !== 0
                    }
                    indeterminate={
                      numberOfDeletesChecked(data) !== data.length &&
                      numberOfDeletesChecked(data) !== 0
                    }
                    disabled={!isAdmin() || data.length === 0}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Nivel de agua (cm)</TableCell>
                <TableCell>Tipo de medición</TableCell>
                <TableCell align="right">Foto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(row => (
                <TableRow key={row.readingId}>
                  <TableCell>
                    <Checkbox
                      size="small"
                      className={classes.deleteCheckbox}
                      onClick={handleDeleteCheckToggle(row)}
                      checked={checked.indexOf(row) !== -1}
                      disabled={!isAdmin()}
                    />
                  </TableCell>
                  <TableCell>{row.readingId}</TableCell>
                  <TableCell>{new Date(row.readingTime).toString()}</TableCell>
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
        </Grow>

        <Grow in>
          <Box display="flex">
            <Box display="inline-flex" justifyContent="flex-start" flexGrow={1}>
              <Box
                alignSelf="flex-end"
                className={classes.deleteMeasurementsButton}
              >
                <DeleteButton
                  tooltip="Delete measurements"
                  onClick={() => handleDeleteMeasurement(checked)}
                  disabled={!isAdmin() || checked.length === 0}
                />
              </Box>
            </Box>
            <Box alignSelf="flex-end" className={classes.seeMore}>
              <Link
                color="primary"
                color={theresMoreReadings ? "primary" : "textPrimary"}
                underline={theresMoreReadings ? "hover" : "none"}
                onClick={handleLoadMoreReadings}
              >
                {theresMoreReadings
                  ? "Ver más mediciones"
                  : "No hay más mediciones"}
              </Link>
            </Box>
          </Box>
        </Grow>
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
        <Grow in>
          <Grid container>
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
        </Grow>
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
