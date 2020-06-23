import React from "react";
import TextField from "@material-ui/core/TextField";

export default function SignInFields({
  setEmail,
  emailError,
  setEmailError,
  setPassword,
  passwordError,
  setPasswordError
}) {
  const handleEmailChange = e => {
    if (emailError) {
      setEmailError(false);
    }
    setEmail(e.target.value);
  };

  const handlePasswordChange = e => {
    if (passwordError) {
      setPasswordError(false);
    }
    setPassword(e.target.value);
  };

  return (
    <React.Fragment>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Dirección email"
        name="email"
        autoComplete="email"
        autoFocus
        onChange={handleEmailChange}
        error={emailError}
      />
      <TextField
        variant="outlined"
        margin="normal"
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
    </React.Fragment>
  );
}
