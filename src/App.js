import React from "react";
import "./App.css";
import InitialDashboard from "./dashboard/InitialDashboard";
import MeasurementsDashboard from "./dashboard/MeasurementsDashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          render={() => (
            <InitialDashboard
              open={open}
              handleDrawerOpen={handleDrawerOpen}
              handleDrawerClose={handleDrawerClose}
            />
          )}
        />
        <Route
          path="/measurements"
          exact
          render={() => (
            <MeasurementsDashboard
              open={open}
              handleDrawerOpen={handleDrawerOpen}
              handleDrawerClose={handleDrawerClose}
            />
          )}
        />
      </Switch>
    </Router>
  );
}

export default App;
