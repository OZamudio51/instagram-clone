import React, { useContext, useRef } from "react";
import { useProfilePictureStyles } from "../../styles";
import { Person } from "@material-ui/icons";
import { useMutation } from "@apollo/react-hooks";
import { handleImageUpload } from "../../utils/handleImageUpload";
import { EDIT_USER_AVATAR } from "../../graphql/mutations";
import { useState } from "react";
import { UserContext } from "../../App";

const ProfilePicture = ({ 
  size,
  image,
  isOwner
}) => {
  const classes = useProfilePictureStyles({ size, isOwner });
  const inputRef = useRef();
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
  const [img, setImg] = useState(image);
  const { currentUserId } = useContext(UserContext);
  
  const openFileInput = () => {
    inputRef.current.click();
  }

  const handleUpdateProfilePic = async e => {
    const url = await handleImageUpload(e.target.files[0], "instagram-avatar");
    const variables = { id: currentUserId, profileImage: url };
    await editUserAvatar({ variables });
    setImg(url);
  }

  return (
    <section className={classes.section}>
      <input
        style={{ display: "none" }}
        ref={inputRef}
        type="file"
        onChange={handleUpdateProfilePic}
      />
      {image ? (
        <div className={classes.wrapper} onClick={isOwner ? openFileInput : () => null}>
          <img src={img} alt="user profile" className={classes.image} />
        </div>
      ) : (
        <div className={classes.wrapper}>
          <Person className={classes.person} />
        </div>
      )}
    </section>
  )
}

export default ProfilePicture;
