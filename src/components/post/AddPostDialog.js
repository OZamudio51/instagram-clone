import React, { useState, useContext } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { AppBar, Avatar, Button, Dialog, Divider, Paper, TextField, Toolbar, Typography, InputAdornment } from "@material-ui/core";
import { useAddPostDialogStyles } from "../../styles";
import { ArrowBackIos, PinDrop } from "@material-ui/icons";
import { UserContext } from "../../App";
import { serialize } from "../../utils/serialize";
import { handleImageUpload } from "../../utils/handleImageUpload";
import { CREATE_POST } from "../../graphql/mutations";
import { useMutation } from "@apollo/react-hooks";



const initialValue = [
    {
        type: "paragraph",
    children: [{ text: ""}]
    }
];

export const AddPostDialog = ( { media, handleClose } ) => {
    const classes = useAddPostDialogStyles();
    const { me, currentUserId } = useContext(UserContext);
    const [editor] = useState(() => withReact(createEditor()));
    const [value, setValue] = useState(initialValue);
    const [location, setLocation] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [createPost] = useMutation(CREATE_POST);

    const handleSharePost = async () => {
        setSubmitting(true);

       const url = await handleImageUpload(media);
       
       const variables = {
            userId: currentUserId,
            location,
            caption: serialize({ children: value }),
            media: url
        }

        await createPost({ variables })

        setSubmitting(false);

        window.location.reload();
    }

    return (

        <Dialog fullScreen open onClose={handleClose}>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <ArrowBackIos onClick={handleClose} />
                    <Typography align="center" variant="body1" className={classes.title}>
                        New Post
                    </Typography>
                    <Button color="primary" className={classes.share} disabled={submitting} onClick={handleSharePost}>
                        Share
                    </Button>
                </Toolbar>
            </AppBar>
            <Divider style={{marginTop: 63}}/>
            <Paper className={classes.paper}>
                <Avatar src={me.profile_image} />
                <Slate editor={editor} value={value} onChange={value => setValue(value)}>
                    <Editable 
                        className={classes.editor}
                        placeholder="Write your caption"
                    />
                </Slate>
                <Avatar 
                    src={URL.createObjectURL(media)}
                    className={classes.avatarLarge}
                    variant="square"
                />
            </Paper>
            <TextField 
                fullWidth
                placeholder="Location"
                InputProps={{
                    classes: {
                        root: classes.root,
                        input: classes.input,
                        underline: classes.underline
                    },
                    startAdornment: (
                        <InputAdornment position="start">
                            <PinDrop />
                        </InputAdornment>
                    )
                }}
            onChange={event => setLocation(event.target.value)}
            />
        </Dialog>
    )
}