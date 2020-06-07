import React from "react";
import "./App.css";
import InitialDashboard from "./dashboard/InitialDashboard";
import MeasurementsDashboard from "./dashboard/MeasurementsDashboard";
import NodesDashboard from "./configuration/NodesDashboard";
import UserDashboard from "./user/UserDashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignIn from "./signin/SignIn";
import SignUp from "./signup/SignUp";

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
        <Route path="/signin" exact render={() => <SignIn />} />
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
        <Route
          path="/nodes"
          exact
          render={() => (
            <NodesDashboard
              open={open}
              handleDrawerOpen={handleDrawerOpen}
              handleDrawerClose={handleDrawerClose}
            />
          )}
        />
        <Route
          path="/user"
          exact
          render={() => (
            <UserDashboard
              open={open}
              handleDrawerOpen={handleDrawerOpen}
              handleDrawerClose={handleDrawerClose}
            />
          )}
        />
        <Route path="/signup" exact render={() => <SignUp />} />
      </Switch>
    </Router>
  );
}

export default App;
