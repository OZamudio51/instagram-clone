import React, { useContext, useState } from "react";
import { usePostStyles } from "../../styles";
import UserCard from "../shared/UserCard";
import {
  CommentIcon,
  LikeIcon,
  MoreIcon,
  RemoveIcon,
  SaveIcon,
  ShareIcon,
  UnlikeIcon,
} from "../../icons";
import { Link } from "react-router-dom";
// import { Button, Divider, Typography, Hidden, TextField } from "@material-ui/core";
import {
  Button,
  Divider,
  Typography,
  TextField,
  Avatar,
} from "@material-ui/core";
import OptionsDialog from "../shared/OptionsDialog";
// import { defaultPost } from "../../data";
import PostSkeleton from "./PostSkeleton";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import { GET_POST } from "../../graphql/subscriptions";
import { UserContext } from "../../App";
import { CREATE_COMMENT, LIKE_POST, SAVE_POST, UNLIKE_POST, UNSAVE_POST } from "../../graphql/mutations";
import { formatDateToNowShort, formatPostDate } from "../../utils/formatDate";
import Img from "react-graceful-image";

const Post = ({ postId }) => {
  const classes = usePostStyles();
  //  const [loading, setLoading] = useState(true);
  const [showOptionsDialog, setOptionsDialog] = useState(false);
  const variables = { postId };
  const { data, loading } = useSubscription(GET_POST, { variables });
  //  setTimeout(() => setLoading(false), 2000);

  if (loading) return <PostSkeleton />;

  const {
    media,
    id,
    likes,
    likes_aggregate,
    saved_posts,
    user,
    caption,
    comments,
    created_at,
    location,
  } = data.posts_by_pk;

  const likesCount = likes_aggregate.aggregate.count;

  return (
    <div className={classes.postContainer}>
      <article className={classes.article}>
        <div className={classes.postHeader}>
          <UserCard user={user} location={location} avatarSize={32} />
          <MoreIcon
            className={classes.moreIcon}
            onClick={() => setOptionsDialog(true)}
          />
        </div>
        <div className={classes.postImage}>
          <Img src={media} alt="Post media" className={classes.image} />
        </div>
        <div className={classes.postButtonsWrapper}>
          <div className={classes.postButtons}>
            <LikeButton likes={likes} postId={id} authorId={user.id} />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveButton savedPosts={saved_posts} postId={id} />
          </div>
          <Typography className={classes.likes} variant="subtitle2">
            <span>{likesCount === 1 ? "1 like" : `${likesCount} likes`}</span>
          </Typography>
          <div
            style={{
              overflowY: "scroll",
              padding: "16px 12px",
              height: "100%",
            }}
          >
            <AuthorCaption
              user={user}
              createdAt={created_at}
              caption={caption}
            />
            {comments.map((comment) => (
              <UserComment key={comment.id} comment={comment} />
            ))}
          </div>
          <Typography color="textSecondary" className={classes.datePosted}>
            {formatPostDate(created_at)}
          </Typography>
          {/* <Hidden xsDown> */}
          <div className={classes.comment}>
            <Divider />
            <Comment postId={id} />
          </div>
          {/* </Hidden> */}
        </div>
      </article>
      {showOptionsDialog && (
        <OptionsDialog postId={id} authorId={user.id} onClose={() => setOptionsDialog(false)} />
      )}
    </div>
  );
};

const AuthorCaption = ({ user, createdAt, caption }) => {
  const classes = usePostStyles();

  return (
    <div style={{ display: "flex" }}>
      <Avatar
        src={user.profile_image}
        alt="User avatar"
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to={`/${user.username}`}>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.username}
            style={{ marginRight: "-17px !important" }}
          >
            {user.username}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            className={classes.postCaption}
            dangerouslySetInnerHTML={{ __html: caption }}
          />
        </Link>
        <Typography
          style={{ marginTop: 16, marginBottom: 4, display: "inline-block" }}
          color="textSecondary"
          variant="caption"
        >
          {formatDateToNowShort(createdAt)}
        </Typography>
      </div>
    </div>
  );
};

const UserComment = ({ comment }) => {
  const classes = usePostStyles();

  return (
    <div style={{ display: "flex" }}>
      <Avatar
        src={comment.user.profile_image}
        alt="User avatar"
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to={`/${comment.user.username}`}>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.username}
          >
            {comment.user.username}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            className={classes.postCaption}
          >
            {comment.content}
          </Typography>
        </Link>
        <Typography
          style={{ marginTop: 16, marginBottom: 4, display: "inline-block" }}
          color="textSecondary"
          variant="caption"
        >
          {formatDateToNowShort(comment.created_at)}
        </Typography>
      </div>
    </div>
  );
};

const LikeButton = ({ likes, authorId, postId }) => {
  const classes = usePostStyles();
  const { currentUserId } = useContext(UserContext);
  const isAlreadyLiked  = likes.some(({ user_id }) => user_id === currentUserId);
  const [liked, setLiked] = useState(isAlreadyLiked);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const variables = {
    postId,
    userId: currentUserId,
    profileId: authorId
  }
  
  const handleLike = () => {
    setLiked(true);
    likePost({ variables });
  }
  
  const handleUnlike = () => {
    setLiked(false);
    unlikePost({ variables });
  }
  
  const onClick = liked ? handleUnlike : handleLike;

  return <Icon className={className} onClick={onClick} />;
};

const SaveButton = ({ postId, savedPosts }) => {
  const classes = usePostStyles();
  const { currentUserId } = useContext(UserContext);
  const isAlreadySaved = savedPosts.some(({ user_id }) => user_id === currentUserId);
  const [saved, setSaved] = useState(isAlreadySaved);
  const Icon = saved ? RemoveIcon : SaveIcon;
  const [savePost] = useMutation(SAVE_POST);
  const [unsavePost] = useMutation(UNSAVE_POST);
  const variables = {
    postId,
    userId: currentUserId,
    // profileId: authorId
  }

  const handleSave = () => {
    setSaved(true);
    savePost({ variables })
  }

  const handleUnSave = () => {
    setSaved(false);
    unsavePost({ variables });
  }

  const onClick = saved ? handleUnSave : handleSave;

  return <Icon className={classes.saveIcon} onClick={onClick} />;
};

const Comment = ({ postId }) => {
  const classes = usePostStyles();
  const { currentUserId } = useContext(UserContext)
  const [content, setContent] = useState("");
  const [createComment] = useMutation(CREATE_COMMENT);

  const handleAddComment = () => {
    const variables = {
      content,
      postId,
      userId: currentUserId
    }

    createComment({ variables });
    setContent("");
  }

  return (
    <div className={classes.commentContainer}>
      <TextField
        fullWidth
        value={content}
        placeholder="Add a comment..."
        multiline
        maxRows={2}
        minRows={1}
        onChange={(event) => setContent(event.target.value)}
        className={classes.textField}
        InputProps={{
          classes: {
            root: classes.root,
            underline: classes.underline,
          },
        }}
      />
      <Button
        onClick={handleAddComment}
        color="primary"
        className={classes.commentButton}
        disabled={!content.trim()}
      >
        Post
      </Button>
    </div>
  );
};

export default Post;
