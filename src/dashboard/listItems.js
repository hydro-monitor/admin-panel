import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TableChartIcon from "@material-ui/icons/TableChart";
import PersonIcon from "@material-ui/icons/Person";
import DeveloperBoardIcon from "@material-ui/icons/DeveloperBoard";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";

export const mainListItems = (
  <div>
    <ListItem button component={Link} to="/">
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Inicio" />
    </ListItem>
    <ListItem button component={Link} to="/measurements">
      <ListItemIcon>
        <TableChartIcon />
      </ListItemIcon>
      <ListItemText primary="Mediciones" />
    </ListItem>
    <ListItem button component={Link} to="/nodes">
      <ListItemIcon>
        <DeveloperBoardIcon />
      </ListItemIcon>
      <ListItemText primary="Nodos" />
    </ListItem>
    <ListItem button component={Link} to="/user">
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Usuario" />
    </ListItem>
  </div>
);
