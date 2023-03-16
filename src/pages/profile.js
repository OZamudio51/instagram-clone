import React, { useContext, useState } from "react";
import Layout from "../components/shared/Layout";
import { useProfilePageStyles } from "../styles";
import { defaultCurrentUser } from "../data";
import { Button, Card, CardContent, Dialog, DialogTitle, Hidden, Typography, Zoom, Divider, Avatar } from "@material-ui/core";
import ProfilePicture from "../components/shared/ProfilePicture";
import { Link, useHistory } from "react-router-dom";
import { GearIcon } from "../icons";
import ProfileTabs from "../components/profile/ProfileTabs";
import { AuthContext } from "../auth";

const ProfilePage = () => {
  const classes = useProfilePageStyles();
  const isOwner = true;
  const [showOptionsMenu, setOptionsMenu] = useState(false);

  const handleOptionsMenuClick = () => setOptionsMenu(true);

  const handleCloseMenu = () => setOptionsMenu(false);

  return <Layout title={`${defaultCurrentUser.name} (@${defaultCurrentUser.username})`}>
    <div className={classes.container}>
      <Hidden xsDown>
        <Card className={classes.cardLarge}>
          <ProfilePicture isOwner={isOwner} />
          <CardContent className={classes.cardContentLarge}>
            <ProfileNameSection 
              user={defaultCurrentUser}
              isOwner={isOwner}
              handleOptionsMenuClick={handleOptionsMenuClick}
            />
            <PostCountSection user={defaultCurrentUser} />
            <NameBioSection user={defaultCurrentUser} />
          </CardContent>
        </Card>
      </Hidden>
      <Hidden smUp>
        <Card className={classes.cardSmall}>
          <CardContent>
            <section className={classes.sectionSmall}>
              <ProfilePicture size={77} user={defaultCurrentUser} isOwner={isOwner}handleOptionsMenuClick={handleOptionsMenuClick} />
              <ProfileNameSection 
                user={defaultCurrentUser}
                isOwner={isOwner}
                handleOptionsMenuClick={handleOptionsMenuClick}
              />
            </section>
            <NameBioSection user={defaultCurrentUser} />
          </CardContent>
          <PostCountSection user={defaultCurrentUser} />
        </Card>
      </Hidden>
      {showOptionsMenu && <OptionsMenu handleCloseMenu={handleCloseMenu} />}
      <ProfileTabs user={defaultCurrentUser} isOwner={isOwner} />
    </div>
  </Layout>;
}

const ProfileNameSection = ({ user, isOwner, handleOptionsMenuClick }) => {
  const classes = useProfilePageStyles();
  const [showUnfollowDialog, setUnfollowDialog] = useState();

  let followButton;
  const isFollowing = true;
  const isFollower = false;

  if (isFollowing) {
    followButton = (
      <Button onClick={() => setUnfollowDialog(true)} variant="outlined" className={classes.button}>
        Following
      </Button>
    );
  } else if (isFollower) {
    followButton = (
      <Button variant="contained" color="primary" className={classes.button}>
        Follow Back
      </Button>
    );
  } else {
    followButton = (
      <Button variant="contained" color="primary" className={classes.button}>
        Follow
      </Button>
    );
  }

  return (
    <>
      <Hidden xsDown>
        <section className={classes.usernameSection}>
        <Typography className={classes.username}>
              {user.username}
            </Typography>
          {isOwner ? (
            <>
              <Link to="/accounts/edit">
                <Button variant="outlined">Edit Profile</Button>
              </Link>
              <div onClick={handleOptionsMenuClick} className={classes.settingsWrapper}>
                <GearIcon className={classes.settings} />
              </div>
            </>
          ) : (
            <>
              {followButton}
            </>
          )}
        </section>
      </Hidden>
      <Hidden smUp>
        <section>
          <div className={classes.usernameDivSmall}>
            <Typography className={classes.username}>
              {user.username}
            </Typography>
            {isOwner && (
              <div onClick={handleOptionsMenuClick} className={classes.settingsWrapper}>
                <GearIcon className={classes.settings} />
              </div>
            )}
          </div>
          {isOwner ? (
            <Link to="/accounts/edit">
                <Button variant="outlined" style={ { width: "100%" } }>Edit Profile</Button>
            </Link>
          ) : followButton}
        </section>
      </Hidden>
      {showUnfollowDialog && (
        <UnfollowDialog user={user} onClose={() => setUnfollowDialog(false)} />
      )}
    </>
  )
}

const UnfollowDialog = ({ onClose, user }) => {
  const classes = useProfilePageStyles();

  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.unfollowDialogScrollPaper,
      }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      <div className={classes.wrapper}>
        <Avatar src={user.profile_image} alt={`${user.username}'s avatar`} className={classes.avatar} />
      </div>
      <Typography align="center" variant="body2" className={classes.unfollowDialogText}>
        Unfollow @{user.username}?
      </Typography>
      <Divider />
      <Button className={classes.unfollowButton}>
        Unfollow
      </Button>
      <Divider />
      <Button onClick={onClose} className={classes.cancelButton}>
        Cancel
      </Button>
    </Dialog>
  )
}

const PostCountSection = ({ user }) => {
  const classes = useProfilePageStyles();
  const options = ["posts", "followers", "following"];

  return (
    <>
      <Hidden smUp>
        <Divider />
      </Hidden>
      <section className={classes.followingSection}>
        {options.map(option => (
          <div key={option} className={classes.followingText}>
            <Typography className={classes.followingCount}>
              {user[option].length}
            </Typography>
            <Hidden xsDown>
              <Typography>{option}</Typography>
            </Hidden>
            <Hidden smUp>
              <Typography color="textSecondary">{option}</Typography>
            </Hidden>
          </div>
        ))}
      </section>
      <Hidden smUp>
        <Divider />
      </Hidden>
    </>
  )
}

const NameBioSection = ({ user }) => {
  const classes = useProfilePageStyles();
  const { name, bio, website } = user;

  return (
    <section className={classes.section}>
      <Typography className={classes.typography}>{name}</Typography>
      <Typography>{bio}</Typography>
      <a href={website} target="_blank" rel="noopener noreferrer">
        <Typography color="secondary" className={classes.typography}>{website}</Typography>
      </a>
    </section>
  )
}

const OptionsMenu = ({ handleCloseMenu }) => {
  const classes = useProfilePageStyles();
  const {signOut} = useContext(AuthContext);
  const [showLogOutMessage, setLogOutMessage] = useState(false);
  const history = useHistory();

  const handleLogOutClick = () => {
    setLogOutMessage(true);
    
    setTimeout(() => {
      signOut();
      history.push("/accounts/login");
    }, 2000)
  }

  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.dialogScrollPaper,
        paper: classes.dialogPaper
      }}
      TransitionComponent={Zoom}
    >
    {showLogOutMessage ? (
      <DialogTitle className={classes.dialogTitle}>
        Logging Out
        <Typography>
          You need to log back in to continue using Instagram.
        </Typography>
      </DialogTitle>
    ) : (
      <>
        <OptionsItem text="Change Password" />
        <OptionsItem text="Nametag" />
        <OptionsItem text="Authorized Apps" />
        <OptionsItem text="Notifications" />
        <OptionsItem text="Privacy and Security" />
        <OptionsItem text="Log Out" onClick={handleLogOutClick} />
        <OptionsItem text="Cancel" onClick={handleCloseMenu} />
      </>
    )}
    </Dialog>
  )
}

const OptionsItem = ({ text, onClick }) => {
  return (
    <>
      <Button style={ { padding: "12px 8px"} } onClick={onClick}>
        {text}
      </Button>
      <Divider />
    </>
  )
}

export default ProfilePage;
