import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import DeleteButton from "../components/DeleteButton";
import { isNumeric } from "../common/utils";

const styles = (theme) => ({
  outline: {
    padding: "10px",
  },
});

function StateForm(props) {
  const {
    classes,
    stateNameValue,
    intervalValue,
    //picturesNumValue,
    lowerLimitValue,
    upperLimitValue,
    onChange,
    isDefault,
    onDeleteStateClick,
    disabled,
    limitsOverlap,
  } = props;

  const handleChange = (event) => {
    onChange(event.target.name, event.target.value);
  };

  const renderNameField = () => {
    if (!isDefault) {
      return (
        <React.Fragment>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="row-reverse">
              <DeleteButton onClick={onDeleteStateClick} disabled={disabled} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="stateName"
              label="Nombre"
              value={stateNameValue}
              error={!stateNameValue}
              onChange={handleChange}
              disabled={disabled}
            />
          </Grid>
        </React.Fragment>
      );
    }
  };

  const renderExtraFields = () => {
    if (!isDefault) {
      return (
        <React.Fragment>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="lowerLimit"
              label="Límite inferior (cm)"
              value={lowerLimitValue}
              error={
                lowerLimitValue === "" ||
                !isNumeric(lowerLimitValue) ||
                limitsOverlap
              }
              onChange={handleChange}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="upperLimit"
              label="Límite superior (cm)"
              value={upperLimitValue}
              error={
                upperLimitValue === "" ||
                !isNumeric(upperLimitValue) ||
                limitsOverlap
              }
              onChange={handleChange}
              disabled={disabled}
            />
          </Grid>
        </React.Fragment>
      );
    }
  };

  return (
    <Box
      border={1}
      borderRadius={4}
      borderColor="grey.200"
      className={classes.outline}
    >
      <Grid container spacing={2}>
        {renderNameField()}
        <Grid item xs={12} sm={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="interval"
            label="Intervalo entre fotos (s)"
            value={intervalValue}
            error={!intervalValue || !isNumeric(intervalValue)}
            onChange={handleChange}
            disabled={disabled}
          />
        </Grid>
        {/*
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="picturesNum"
            label="Cantidad de fotos por medición"
            value={picturesNumValue}
            error={!picturesNumValue || !isNumeric(picturesNumValue)}
            onChange={handleChange}
            disabled={disabled}
          />
        </Grid>
        */}
        {renderExtraFields()}
      </Grid>
    </Box>
  );
}

export default withStyles(styles)(StateForm);
