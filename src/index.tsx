import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./ck-content-styles.scss"
import "react-datepicker/dist/react-datepicker.css";
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import store from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { initializeIcons, registerIcons } from "@fluentui/react";
import RctPageLoader from "./component/RctPageLoader";

let persistor = persistStore(store);

if (document.getElementById('root') !== undefined) {
  initializeIcons(undefined, {
    disableWarnings: true
  });
  
  ReactDOM.render(
    // <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={<RctPageLoader />} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>,
  // </React.StrictMode>,
    document.getElementById('root')
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
