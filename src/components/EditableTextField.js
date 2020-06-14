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
  const [state, setState] = useState({
    email: "zarlompa",
    editMode: false
  });

  const handleChange = event => {
    setState({
      email: event.target.value,
      editMode: state.editMode
    });
  };

  const handleClick = () => {
    setState({
      email: state.email,
      editMode: !state.editMode
    });
  };

  const { classes, value, label } = props;

  console.log(state);

  const renderButton = () => {
    if (state.editMode) {
      return <SaveIcon />;
    }
    return <EditIcon />;
  };

  return (
    <TextField
      multiline
      defaultValue={value}
      label={label}
      onChange={handleChange}
      disabled={!state.editMode}
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
