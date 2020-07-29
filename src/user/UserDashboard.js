import React, { useState, useEffect } from "react";
import store from "store";
import { useHistory } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "../dashboard/dashboardStyles";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import PersonIcon from "@material-ui/icons/Person";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CustomizedSnackbar, {
  closeSnack
} from "../components/CustomizedSnackbar";
import UsersClient from "../api/UsersClient";
import SessionClient from "../api/SessionClient";
import { USERS_API, SESSION_API } from "../common/constants";
import { isAdmin, handleLogout } from "../signin/utils";

const usersClient = new UsersClient(USERS_API);
const sessionClient = new SessionClient(SESSION_API);
const useFormStyles = makeStyles(theme => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  userAvatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  lockAvatar: {
    marginTop: theme.spacing(3),
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 0)
  }
}));

function UserInfo() {
  const history = useHistory();
  const classes = useFormStyles();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [typedPassword, setTypedPassword] = useState("");
  const [typedPasswordError, setTypedPasswordError] = useState(false);
  const [typedPasswordHelper, setTypedPasswordHelper] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepetition, setNewPasswordRepetition] = useState("");
  const [
    newPasswordRepetitionHelper,
    setNewPasswordRepetitionHelper
  ] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    severity: "",
    message: ""
  });
  const [typedDeleteAccountPassword, setTypedDeleteAccountPassword] = useState(
    ""
  );
  const [
    typedDeleteAccountPasswordError,
    setTypedDeleteAccountPasswordError
  ] = useState(false);
  const [
    typedDeleteAccountPasswordHelper,
    setTypedDeleteAccountPasswordHelper
  ] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await usersClient.getUserInfo(store.get("user"));
      if (userInfo === null) return;
      setFirstName(userInfo.name);
      setLastName(userInfo.lastName);
      setEmail(userInfo.email);
      setPassword("admin");
    };
    fetchData();
  }, []);

  const handlePasswordChange = e => {
    setTypedPasswordError(false);
    setTypedPasswordHelper("");
    setTypedPassword(e.target.value);
  };
  const handleNewPasswordChange = e => {
    clearNewPasswordHelper();
    setNewPassword(e.target.value);
  };
  const handleNewPasswordRepetitionChange = e => {
    clearNewPasswordHelper();
    setNewPasswordRepetition(e.target.value);
  };
  const clearNewPasswordHelper = () => {
    setNewPasswordError(false);
    setNewPasswordRepetitionHelper("");
  };
  const clearPasswordFields = () => {
    setTypedPassword("");
    setNewPassword("");
    setNewPasswordRepetition("");
  };
  const showPasswordChangeErrorSnack = () => {
    setSnackbarData({
      open: true,
      severity: "error",
      message: "Error al cambiar contraseña"
    });
  };
  const showPasswordChangeSuccessSnack = () => {
    setSnackbarData({
      open: true,
      severity: "success",
      message: "Contraseña cambiada correctamente"
    });
  };
  const changePassword = async e => {
    e.preventDefault();
    closeSnack(setSnackbarData);

    if (newPassword !== newPasswordRepetition) {
      setNewPasswordError(true);
      setNewPasswordRepetitionHelper(
        "La contraseña ingresada no coincide con la contraseña nueva"
      );
      return;
    }

    const user = store.get("user");
    const token = await sessionClient.signIn(store.get("user"), typedPassword);
    if (token !== null) {
      store.set("token", token);
      const userInfo = { password: newPassword };
      if (await usersClient.updateUserInfo(user, userInfo)) {
        console.log(
          password,
          typedPassword,
          newPassword,
          newPasswordRepetition
        );
        console.log("you've changed your pass. yay!");
        showPasswordChangeSuccessSnack();
        clearPasswordFields();
      } else {
        showPasswordChangeErrorSnack();
        clearPasswordFields();
      }
    } else {
      setTypedPasswordError(true);
      setTypedPasswordHelper(
        "La contraseña ingresada no coincide con la contraseña actual"
      );
    }
  };

  const handleDeleteAccountPasswordChange = e => {
    clearDeleteAccountPasswordHelper();
    setTypedDeleteAccountPassword(e.target.value);
  };
  const clearDeleteAccountPasswordHelper = () => {
    setTypedDeleteAccountPasswordError(false);
    setTypedDeleteAccountPasswordHelper("");
  };
  const clearDeleteAccountPasswordFields = () => {
    setTypedDeleteAccountPassword("");
  };
  const showDeleteAccountSuccessSnack = () => {
    setSnackbarData({
      open: true,
      severity: "success",
      message: "Cuenta eliminada correctamente"
    });
  };
  const showDeleteAccountErrorSnack = () => {
    setSnackbarData({
      open: true,
      severity: "error",
      message: "Error al eliminar la cuenta"
    });
  };
  const deleteAccount = async e => {
    e.preventDefault();
    closeSnack(setSnackbarData);

    if (typedDeleteAccountPassword === "") {
      setTypedDeleteAccountPasswordError(true);
      setTypedDeleteAccountPasswordHelper("Ingrese su contraseña");
      return;
    }

    const user = store.get("user");
    const token = await sessionClient.signIn(
      store.get("user"),
      typedDeleteAccountPassword
    );
    if (token !== null) {
      store.set("token", token);
      if (await usersClient.deleteUserInfo(user)) {
        console.log(typedDeleteAccountPassword);
        console.log("you've deleted your account. yay!");
        showDeleteAccountSuccessSnack();
        clearDeleteAccountPasswordFields();
        handleLogout(history);
        return;
      } else {
        showDeleteAccountErrorSnack();
        clearDeleteAccountPasswordFields();
        return;
      }
    } else {
      setTypedDeleteAccountPasswordError(true);
      setTypedDeleteAccountPasswordHelper(
        "La contraseña ingresada no coincide con la contraseña actual"
      );
    }
  };

  return (
    <React.Fragment>
      <div className={classes.paper}>
        <Avatar className={classes.userAvatar}>
          <PersonIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Información de usuario
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                variant="outlined"
                disabled
                fullWidth
                id="firstName"
                label="Nombre"
                autoComplete="fname"
                value={firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                disabled
                fullWidth
                id="lastName"
                label="Apellido"
                name="lastName"
                autoComplete="lname"
                value={lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                disabled
                fullWidth
                id="email"
                label="Dirección email"
                name="email"
                autoComplete="email"
                value={email}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity={isAdmin() ? "info" : "error"}>
                {isAdmin()
                  ? "Este usuario tiene permisos de administrador"
                  : "Este usuario no tiene permisos de administrador"}
              </Alert>
            </Grid>
          </Grid>
        </form>
        <Avatar className={classes.lockAvatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Cambio de contraseña
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Contraseña actual"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handlePasswordChange}
                value={typedPassword}
                error={typedPasswordError}
                helperText={typedPasswordHelper}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Nueva contraseña"
                type="password"
                id="newPassword"
                onChange={handleNewPasswordChange}
                value={newPassword}
                error={newPasswordError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Repetir nueva contraseña"
                type="password"
                id="newPasswordRepetition"
                onChange={handleNewPasswordRepetitionChange}
                value={newPasswordRepetition}
                error={newPasswordError}
                helperText={newPasswordRepetitionHelper}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={changePassword}
          >
            Cambiar contraseña
          </Button>
        </form>
        <Avatar className={classes.lockAvatar}>
          <HighlightOffIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Eliminar cuenta
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="delete-account-password"
                autoComplete="current-password"
                onChange={handleDeleteAccountPasswordChange}
                value={typedDeleteAccountPassword}
                error={typedDeleteAccountPasswordError}
                helperText={typedDeleteAccountPasswordHelper}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
            onClick={deleteAccount}
          >
            Eliminar cuenta
          </Button>
        </form>
      </div>
      <CustomizedSnackbar
        props={snackbarData}
        setSnackbarData={setSnackbarData}
      />
    </React.Fragment>
  );
}

export default function UserDashboard(props) {
  const classes = useStyles();
  return (
    <Dashboard {...props} title="Usuario">
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <UserInfo />
        </Paper>
      </Grid>
    </Dashboard>
  );
}
