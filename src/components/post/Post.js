import React, { useState } from "react";
import { usePostStyles } from "../../styles";
import UserCard from "../shared/UserCard";
import { CommentIcon, LikeIcon, MoreIcon, RemoveIcon, SaveIcon, ShareIcon, UnlikeIcon } from "../../icons";
import { Link } from "react-router-dom";
// import { Button, Divider, Typography, Hidden, TextField } from "@material-ui/core";
import { Button, Divider, Typography, TextField } from "@material-ui/core";
import OptionsDialog from "../shared/OptionsDialog";
import { defaultPost } from "../../data";
import PostSkeleton from "./PostSkeleton";

const Post = () => {
 const classes = usePostStyles();
 const [loading, setLoading] = useState(true);
 const [showOptionsDialog, setOptionsDialog] = useState();
 const { media, id, likes, user, caption, comments } = defaultPost;

 setTimeout(() => setLoading(false), 2000);

 if (loading) return <PostSkeleton />

  return (
    <div className={classes.postContainer}>
      <article className={classes.article}
      >
        <div className={classes.postHeader}>
          <UserCard user={user} avatarSize={32} />
          <MoreIcon 
            className={classes.moreIcon}
            onClick={() => setOptionsDialog(true)}
          />
        </div>
        <div className={classes.postImage}>
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
          <Typography className={classes.likes} variant="subtitle2">
            <span>{likes === 1 ? "1 like" : `${likes} likes`}</span>
          </Typography>
          <div className={classes.postCaptionContainer}>
            <Typography 
              variant="body2"
              component="span"
              className={classes.postCaption}
              dangerouslySetInnerHTML={ {__html: caption} }
            />
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
          </div>
          <Typography color="textSecondary" className={classes.datePosted}>
            5 DAYS AGO
          </Typography>
        {/* <Hidden xsDown> */}
          <div className={classes.comment}>
            <Divider />
            <Comment />
          </div>
        {/* </Hidden> */}
        </div>
      </article>
      {showOptionsDialog && <OptionsDialog onClose={() => setOptionsDialog(false)}/>}
    </div>
  )
}

const LikeButton = () => {
  const classes = usePostStyles();
  const [liked, setLiked] = useState(false);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;

  const handleLike = () => setLiked(true);

  const handleUnlike = () => setLiked(false);

  const onClick = liked ? handleUnlike : handleLike;

  return <Icon className={className} onClick={onClick} />;
}

const SaveButton = () => {
  const classes = usePostStyles();
  const [saved, setSaved] = useState(false);
  const Icon = saved ? RemoveIcon : SaveIcon;

  const handleSave = () => setSaved(true);

  const handleUnSave = () => setSaved(false);

  const onClick = saved ? handleUnSave : handleSave;

  return <Icon className={classes.saveIcon} onClick={onClick} />;
}

const Comment = () => {
  const classes = usePostStyles();
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

export default Post;