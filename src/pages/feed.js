import React, { useState, Suspense, lazy } from "react";
import { useFeedPageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import UserCard from "../components/shared/UserCard";
// import FeedPost from "../components/feed/FeedPost";
import FeedSideSuggestions from "../components/feed/FeedSideSuggestions";
import { getDefaultPost } from "../data";
import { Hidden } from "@material-ui/core";
import LoadingScreen from "../components/shared/LoadingScreen";
import { LoadingLargeIcon } from "../icons";
import FeedPostSkeleton from "../components/feed/FeedPostSkeleton";
const FeedPost = lazy(() => import("../components/feed/FeedPost"));

const FeedPage = () => {
  const classes = useFeedPageStyles();
  const [isEndOfFeed] = useState(false);

  let loading = false;

  if (loading) return <LoadingScreen />;

  return <Layout>
    <div className={classes.container}>
      <div>
        {Array.from({ length: 5 }, () => getDefaultPost()).map((post, index) => (
          <Suspense key={post.id} fallback={<FeedPostSkeleton />}>
            <FeedPost index={index} post={post}/>
          </Suspense>
        ))}
      </div>
      <Hidden smDown>
          <div className={classes.sidebarContainer}>
            <div className={classes.sidebarWrapper}>
              <UserCard avatarSize={"50px !important"}/>
              <FeedSideSuggestions />
            </div>
          </div>
      </Hidden>
      {!isEndOfFeed && <LoadingLargeIcon />}
    </div>
  </Layout>;
}

export default FeedPage;
