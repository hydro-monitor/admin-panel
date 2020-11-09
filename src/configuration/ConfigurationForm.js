import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import StateForm from "./StateForm";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({});

function ConfigurationForm(props) {
  const {
    config,
    disabled,
    handleConfigurationUpdate,
    handleCustomStateAddition,
    handleCustomStateDeletion,
  } = props;

  const [limitsOverlap, setLimitsOverlap] = useState(false);

  useEffect(() => {
    console.log("Validating state limits", config);
    let intervals = [];

    for (let [key, value] of Object.entries(config)) {
      console.log(key, value);
      if (key === "default") {
        console.log("Skipping default state");
        continue;
      }
      if (
        !value.hasOwnProperty("lowerLimit") ||
        !value.hasOwnProperty("upperLimit")
      ) {
        console.log("Value has a missing limit property", value);
        continue;
      }
      console.log("Pushing interval: ", [value.lowerLimit, value.upperLimit]);
      intervals.push([value.lowerLimit, value.upperLimit]);
    }

    function intervalComparator(a, b) {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    }

    intervals = intervals.sort(intervalComparator);
    console.log("Sorted intervals: ", intervals);

    for (let i = 1; i < intervals.length; i++) {
      if (intervals[i - 1][1] > intervals[i][0]) {
        // OVERLAPPING!!
        console.log(
          "OVERLAPPING!! Intervals overlap: ",
          intervals[i - 1],
          intervals[i]
        );
        setLimitsOverlap(true);
        return;
      }
    }
  }, [config]);

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
            limitsOverlap={limitsOverlap}
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
