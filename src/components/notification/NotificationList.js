import React, { useEffect, useRef } from "react";
import { Avatar, Grid, Typography } from "@material-ui/core";
// import { defaultNotifications } from "../../data";
import { useNotificationListStyles } from "../../styles";
import { Link } from "react-router-dom";
import FollowButton from "../shared/FollowButton";
import useOutsideClick from "@rooks/use-outside-click";
import { useMutation } from "@apollo/react-hooks";
import { CHECK_NOTIFICATIONS } from "../../graphql/mutations";
import { formatDateToNowShort } from "../../utils/formatDate";

const NotificationList = ({ handleHideList, notifications, currentUserId }) => {
  const classes = useNotificationListStyles();
  const listContainerRef = useRef();
  useOutsideClick(listContainerRef, handleHideList);
  const [checkNotifications] = useMutation(CHECK_NOTIFICATIONS);

  useEffect(() => {
    const variables = {
      userId: currentUserId,
      lastChecked: new Date().toISOString()
    }

    checkNotifications({ variables });
  }, [currentUserId, checkNotifications]);

  return (
    <Grid ref={listContainerRef} className={classes.listContainer} container>
      {notifications.map(notification => {
        const isLike = notification.type === "like";
        const isFollow = notification.type === "follow";

        return (
          <Grid key={notification.id} item className={classes.listItem}>
            <div className={classes.listItemWrapper}>
              <div className={classes.avatarWrapper}>
                <Avatar src={notification.user.profile_image} alt="user avatar" />
              </div>
              <div className={classes.nameWrapper}>
                <Link to={`/${notification.user.username}`}>
                  <Typography variant="body1">
                  {notification.user.username}
                  </Typography>
                </Link>
                <Typography variant="body2" color="textSecondary" className={classes.typography}>
                  {isLike && `likes your photo. ${formatDateToNowShort(notification.created_at)}`}
                  {isFollow && `started following you. ${formatDateToNowShort(notification.created_at)}`}
                </Typography>
              </div>
            </div>
            <div>
              {isLike && (
                <Link to={`/p/${notification.post.id}`}>
                  <Avatar src={notification.post.media} alt="post cover" />
                </Link>
              )}
              {isFollow && <FollowButton id={notification.user.id} />}
            </div>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default NotificationList;
