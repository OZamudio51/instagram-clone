import { Button } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useFollowButtonStyles } from "../../styles";
import { UserContext } from "../../App";
import { useMutation } from "@apollo/react-hooks";
import { FOLLOW_USER, UNFOLLOW_USER } from "../../graphql/mutations";

const FollowButton = ({ side, id }) => {
  const classes = useFollowButtonStyles({ side });
  const { currentUserId, followingIds } = useContext(UserContext);
  const isAlreadyFollowing = followingIds.some(followingId => followingId === id);
  const [isFollowing, setFollowing] = useState(isAlreadyFollowing);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const variables = {
    userIdToFollow : id,
    currentUserId
  }

  const handleFollowUser = () => {
    setFollowing(true);
    followUser({ variables });
  }

  const handleUnfollowUser = () => {
    setFollowing(false);
    unfollowUser({ variables });
  }
 
  const followButton = (
    <Button
      variant={side ? "text" : "contained"}
      color="primary"
      className={classes.button}
      onClick={handleFollowUser}
      fullWidth
    >
      Follow
    </Button>
  );

  const followingButton = (
    <Button
      variant={side ? "text" : "outlined"}
      className={classes.button}
      onClick={handleUnfollowUser}
      fullWidth
    >
      Following
    </Button>
  );

  return isFollowing ? followingButton : followButton;
}

export default FollowButton;