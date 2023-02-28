import React from "react";
import { useLoadingScreenStyles } from "../../styles";
import { LogoLoadingIcon } from "../../icons";

const LoadingScreen = () => {
  const classes = useLoadingScreenStyles();

  return (
    <section className={classes.section}>
      <span>
        <LogoLoadingIcon />
      </span>
    </section>
  )
}

export default LoadingScreen;
