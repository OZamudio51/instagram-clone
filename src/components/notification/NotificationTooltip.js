import React from "react";
import { Typography } from "@material-ui/core";
import { useNavbarStyles } from "../../styles";

const NotificationTooltip = ({ notifications }) => {
  const classes = useNavbarStyles();

  const countNotifications = notificationType => notifications.filter(({ type }) => type === notificationType).length;

  const followCount = countNotifications("follow");
  const likeCount = countNotifications("like"); 

  return (
    <div className={classes.tooltipContainer}>
    {followCount > 0 && <div className={classes.tooltip}>
        <span aria-label="Followers" className={classes.followers} />
        <Typography>{followCount}</Typography>
      </div>}
     {likeCount > 0 && <div className={classes.tooltip}>
        <span aria-label="Likes" className={classes.likes} />
        <Typography>{likeCount}</Typography>
      </div>}
    </div>
  )
}

export default NotificationTooltip;
