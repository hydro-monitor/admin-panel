import React from "react";
import "./App.css";
import InitialDashboard from "./dashboard/InitialDashboard";
import MeasurementsDashboard from "./dashboard/MeasurementsDashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={InitialDashboard} />
        <Route exact path="/measurements" component={MeasurementsDashboard} />
      </Switch>
    </Router>
  );
}

export default App;
