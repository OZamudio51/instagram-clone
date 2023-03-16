import React, { useContext, useState } from "react";
import { Button, Card, InputAdornment, TextField, Typography } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../auth";
import SEO from "../components/shared/Seo";
import { useSignUpPageStyles } from "../styles";
import { LoginWithFacebook } from "./login";
import { useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import { HighlightOff, CheckCircleOutline } from "@material-ui/icons";
import { useApolloClient } from "@apollo/react-hooks";
import { CHECK_IF_USERNAME_TAKEN } from "../graphql/queries";

const SignUpPage = () => {
  const classes = useSignUpPageStyles();
  const { register, handleSubmit, formState: { isValid, isSubmitting, touchedFields, errors } } = useForm({ mode: "onBlur" });
  const { signUpWithEmailAndPassword } = useContext(AuthContext);

  const history = useHistory();
  const [error, setError] = useState("");
  const client = useApolloClient();

  const onSubmit = async data => {
    // console.log(data);
    try {
      setError("");
      await signUpWithEmailAndPassword(data);
      history.push("/");
    } catch(err) {
      console.error("Error signing up:", err);
      // setError(err.message);
      handleError(err);
    }
  }

  // const onSubmit = async data => {
  //   // console.log(data);
  //   try {
  //     await signUpWithEmailAndPassword(data);
  //     history.push("/");
  //   } catch(err) {
  //     console.error("Error signing up:", err);
  //     setError(err.message);
  //   }
  // }

  const handleError = err => {
    if (err.includes("users_username_key")) {
      setError("Username already taken");
    } else if (err.message.includes("Password should be at least 6 characters (auth/weak-password).")) {
      setError("Password should be at least 6 characters.");
    }
  }

  const validateUsername = async username => {
    const variables = { username };
    const response = await client.query({
      query : CHECK_IF_USERNAME_TAKEN,
      variables
    })

    const isUsernameValid = response.data.users.length === 0;

    return isUsernameValid;
  }

  const errorIcon = (
    <InputAdornment position="end">
      <HighlightOff style={{ color: "red", height: 30, width: 30 }}/>
    </InputAdornment>
  );

  const validIcon = (
    <InputAdornment position="end">
      <CheckCircleOutline style={{ color: "#ccc", height: 30, width: 30 }}/>
    </InputAdornment>
  );


  return (
    <>
      <SEO title="Sign up" />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <div className={classes.cardHeader} />
            <Typography className={classes.cardHeaderSubHeader}>
              Sign up to see photos and videos from your friends.
            </Typography>
            <LoginWithFacebook color="primary" iconColor="white" variant="contained"/>
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="email"
                {...register("email", {
                  required: true,
                  validate: input => isEmail(input)
                })}
                InputProps={ { 
                  endAdornment: errors.email ? errorIcon : touchedFields.email && validIcon
                } }
                fullWidth
                variant="filled"
                label="Email"
                type="email"
                margin="dense"
                className={classes.textField}
              />
              <TextField
                name="name"
                {...register("name", {
                  required: true,
                  minLength: 5,
                  maxLength: 20
                })}
                InputProps={ { 
                  endAdornment: errors.name ? errorIcon : touchedFields.name && validIcon
                } }
                fullWidth
                variant="filled"
                label="Full Name"
                margin="dense"
                className={classes.textField}
              />
              <TextField
                name="username"
                {...register("username", {
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                  validate: async (input) => await validateUsername(input),
                  //accept only lowercase/uppercase letters, numbers, periods and underscores
                  pattern: /^[a-zA-Z0-9_.]*$/
                })}
                InputProps={ { 
                  endAdornment: errors.username ? errorIcon : touchedFields.username && validIcon
                } }
                fullWidth
                variant="filled"
                label="Username"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
              />
              <TextField
                name="password"
                {...register("password", {
                  required: true,
                  minLength: 5,
                })}
                InputProps={ { 
                  endAdornment: errors.password ? errorIcon : touchedFields.password && validIcon
                } }
                fullWidth
                variant="filled"
                label="Password"
                type="password"
                margin="dense"
                className={classes.textField}
                autoComplete="new-password"
              />
              <Button
                disabled={!isValid || isSubmitting}
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
              >
                Sign Up
              </Button>
            </form>
            <AuthError error={error} />
          </Card>
          <Card className={classes.loginCard}>
            <Typography align="right" variant="body2">
              Have an account?
            </Typography>
            <Link to="/accounts/login">
              <Button color="primary" className={classes.loginButton}>
                Log in
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </>
  );
}


const AuthError = ({ error }) => {
  return Boolean(error) && (
    <Typography
      align="center"
      gutterBottom
      variant="body2"
      style={{color: "red"}}
    >
      {error}
    </Typography>
  )
}
export default SignUpPage;