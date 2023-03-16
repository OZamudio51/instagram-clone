import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import ReactDOM from "react-dom";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "./theme";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import client from "./graphql/client";
import AuthProvider from "./auth";

ReactDOM.render(
    <ApolloProvider client={client}>
      <AuthProvider>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
              <BrowserRouter>
                <App />
              </BrowserRouter>
          </MuiThemeProvider>
      </AuthProvider>
    </ApolloProvider>,
  document.getElementById("root")
);
