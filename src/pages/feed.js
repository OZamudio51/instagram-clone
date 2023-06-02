import React, { useState, Suspense, lazy, useContext, useEffect, useCallback } from "react";
import { useFeedPageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import UserCard from "../components/shared/UserCard";
// import FeedPost from "../components/feed/FeedPost";
import FeedSideSuggestions from "../components/feed/FeedSideSuggestions";
import { Hidden } from "@material-ui/core";
import LoadingScreen from "../components/shared/LoadingScreen";
import { LoadingLargeIcon } from "../icons";
import FeedPostSkeleton from "../components/feed/FeedPostSkeleton";
import { UserContext } from "../App";
import { useQuery } from "@apollo/react-hooks";
import { GET_FEED } from "../graphql/queries";
import { usePageBottom } from "../utils/usePageBottom";
const FeedPost = lazy(() => import("../components/feed/FeedPost"));

const FeedPage = () => {
  const classes = useFeedPageStyles();
  const { me, feedIds } = useContext(UserContext);
  const [isEndOfFeed, setEndOfFeed] = useState(false);
  const variables = { feedIds, limit: 2 };
  const { data, loading, fetchMore } = useQuery(GET_FEED, { variables });
  const isPageBottom = usePageBottom();

  const handleUpdateQuery = useCallback((prev, { fetchMoreResult }) => {

    if (fetchMoreResult.posts.length === 0) {
      setEndOfFeed(true);
      return prev;
    }

    return { posts: [...prev.posts, ...fetchMoreResult.posts]}
  }, [])

  useEffect(() => {
    if (!isPageBottom || !data) return;

    const lastTimestamp = data.posts[data.posts.length - 1].created_at;
    const variables = { limit: 2, feedIds, lastTimestamp };
    fetchMore({ 
      variables,
      updateQuery: handleUpdateQuery
    })
  }, [isPageBottom, data, fetchMore, handleUpdateQuery, feedIds]);
  
  if (loading) return <LoadingScreen />;

  return <Layout>
    <div className={classes.container}>
      <div>
        {data.posts.map((post, index) => (
          <Suspense key={post.id} fallback={<FeedPostSkeleton />}>
            <FeedPost index={index} post={post}/>
          </Suspense>
        ))}
      </div>
      <Hidden smDown>
          <div className={classes.sidebarContainer}>
            <div className={classes.sidebarWrapper}>
              <UserCard user={me} avatarSize={"50px !important"}/>
              <FeedSideSuggestions />
            </div>
          </div>
      </Hidden>
      {!isEndOfFeed && <LoadingLargeIcon />}
    </div>
  </Layout>;
}

export default FeedPage;
