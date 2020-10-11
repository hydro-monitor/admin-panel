import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import AssignmentIcon from "@material-ui/icons/Assignment";

const styles = (theme) => ({
  textField: {
    width: "100%",
  },
  button: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
});

function CopiableTextField(props) {
  const { classes, value, label } = props;

  const handleClick = () => {
    console.log("Copying to clipboard", value);
    await navigator.clipboard.writeText(value);
    console.log("Copied");
  };

  return (
    <TextField
      value={value}
      label={label}
      autoFocus
      fullWidth
      disabled
      className={classes.textField}
      InputProps={{
        endAdornment: (
          <IconButton
            onClick={handleClick}
            size="small"
            className={classes.button}
            disableRipple
          >
            <InputAdornment position="end">
              <AssignmentIcon />
            </InputAdornment>
          </IconButton>
        ),
      }}
    />
  );
}

export default withStyles(styles)(CopiableTextField);
