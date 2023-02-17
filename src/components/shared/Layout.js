import React from "react";
import { useLayoutStyles } from "../../styles";
import SEO from "./Seo";
import NavBar from "./Navbar";

const Layout = ({ children, title, marginTop = 60 }) => {
  const classes = useLayoutStyles();
  
  return (
    <section className={classes.section}>
      <SEO title={title} />
      <NavBar />
      <main className={classes.main} style={ { marginTop } }>
        <section className={classes.childrenWrapper}>
          <div className={classes.children}>{children}</div>
        </section>
      </main>
    </section>
  )
}

export default Layout;
