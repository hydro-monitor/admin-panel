import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../components/Copyright";
import { sleep } from "../common/utils";
import CustomizedSnackbar, {
  closeSnack
} from "../components/CustomizedSnackbar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import SignInFields from "../signin/SignInFields";
import UsersClient from "../api/UsersClient";
import SessionClient from "../api/SessionClient";
import { USERS_API, SESSION_API } from "../common/constants";

const usersClient = new UsersClient(USERS_API);
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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    severity: "",
    message: ""
  });
  const [registerAsAdminChecked, setRegisterAsAdminChecked] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminEmailError, setAdminEmailError] = useState(false);
  const [adminPasswordError, setAdminPasswordError] = useState(false);

  const isValidEmail = email => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const signUpDataIsValid = () => {
    if (firstName === "") {
      setFirstNameError(true);
      return false;
    } else if (lastName === "") {
      setLastNameError(true);
      return false;
    } else if (email === "" || !isValidEmail(email)) {
      setEmailError(true);
      return false;
    } else if (password === "") {
      setPasswordError(true);
      return false;
    }
    if (registerAsAdminChecked) {
      if (adminEmail === "" || !isValidEmail(adminEmail)) {
        setAdminEmailError(true);
        return false;
      } else if (adminPassword === "") {
        setAdminPasswordError(true);
        return false;
      }
    }
    return true;
  };
  const parentAdminCredentialsAreValid = () =>
    sessionClient.signIn(adminEmail, adminPassword) !== null;

  const signUp = async e => {
    e.preventDefault();
    closeSnack(setSnackbarData);

    if (!signUpDataIsValid()) {
      return;
    }

    let user = {
      name: firstName,
      lastName: lastName,
      email,
      password
    };
    if (registerAsAdminChecked && (await parentAdminCredentialsAreValid())) {
      user = { admin: true, ...user };
    } else {
      setAdminEmailError(true);
      setAdminPasswordError(true);
      return;
    }

    if (await usersClient.createUser(user)) {
      showSignUpSuccessSnack();
      await sleep(2000); // Time for user to read success snackbar
      history.push("/signin");
    } else {
      showSignUpErrorSnack();
    }
  };

  const handleFirstNameChange = e => {
    setFirstNameError(false);
    setFirstName(e.target.value);
  };

  const handleLastNameChange = e => {
    setLastNameError(false);
    setLastName(e.target.value);
  };

  const handleEmailChange = e => {
    setEmailError(false);
    setEmail(e.target.value);
  };

  const handlePasswordChange = e => {
    setPasswordError(false);
    setPassword(e.target.value);
  };

  const showSignUpErrorSnack = () => {
    setSnackbarData({
      open: true,
      severity: "error",
      message: "Error al registrar nuevo usuario"
    });
  };
  const showSignUpSuccessSnack = () => {
    setSnackbarData({
      open: true,
      severity: "success",
      message: "Usuario registrado, redireccionando a ingreso..."
    });
  };
  const registerAsAdmin = () => {
    setRegisterAsAdminChecked(!registerAsAdminChecked);
  };

  const parentAdminSignIn = () => {
    if (registerAsAdminChecked) {
      return (
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Ingrese las credenciales de un administrador
          </Typography>
          <SignInFields
            setEmail={setAdminEmail}
            emailError={adminEmailError}
            setEmailError={setAdminEmailError}
            setPassword={setAdminPassword}
            setPasswordError={setAdminPasswordError}
            passwordError={adminPasswordError}
          />
        </Grid>
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registrarse
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Nombre"
                autoFocus
                onChange={handleFirstNameChange}
                error={firstNameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Apellido"
                name="lastName"
                autoComplete="lname"
                onChange={handleLastNameChange}
                error={lastNameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Dirección email"
                name="email"
                autoComplete="email"
                onChange={handleEmailChange}
                error={emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handlePasswordChange}
                error={passwordError}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={registerAsAdminChecked}
                    onChange={registerAsAdmin}
                    name="admin"
                    color="primary"
                  />
                }
                label="Registrarme como administrador"
              />
            </Grid>
            {parentAdminSignIn()}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={signUp}
          >
            Registrarme
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                ¿Ya tiene una cuenta? Iniciar sesión
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <CustomizedSnackbar
        props={snackbarData}
        setSnackbarData={setSnackbarData}
      />
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
