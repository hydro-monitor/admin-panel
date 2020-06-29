import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import { DeleteButton } from "./Buttons";
import { isNumeric } from "../common/utils";

const styles = theme => ({
  outline: {
    padding: "10px"
  }
});

function StateForm(props) {
  const {
    classes,
    stateNameValue,
    intervalValue,
    picturesNumValue,
    lowerLimitValue,
    upperLimitValue,
    onChange,
    isDefault,
    onDeleteStateClick
  } = props;

  const handleChange = event => {
    onChange(event.target.name, event.target.value);
  };

  const renderNameField = () => {
    if (!isDefault) {
      return (
        <React.Fragment>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="row-reverse">
              <DeleteButton onClick={onDeleteStateClick} />
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
              label="Límite inferior"
              value={lowerLimitValue}
              error={!lowerLimitValue || !isNumeric(lowerLimitValue)}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="upperLimit"
              label="Límite superior"
              value={upperLimitValue}
              error={!upperLimitValue || !isNumeric(upperLimitValue)}
              onChange={handleChange}
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
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="interval"
            label="Intervalo entre fotos"
            value={intervalValue}
            error={!intervalValue || !isNumeric(intervalValue)}
            onChange={handleChange}
          />
        </Grid>
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
          />
        </Grid>
        {renderExtraFields()}
      </Grid>
    </Box>
  );
}

export default withStyles(styles)(StateForm);
