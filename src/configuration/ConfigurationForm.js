import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import StateForm from "./StateForm";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({});

function ConfigurationForm(props) {
  const {
    classes,
    config,
    disabled,
    handleConfigurationUpdate,
    handleCustomStateAddition,
    handleCustomStateDeletion
  } = props;

  const renderCustomStateForms = () => {
    let stateNames = Object.keys(config).sort(); // Sort to that state forms are always rendered in the same order
    let statesNum = stateNames.length;
    let customStates = [];
    for (let i = 0; i < statesNum; i++) {
      if (stateNames[i] === "default") {
        continue;
      }
      customStates.push(
        <Grid item xs={12} key={stateNames[i]}>
          <StateForm
            stateNameValue={config[stateNames[i]].stateName}
            intervalValue={config[stateNames[i]].interval}
            picturesNumValue={config[stateNames[i]].picturesNum}
            lowerLimitValue={config[stateNames[i]].lowerLimit}
            upperLimitValue={config[stateNames[i]].upperLimit}
            onChange={(propName, value) =>
              handleConfigurationUpdate(stateNames[i], propName, value)
            }
            onDeleteStateClick={() => handleCustomStateDeletion(stateNames[i])}
            disabled={disabled}
          />
        </Grid>
      );
    }
    return customStates;
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StateForm
            intervalValue={(config.default && config.default.interval) || ""}
            picturesNumValue={
              (config.default && config.default.picturesNum) || ""
            }
            isDefault
            onChange={(propName, value) =>
              handleConfigurationUpdate("default", propName, value)
            }
            onDeleteStateClick={() => handleCustomStateDeletion("default")}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Configuraciones avanzadas</Typography>
        </Grid>
        {renderCustomStateForms()}
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleCustomStateAddition}
            disabled={disabled}
          >
            Agregar configuración avanzada
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default withStyles(styles)(ConfigurationForm);