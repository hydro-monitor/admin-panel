import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";

export default function DeleteButton({
  size,
  tooltip,
  classes,
  onClick,
  disabled
}) {
  const btn = () => (
    <IconButton
      color="secondary"
      aria-label="delete"
      size={size || "small"}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      <DeleteIcon />
    </IconButton>
  );
  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <div>{btn()}</div>
      </Tooltip>
    );
  }
  return btn();
}
