import React from "react";
import ReactDOMServer from "react-dom/server";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/styles";
import { StaticRouter } from "react-router";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider } from "react-redux";

import ConfigStore from "../../src/redux";
import Routes from "../../src/routes";
import theme from "./theme";

export const serverRender = (request, initialState = {}) => {
  // set initialState and initialize store
  const store = ConfigStore(initialState);

  const sheets = new ServerStyleSheets();

  // can be retrieved at the FE
  // ...props.staticContext
  const context = {
    isServer: true,
    greetings: 'Mellloo',
  };

  if (context.url)
    console.log('redirect has occured')

  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CssBaseline />
          <StaticRouter location={request.url.pathname} context={context}>
            <Routes />
          </StaticRouter>
        </Provider>
      </ThemeProvider>
    )
  );

  // One big css string...
  const css = sheets.toString();

  return {
    cssData: css,
    htmlData: html,
    initialState: store.getState()
  };
};
