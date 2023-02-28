import React from "react";
import { Typography } from "@material-ui/core";
import { useGridPostStyles } from "../../styles";
import { useHistory } from "react-router-dom";

const GridPost = ({ post }) => {
  const history = useHistory();
  const classes = useGridPostStyles();

  const handleOpenPostModal = () => {
    history.push({
      pathname: `/p/${post.id}`,
      state: { modal: true }
    })
  }

  return (
    <div onClick={handleOpenPostModal} className={classes.gridPostContainer}>
      <div className={classes.gridPostOverlay}>
        <div className={classes.gridPostInfo}>
          <span className={classes.likes} />
          <Typography>{post.likes}</Typography>
        </div>
        <div className={classes.gridPostInfo}>
          <span className={classes.comments} />
          <Typography>{post.comments.length}</Typography>
        </div>
      </div>
      <img src={post.media} alt="Post cover" className={classes.image} />
    </div>
  )
}

export default GridPost;
