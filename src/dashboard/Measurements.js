import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import NodesSelect from "./NodesSelect";
import LinearProgress from "@material-ui/core/LinearProgress";
import PhotoIcon from "@material-ui/icons/Photo";
import IconButton from "@material-ui/core/IconButton";
import Alert from "@material-ui/lab/Alert";
import { handleErrors, sleep } from "./server";

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
  }
}));

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
    "http://antiguos.fi.uba.ar:443/api/nodes/" +
    node +
    "/readings/" +
    readingId +
    "/photos";
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
  const nodesURL = "http://antiguos.fi.uba.ar:443/api/nodes";
  const [measurementsURL, setMeasurementsURL] = useState("");

  useEffect(() => {
    const fetchNodes = async () => {
      console.log("FETCH NODES HOOK");
      setIsLoading(true);
      await sleep(1000); // TODO Remove when testing is done
      await fetch(nodesURL)
        .then(handleErrors)
        .then(async response => {
          console.log(response);
          const json = await response.json();
          const nodesList = json.map(item => item.id).sort();
          setNodes(nodesList);
          setNode(nodesList[0]);
          setIsLoading(false);
          setMeasurementsURL(
            "http://antiguos.fi.uba.ar:443/api/nodes/" +
              nodesList[0] +
              "/readings"
          );
        })
        .catch(error => {
          console.log(error);
          setNodes([]);
          // TODO handle loading on error
        });
    };
    fetchNodes();
  }, [nodesURL]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("FETCH DATA HOOK");
      setIsLoadingData(true);
      if (!isLoading) {
        await sleep(1000); // TODO Remove when testing is done
        await fetch(measurementsURL)
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
            // TODO handle loadingData on error
          });
      }
    };
    fetchData();
  }, [measurementsURL, isLoading]); // FIXME review hooks

  console.log(nodes, node, data, measurementsURL, isLoading, isLoadingData);

  const changeNodeAndTable = name => {
    setNode(name);
    setMeasurementsURL(
      "http://antiguos.fi.uba.ar:443/api/nodes/" + name + "/readings"
    );
    setIsLoadingData(true);
    updateData(undefined);
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

  function renderTableContent() {
    if (isLoadingData) {
      return renderLoading();
    } else if (!isLoadingData && data === null) {
      return renderError();
    } else {
      return renderData();
    }
  }

  function renderTable() {
    return (
      <React.Fragment>
        <div style={{ display: "inline-flex" }}>
          <div style={{ alignSelf: "flex-end" }}>
            <Title>Mediciones de nodo</Title>
          </div>
          <div>
            <NodesSelect nodes={nodes} setParentNode={changeNodeAndTable} />
          </div>
        </div>
        {renderTableContent()}
      </React.Fragment>
    );
  }

  function renderContent() {
    if (isLoading) {
      return renderLoading();
    } else {
      return renderTable();
    }
  }

  return <React.Fragment>{renderContent()}</React.Fragment>;
}
