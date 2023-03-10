import React from "react";
import { Typography } from "@material-ui/core";
import { useNavbarStyles } from "../../styles";

const NotificationTooltip = () => {
  const classes = useNavbarStyles();

  return (
    <div className={classes.tooltipContainer}>
      <div className={classes.tooltip}>
        <span aria-label="Followers" className={classes.followers} />
        <Typography>1</Typography>
      </div>
      <div className={classes.tooltip}>
        <span aria-label="Likes" className={classes.likes} />
        <Typography>1</Typography>
      </div>
    </div>
  )
}

export default NotificationTooltip;
