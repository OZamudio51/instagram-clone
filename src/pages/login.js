import React, { useContext, useState } from "react";
import { Button, Card, CardHeader, InputAdornment, TextField, Typography } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import SEO from "../components/shared/Seo";
import { useLoginPageStyles } from "../styles";
import FacebookIconBlue from "../images/facebook-icon-blue.svg";
import FacebookIconWhite from "../images/facebook-icon-white.png";
import { AuthContext } from "../auth";
import isEmail from "validator/lib/isEmail";
import { useApolloClient } from "@apollo/react-hooks";
import { GET_USER_EMAIL } from "../graphql/queries";
import { AuthError } from "./signup";

const LoginPage = () => {
  const classes = useLoginPageStyles();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { isValid, isSubmitting } } = useForm({ mode: "onBlur" });
  const { logInWithEmailAndPassword } = useContext(AuthContext);
  const hasPassword = Boolean(watch("password"));
  const history = useHistory();
  const client = useApolloClient();
  const [error, setError] = useState();

  const onSubmit = async ({ input, password }) => {
    try {
      setError("");

      if (!isEmail(input)) {
        input = await getUserEmail(input);
      }

      await logInWithEmailAndPassword(input, password);
      setTimeout(() =>  history.push("/"), 0);
    } catch(err) {
      console.error("Error logging in:", err);
      handleError(err);
    }
  }

  const handleError = err => {
    console.error(err.message);
    // if (err.message.includes("(auth/wrong-password)")) {
      const cleanedMessage = err.message.split("Firebase:");
      setError(cleanedMessage[1]);
    // }
  }

  const getUserEmail = async input => {
    const variables = { input };

    const response = await client.query({
      query: GET_USER_EMAIL,
      variables
    })

    const userEmail = response.data.users[0]?.email || "no@email.com";

    return userEmail;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  }

  return (
    <>
      <SEO title="Login" />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <CardHeader className={classes.cardHeader} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register("input", {
                  required: true,
                  minLength: 5,
                })}
                fullWidth
                variant="filled"
                label="Username, email, or phone"
                margin="dense"
                className={classes.textField}
                autoComplete="input"
                name="input"
              />
              <TextField
                {...register("password", {
                  required: true,
                  minLength: 5,
                })}
                InputProps={ { 
                  endAdornment: hasPassword && (
                    <InputAdornment position="end">
                      <Button onClick={togglePasswordVisibility}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputAdornment>
                  )
                } }
                fullWidth
                variant="filled"
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="dense"
                className={classes.textField}
                autoComplete="current-password"
                name="password"
              />
              <Button
                disabled={!isValid || isSubmitting}
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
              >
                Log In
              </Button>
            </form>
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <LoginWithFacebook color="secondary" iconColor="blue" />
            <AuthError error={error} />
            <Button fullWidth color="secondary">
              <Typography variant="caption">
                Forgot password?
              </Typography>
            </Button>
          </Card>
          <Card className={classes.signUpCard}>
            <Typography align="right" variant="body2">
              Don't have an account?
            </Typography>
            <Link to="/accounts/emailsignup">
              <Button color="primary" className={classes.signUpButton}>
                Sign up
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </>
  );
}

 export const LoginWithFacebook = ({ color, iconColor, variant }) => {
  const classes = useLoginPageStyles();

  const { logInWithGoogle } = useContext(AuthContext);

  const facebookIcon = iconColor === "blue" ? FacebookIconBlue : FacebookIconWhite;
  const [error, setError] = useState();
  const history = useHistory();

  const handleLogInWithGoogle = async () => {
    try {
      await logInWithGoogle();
      setTimeout(() => history.push("/"), 0);
    } catch (err) {
      console.error("Error logging in with google:", err);
      setError(err.message);
    }
  }

  return (
    <>
      <Button onClick={handleLogInWithGoogle} fullWidth color={color} variant={variant}>
        <img 
          src={facebookIcon}
          alt="facebook icon"
          className={classes.facebookIcon}
        />
        Log In with Facebook
      </Button>
      <AuthError error={error} />
    </>
  )
}

export default LoginPage;
