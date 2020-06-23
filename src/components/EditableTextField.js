import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = theme => ({
  textField: {
    width: "100%"
  },
  button: {
    "&:hover": {
      backgroundColor: "transparent"
    }
  }
});

function EditableTextField(props) {
  const { classes, value, setValue, label, onSave } = props;

  const [state, setState] = useState({
    text: value,
    onEdit: false
  });

  const handleChange = event => {
    setValue(event.target.value);
    setState({
      text: event.target.value,
      onEdit: state.onEdit
    });
  };

  const handleClick = () => {
    if (state.onEdit) {
      // User is saving
      onSave();
      setState({
        text: state.text,
        onEdit: false
      });
      return;
    }
    // User is trying to edit
    setState({
      text: state.text,
      onEdit: true
    });
  };

  const renderButton = () => {
    if (state.onEdit) {
      return <SaveIcon />;
    }
    return <EditIcon />;
  };

  return (
    <TextField
      multiline
      value={value}
      label={label}
      onChange={handleChange}
      disabled={!state.onEdit}
      variant="outlined"
      className={classes.textField}
      InputProps={{
        endAdornment: (
          <IconButton
            onClick={handleClick}
            size="small"
            className={classes.button}
            disableRipple
          >
            <InputAdornment position="end">{renderButton()}</InputAdornment>
          </IconButton>
        )
      }}
    />
  );
}

export default withStyles(styles)(EditableTextField);
