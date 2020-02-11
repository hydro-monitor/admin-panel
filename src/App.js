import React from 'react';
import './App.css';
import Dashboard from './dashboard/Dashboard';
import MeasurementsDashboard from './dashboard/MeasurementsDashboard';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route exact path="/measurements" component={MeasurementsDashboard} />
      </Switch>
    </Router>
  );
}

export default App;
