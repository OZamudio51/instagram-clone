import React, { useContext, useState } from "react";
import { Drawer, IconButton, Hidden, List, ListItem, ListItemText, Typography, TextField, Button, Snackbar, Slide } from "@material-ui/core";
import Layout from "../components/shared/Layout";
import { useEditProfilePageStyles } from "../styles";
import { Menu } from "@material-ui/icons";
// import { defaultCurrentUser } from "../data";
import ProfilePicture from "../components/shared/ProfilePicture";
import { UserContext } from "../App";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_EDIT_USER_PROFILE } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { useForm } from "react-hook-form";
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import { EDIT_USER, EDIT_USER_AVATAR } from "../graphql/mutations";
import { AuthContext } from "../auth";
import { handleImageUpload } from "../utils/handleImageUpload";

const EditProfilePage = ({ history }) => {
  const { currentUserId } = useContext(UserContext);
  const variables = { id: currentUserId };
  const { data, loading } = useQuery(GET_EDIT_USER_PROFILE, { variables });
  const classes = useEditProfilePageStyles();
  const [showDrawer, setDrawer] = useState(false);
  const path = history.location.pathname;

  if (loading) return <LoadingScreen />

  const handleToggleDrawer = () => setDrawer(prev => !prev);

  const handleSelected = index => {
    switch(index) {
      case 0:
        return path.includes("edit");
      default: 
        break;    
    }
  }

  const handleListClick = index => {
    switch(index) {
      case 0:
        history.push("/accounts/edit");
        break;
      default:
        break;
    }
  }

  const options = [
    "Edit Profile", 
    "Change Password", 
    "Apps and Websites", 
    "Email and SMS", 
    "Push Notifications", 
    "Manage Contacts", 
    "Privacy and Security", 
    "Login Activity", 
    "Emails from Instagram"
  ];

  const drawer = (
    <List>
      {options.map((option, index) => (
        <ListItem
          key={option}
          button
          selected={handleSelected(index)}
          onClick={() => handleListClick(index)}
          classes={ { 
            selected: classes.listItemSelected,
            button: classes.listItemButton,
          } }
        >
          <ListItemText primary={option} />
        </ListItem>
      ))}
    </List>
  )

  return (
    <Layout title="Edit Profile">
      <section className={classes.section}>
        <IconButton edge="start"
          onClick={handleToggleDrawer}
          className={classes.menuButton}
        >
          <Menu />
        </IconButton>
        <nav>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="left"
              open={showDrawer}
              onClose={handleToggleDrawer}
              classes={ {
                paperAnchorLeft: classes.temporaryDrawer
              } }
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css"
            className={classes.permanentDrawerRoot}
          >
            <Drawer
              variant="permanent"
              open
              classes={ {
                paper: classes.permanentDrawerPaper,
                root: classes.permanentDrawerRoot
              } }
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main>
          {path.includes("edit") && <EditUserInfo user={data.users_by_pk}/>}
        </main>
      </section>
    </Layout>
  )
}

const DEFAULT_ERROR = { type: "", message: "" };

const EditUserInfo = ({ user }) => {
  const classes = useEditProfilePageStyles();
  const { register, handleSubmit } = useForm({ mode: "onBlur" });
  const { updateEmail } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(user.profile_image);
  const [editUser] = useMutation(EDIT_USER);
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
  const [error, setError] = useState(DEFAULT_ERROR);
  const [open, setOpen] = useState(false);

  const onSubmit = async data => {
    try {
      setError(DEFAULT_ERROR);
      const variables = { ...data, id: user.id }
      await updateEmail(data.email);
      await editUser({ variables });
      setOpen(true);
    } catch(err) {
      console.error("error updating profile:", err);
      handleError(err);
    }
  }

  const handleError = err => {
    // if (err.message.includes("users_username_key")) {
    //   setError("Username already taken");
    // } else if (err.message.includes("(auth/email-already-in-use)")) {
    //   setError("Email already in use");
    // } else if (err.message.includes("Password should be at least 6 characters (auth/weak-password).")) {
    //   setError("Password should be at least 6 characters.");
    // } else {
    //   setError(err.message);
    // }

    // const cleanedMessage = err.message.split("Firebase:");
    if (err.message.includes("users_username_key")) {
      setError({ type: "username", message: "This username is already taken." });
    } else if (err.message.includes("(auth/email-already-in-use)")) {
      const cleanedMessage = err.message.split("Firebase:");

      setError({ type: "email", message: cleanedMessage[1] })
    }
  }

  const handleUpdateProfilePic = async e => {
    const url = await handleImageUpload(e.target.files[0], "instagram-avatar");
    const variables = { id: user.id, profileImage: url };
    await editUserAvatar({ variables });
    setProfileImage(url);
  }

  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture size={38} image={profileImage} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            {user.username}
          </Typography>
          <input 
            accept="image/*"
            id="image"
            type="file"
            style={{display: "none"}}
            onChange={handleUpdateProfilePic}
          />
          <label htmlFor="image">
            <Typography
              color="primary"
              variant="body2"
              className={classes.typographyChangePic}>
              Change Profile Photo
            </Typography>
          </label>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        {/* <SectionItem text="Name" {...register("name", {
          required: true,
          minLength: 5,
          maxLength: 20
        })} 
        formItem={user.name} /> */}
        <div className={classes.sectionItemWrapper}>
          <aside>
            <Hidden xsDown>
              <Typography className={classes.typography} align="right">
                Name
              </Typography>
            </Hidden>
            <Hidden smUp>
              <Typography className={classes.typography}>
                Name
              </Typography>
            </Hidden>
          </aside>
          <TextField
            name="name"
            variant="outlined"
            fullWidth
            defaultValue={user.name}
            type="text"
            className={classes.textField}
            inputprop={
              {
                className: classes.textFieldInput
              }
            }
            {...register("name", {
              required: true,
              minLength: 5,
              maxLength: 20
            })}
          >

          </TextField>
        </div>
        {/* <SectionItem text="Username" {...register("Username", {
          required: true,
          pattern: /^[a-zA-Z0-9_.]*$/,
          minLength: 5,
          maxLength: 20
        })}
        formItem={user.username} /> */}

        <div className={classes.sectionItemWrapper}>
          <aside>
            <Hidden xsDown>
              <Typography className={classes.typography} align="right">
                Username
              </Typography>
            </Hidden>
            <Hidden smUp>
              <Typography className={classes.typography}>
                Username
              </Typography>
            </Hidden>
          </aside>
          <TextField
            name="username"
            helperText={error?.type === "username" && error.message}
            variant="outlined"
            fullWidth
            defaultValue={user.username}
            type="text"
            className={classes.textField}
            inputprop={
              {
                className: classes.textFieldInput
              }
            }
            {...register("username", {
              required: true,
              pattern: /^[a-zA-Z0-9_.]*$/,
              minLength: 5,
              maxLength: 20
            })}
          >

          </TextField>
        </div>
        {/* <SectionItem text="Website" formItem={user.website} /> */}
        <div className={classes.sectionItemWrapper}>
          <aside>
            <Hidden xsDown>
              <Typography className={classes.typography} align="right">
                Website
              </Typography>
            </Hidden>
            <Hidden smUp>
              <Typography className={classes.typography}>
                Website
              </Typography>
            </Hidden>
          </aside>
          <TextField
            name="website"
            variant="outlined"
            fullWidth
            defaultValue={user.website}
            type="text"
            className={classes.textField}
            inputprop={
              {
                className: classes.textFieldInput
              }
            }
            {...register("website", {
              validate: input => Boolean(input) ? isURL(input, {
                protocols: ["http", "https"],
                require_protocol: true
              }) : true
            })}
          >

          </TextField>
        </div>
        <div className={classes.sectionItem}>
          <aside>
            <Typography className={classes.bio} style={{fontWeight: 600}}>Bio</Typography>
          </aside>
          <TextField 
            name="bio"
            variant="outlined"
            multiline
            maxRows={3}
            minRows={3}
            fullWidth
            defaultValue={user.bio}
            {...register("bio", {
              maxLength: 120
            })}
          />
        </div>
        <div className={classes.sectionItem}>
          <div />
          <Typography color="textSecondary" className={classes.justifySelfStart}>
            Personal information
          </Typography>
        </div>
        {/* <SectionItem text="Email" formItem={user.email} /> */}
        <div className={classes.sectionItemWrapper}>
          <aside>
            <Hidden xsDown>
              <Typography className={classes.typography} align="right">
               Email
              </Typography>
            </Hidden>
            <Hidden smUp>
              <Typography className={classes.typography}>
               Email
              </Typography>
            </Hidden>
          </aside>
          <TextField
            name="email"
            helperText={error?.type === "email" && error.message}
            variant="outlined"
            fullWidth
            defaultValue={user.email}
            type="text"
            className={classes.textField}
            inputprop={
              {
                className: classes.textFieldInput
              }
            }
            {...register("email", {
              required: true,
              validate: input => isEmail(input)
            })}
          >

          </TextField>
        </div>
        {/* <SectionItem text="Phone Number" formItem={user.phone_number} /> */}
        <div className={classes.sectionItemWrapper}>
          <aside>
            <Hidden xsDown>
              <Typography className={classes.typography} align="right">
              Phone Number
              </Typography>
            </Hidden>
            <Hidden smUp>
              <Typography className={classes.typography}>
              Phone Number
              </Typography>
            </Hidden>
          </aside>
          <TextField
            name="phoneNumber"
            variant="outlined"
            fullWidth
            defaultValue={user.phone_number}
            type="text"
            className={classes.textField}
            inputprop={
              {
                className: classes.textFieldInput
              }
            }
            {...register("phoneNumber", {
              validate: input => Boolean(input) ? isMobilePhone(input) : true
            })}
          >

          </TextField>
        </div>
        <div className={classes.sectionItem}>
          <div />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.justifySelfStart}
          >
          Submit
          </Button>
        </div>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        TransitionComponent={Slide}
        message={<span>Profile updated</span>}
        onClose={() => setOpen(false)}
      />
    </section>
  )
}

// const SectionItem = ({ type = "text", text, formItem, name }) => {
//   const classes = useEditProfilePageStyles();

//   return (
//     <div className={classes.sectionItemWrapper}>
//       <aside>
//         <Hidden xsDown>
//           <Typography className={classes.typography} align="right">
//             {text}
//           </Typography>
//         </Hidden>
//         <Hidden smUp>
//           <Typography className={classes.typography}>
//             {text}
//           </Typography>
//         </Hidden>
//       </aside>
//       <TextField
//         name={name}
//         variant="outlined"
//         fullWidth
//         value={formItem}
//         type={type}
//         className={classes.textField}
//         inputprop={
//           {
//             className: classes.textFieldInput
//           }
//         }
//       >

//       </TextField>
//     </div>
//   )
// }

export default EditProfilePage;