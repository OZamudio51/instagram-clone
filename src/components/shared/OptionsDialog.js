import React from "react";
import { Button, Dialog, Divider, Zoom } from "@material-ui/core";
import { useOptionsDialogStyles } from "../../styles";
import { Link } from "react-router-dom";
import { defaultPost } from "../../data";

const OptionsDialog = ({ onClose }) => {
  const classes = useOptionsDialogStyles();

  return (
    <Dialog
      open
      classes={ {
        scrollPaper: classes.dialogScrollPaper
      } }
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      <Button className={classes.redButton}>
        Unfollow
      </Button>
      <Divider />
      <Button className={classes.button}>
        <Link to={`/p/${defaultPost.id}`}>
          Go to post
        </Link>
      </Button>
      <Divider />
      <Button className={classes.button}>
        Share
      </Button>
      <Divider />
      <Button className={classes.button}>
        Copy Link
      </Button>
      <Divider />
      <Button onClick={onClose} className={classes.button}>
        Cancel
      </Button>
    </Dialog>
  )
}

export default OptionsDialog;
