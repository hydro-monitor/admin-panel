import React, { useState } from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import Title from "../dashboard/Title";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grow from "@material-ui/core/Grow";
import { isAdmin } from "../signin/utils";
import EditableTextField from "../components/EditableTextField";
import NodeDeletePanel from "./NodeDeletePanel";
import DeleteButton from "../components/DeleteButton";
import NodesClient from "../api/NodesClient";
import { NODES_API } from "../common/constants";
import { useStyles } from "../dashboard/dashboardStyles";

const nodesClient = new NodesClient(NODES_API);

const styles = theme => ({
  depositContext: {
    flex: 1
  }
});

function Node(props) {
  const {
    node,
    nodeDescription,
    setSnackbarData,
    deleteOldNodeFromState
  } = props;

  const classes = useStyles();
  const paperStyle = clsx(classes.paper);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const handleDeleteConfirmOpen = () => setDeleteConfirmOpen(true);
  const handleDeleteConfirmClose = () => setDeleteConfirmOpen(false);

  const [description, setDescription] = useState(nodeDescription);
  const handleDescriptionUpdate = async (node, desc) => {
    if (await nodesClient.updateNode(node, { description: desc })) {
      setSnackbarData({
        open: true,
        severity: "success",
        message: "Descripción del nodo actualizada"
      });
    } else {
      setSnackbarData({
        open: true,
        severity: "error",
        message: "Error al intentar actualizar la descripción del nodo"
      });
      setDescription(nodeDescription);
    }
  };

  return (
    <Grow in>
      <Paper className={paperStyle}>
        <Box display="flex">
          <Box display="inline-flex" justifyContent="flex-start" flexGrow={1}>
            <Box alignSelf="flex-end">
              <Title>{node}</Title>
            </Box>
          </Box>
          <Box alignSelf="flex-start">
            <DeleteButton
              onClick={handleDeleteConfirmOpen}
              disabled={!isAdmin()}
            />
            <NodeDeletePanel
              open={deleteConfirmOpen}
              node={node}
              handleDeleteDialogClose={handleDeleteConfirmClose}
              deleteOldNodeFromState={deleteOldNodeFromState}
              setSnackbarData={setSnackbarData}
            />
          </Box>
        </Box>

        <EditableTextField
          label="Descripción"
          value={description}
          setValue={setDescription}
          onSave={() => handleDescriptionUpdate(node, description)}
          disabled={!isAdmin()}
        />
      </Paper>
    </Grow>
  );
}

export default withStyles(styles)(Node);
