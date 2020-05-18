import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

export default function NodesSelect({ node, setNode, nodes, setParentNode }) {
  const classes = useStyles();
  const handleChange = event => {
    if (node === event.target.value) {
      return;
    }
    setNode(event.target.value);
    setParentNode(event.target.value);
  };

  function nodeList(nodes) {
    let nodeOptions = [];
    for (let i = 0; i < nodes.length; i++) {
      nodeOptions.push(
        <MenuItem key={i} value={nodes[i]}>
          {nodes[i]}
        </MenuItem>
      );
    }
    return nodeOptions;
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel shrink id="demo-simple-select-label">
          Nombre
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={node}
          onChange={handleChange}
        >
          {nodeList(nodes)}
        </Select>
      </FormControl>
    </div>
  );
}
