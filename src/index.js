import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import {Provider} from "react-redux";
import {createStore} from "redux";
// import rootReducer from './redux/reducers'
import configureStore from "./redux/store/configureStore";
import {BrowserRouter} from "react-router-dom";
// require("dotenv").config();

const store = configureStore();

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
ReactDOM.render(app, document.getElementById("root"));
serviceWorker.unregister();
