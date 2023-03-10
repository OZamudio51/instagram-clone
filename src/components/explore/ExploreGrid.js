import { Typography } from "@material-ui/core";
import React from "react";
import { LoadingLargeIcon } from "../../icons";
import { useExploreGridStyles } from "../../styles";
import { getDefaultPost } from "../../data";
import GridPost from "../shared/GridPost";

const ExploreGrid = () => {
  const classes = useExploreGridStyles();

  let loading = false;

  return (
    <>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        component="h2"
        gutterBottom
        className={classes.typography}
      >
        Explore
      </Typography>
      {loading ? (
        <LoadingLargeIcon />
      ) : (
        <article className={classes.article}>
          <div className={classes.postContainer}>
            {Array.from({ length: 20}, () => getDefaultPost()).map(post => (
              <GridPost key={post.id} post={post}/>
            ))}
          </div>
        </article>
      )}
    </>
  )
}

export default ExploreGrid;
