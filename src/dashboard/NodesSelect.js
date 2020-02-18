import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

export default function NodesSelect({ nodes }) {
  const classes = useStyles();
  const [age, setAge] = useState(nodes[0]);
  /*
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);
*/
  const handleChange = event => {
    setAge(event.target.value);
  };

  function nodeList(nodes) {
    let nodeOptions = [];
    for (let i = 0; i < nodes.length; i++) {
      nodeOptions.push(<MenuItem value={nodes[i]}>{nodes[i]}</MenuItem>);
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
          value={age}
          onChange={handleChange}
        >
          {nodeList(nodes)}
        </Select>
      </FormControl>
    </div>
  );
}
