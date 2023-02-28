import React, { useState } from "react";
import { useFeedPostStyles } from "../../styles";
import UserCard from "../shared/UserCard";
import { CommentIcon, LikeIcon, MoreIcon, RemoveIcon, SaveIcon, ShareIcon, UnlikeIcon } from "../../icons";
import { Link } from "react-router-dom";
import { Button, Divider, Typography, Hidden, TextField } from "@material-ui/core";
import HTMLEllipsis from "react-lines-ellipsis/lib/html";
import FollowSuggestions from "../shared/FollowSuggestions";
import OptionsDialog from "../shared/OptionsDialog";

const FeedPost = ({ post, index }) => {
 const classes = useFeedPostStyles();
 const [showCaption, setCaption] = useState(false);
 const [showOptionsDialog, setOptionsDialog] = useState();
 const { media, id, likes, user, caption, comments } = post;

 const showFollowSuggestions = index === 1;

  return (
    <>
      <article className={classes.article}
        style={ {marginBottom: showFollowSuggestions && 30} }
      >
        <div className={classes.postHeader}>
          <UserCard user={user} />
          <MoreIcon 
            className={classes.moreIcon}
            onClick={() => setOptionsDialog(true)}
          />
        </div>
        <div>
          <img src={media} alt="Post media" className={classes.image} />
        </div>
        <div className={classes.postButtonsWrapper}>
          <div className={classes.postButtons}>
            <LikeButton />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveButton />
          </div>
          <Typography className={classes.like} variant="subtitle2">
            <span>{likes === 1 ? "1 like" : `${likes} likes`}</span>
          </Typography>
          <div className={showCaption ? classes.expanded : classes.collapsed}>
            <Link to={`/${user.username}`}>
              <Typography 
                variant="subtitle2"
                component="span"
                className={classes.username}
              >
                {user.username}
              </Typography>
            </Link>
            {showCaption ? (
              <Typography
                variant="body2"
                component="span"
                dangerouslySetInnerHTML={ { __html: caption } }
              />
            ) : (
                  <div className={classes.captionWrapper}>
                    <HTMLEllipsis
                      unsafeHTML={caption}
                      className={classes.caption}
                      maxLine="0"
                      ellipsis="..."
                      basedOn="letters"
                    />
                    <Button
                      className={classes.moreButton}
                      onClick={() => setCaption(true)}
                    >
                      more
                    </Button>
                  </div>
                )}
          </div>
          <Link to={`/p/${id}`}>
            <Typography
              className={classes.commentsLink}
              variant="body2"
              component="div"
            >
              View all {comments.length} comments
            </Typography>
          </Link>
          {comments.map(comment => (
            <div key={comment.id}>
              <Link to={`/${comment.user.username}`}>
                <Typography
                  variant="subtitle2"
                  component="span"
                  className={classes.commentUsername}
                >
                  {comment.user.username}
                </Typography>{" "}
                <Typography
                  variant="body2"
                  component="span"
                >
                  {comment.content}
                </Typography>
              </Link>
            </div>
          ))}
          <Typography color="textSecondary" className={classes.datePosted}>
            5 DAYS AGO
          </Typography>
        </div>
        <Hidden xsDown>
          <Divider />
          <Comment />
        </Hidden>
      </article>
      {showFollowSuggestions && <FollowSuggestions />}
      {showOptionsDialog && <OptionsDialog onClose={() => setOptionsDialog(false)}/>}
    </>
  )
}

const LikeButton = () => {
  const classes = useFeedPostStyles();
  const [liked, setLiked] = useState(false);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;

  const handleLike = () => {
    console.log("Like");
    setLiked(true);
  }

  const handleUnlike = () => {
    console.log("Unlike");
    setLiked(false);
  }

  const onClick = liked ? handleUnlike : handleLike;

  return <Icon className={className} onClick={onClick} />;
}

const SaveButton = () => {
  const classes = useFeedPostStyles();
  const [saved, setSaved] = useState(false);
  const Icon = saved ? RemoveIcon : SaveIcon;

  const handleSave = () => {
    console.log("Saved");
    setSaved(true);
  }

  const handleUnSave = () => {
    console.log("Unsaved");
    setSaved(false);
  }

  const onClick = saved ? handleUnSave : handleSave;

  return <Icon className={classes.saveIcon} onClick={onClick} />;
}

const Comment = () => {
  const classes = useFeedPostStyles();
  const [content, setContent] = useState("");

  return (
    <div className={classes.commentContainer}>
    <TextField 
      fullWidth
      value={content}
      placeholder="Add a comment..."
      multiline
      maxRows={2}
      minRows={1}
      onChange={event => setContent(event.target.value)}
      className={classes.textField}
      InputProps={ {
        classes: {
          root: classes.root,
          underline: classes.underline
        }
      } }
    />
    <Button
      color="primary"
      className={classes.commentButton}
      disabled={!content.trim()}
    >
      Post
    </Button>
  </div>
  )
}

export default FeedPost;