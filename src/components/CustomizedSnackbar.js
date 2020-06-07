import React, { useEffect, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

export const closeSnack = setSnackbarData => {
  setSnackbarData({
    open: false,
    severity: "",
    message: ""
  });
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CustomizedSnackbar({ props, setSnackbarData }) {
  const [snackbarState, setSnackbarState] = useState(props);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarData({ ...snackbarState, open: false });
  };

  useEffect(() => {
    console.log("snackbar updated");
    setSnackbarState(props);
  }, [props]);

  return (
    <Snackbar
      open={snackbarState.open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={snackbarState.severity}>
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
}
