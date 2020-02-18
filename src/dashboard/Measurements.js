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

function manualReadingBoolToString(wasManual) {
  if (wasManual) {
    return "Sí";
  }
  return "No";
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3)
  }
}));

export default function Measurements() {
  const classes = useStyles();
  const nodes = ["lujan-1", "lujan-2", "lujan-3", "areco-1"]; // TODO get nodes from server?
  const [node, setNode] = useState(nodes[0]);
  const [data, updateData] = useState(undefined);
  const changeNodeAndTable = name => {
    setNode(name);
    updateData(undefined);
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

  const URL = "http://antiguos.fi.uba.ar:443/api/nodes/" + node + "/readings";
  const rows = useFetch(URL);
  console.log(rows);

  function renderTable() {
    return (
      <React.Fragment>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Nivel de agua</TableCell>
              <TableCell align="right">Medición Manual</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.readingId}>
                <TableCell>{row.readingId}</TableCell>
                <TableCell>{row.readingTime}</TableCell>
                <TableCell>{row.waterLevel}</TableCell>
                <TableCell align="right">
                  {manualReadingBoolToString(row.manualReading)}
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
      <LinearProgress variant="determinate" value={100} color="secondary" />
    );
  }

  function renderContent() {
    if (rows) {
      return renderTable();
    } else if (rows === undefined) {
      // Cuando todavia no obtuve el resultado del servidor
      return renderLoading();
    } else if (rows === null) {
      // Cuando no hay informacion para el nodo
      return renderError();
    }
  }

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
      {renderContent()}
    </React.Fragment>
  );
}