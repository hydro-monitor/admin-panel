import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import store from "store";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../components/Copyright";
import SignInFields from "./SignInFields";
import CustomizedSnackbar, {
  closeSnack
} from "../components/CustomizedSnackbar";
import { SESSION_API } from "../common/constants";
import SessionClient from "../api/SessionClient";

const sessionClient = new SessionClient(SESSION_API);
const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    severity: "",
    message: ""
  });

  const classes = useStyles();
  const history = useHistory();

  const signIn = async e => {
    e.preventDefault();
    closeSnack(setSnackbarData);
    const token = await sessionClient.signIn(email, password);
    if (token !== null) {
      console.log("you're logged in. yay!");
      store.set("loggedIn", true);
      store.set("user", email);
      store.set("admin", true); // TODO set to true if server says user is admin, otherwise false
      store.set("token", token);
      history.push("/");
    } else {
      signInErrorSnack();
    }
  };

  const signInErrorSnack = () => {
    setSnackbarData({
      open: true,
      severity: "error",
      message: "Las credenciales ingresadas son incorrectas"
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Iniciar sesión
        </Typography>
        <form className={classes.form} noValidate>
          <SignInFields
            setEmail={setEmail}
            emailError={false}
            setPassword={setPassword}
            passwordError={false}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={signIn}
          >
            Iniciar sesión
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Recuperar contraseña
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Crear nueva cuenta"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <CustomizedSnackbar
        props={snackbarData}
        setSnackbarData={setSnackbarData}
      />
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
