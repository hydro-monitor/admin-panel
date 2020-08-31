import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import TableChartIcon from "@material-ui/icons/TableChart";
import PersonIcon from "@material-ui/icons/Person";
import DeveloperBoardIcon from "@material-ui/icons/DeveloperBoard";
import SettingsIcon from "@material-ui/icons/Settings";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";
import { getUser } from "../signin/utils";

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
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Administración</ListSubheader>
    <ListItem button component={Link} to="/nodes">
      <ListItemIcon>
        <DeveloperBoardIcon />
      </ListItemIcon>
      <ListItemText primary="Nodos" />
    </ListItem>
    <ListItem button component={Link} to="/configurations">
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Configuraciones" />
    </ListItem>
  </div>
);

export function tertiaryListItems() {
  const email = getUser();

  return (
    <div>
      <ListSubheader inset>Información</ListSubheader>
      <ListItem button component={Link} to="/user">
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText
          primary="Usuario"
          secondary={
            <span
              style={{
                fontSize: "0.7rem",
                margin: 0
              }}
            >
              {email}
            </span>
          }
        />
      </ListItem>
    </div>
  );
}
