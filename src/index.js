import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import ReactDOM from "react-dom";
import { MuiThemeProvider, CssBaseline, Typography } from "@material-ui/core";
import theme from "./theme";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import client from "./graphql/client";
import AuthProvider from "./auth";

class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError () {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Typography component="h1" variant="h6" align="center" style={{ fontWeight: "bold"}}>
          Oops! Something went wrong.
        </Typography>
      )
    }
    return this.props.children;
  }
}

ReactDOM.render(
  <ErrorBoundary>
    <ApolloProvider client={client}>
      <AuthProvider>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
              <BrowserRouter>
                <App />
              </BrowserRouter>
          </MuiThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  </ErrorBoundary>,
  document.getElementById("root")
);
