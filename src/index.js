import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

import "flag-icon-css/css/flag-icon.min.css";

import * as serviceWorker from "./serviceWorker";

// Read the .env file
require("dotenv").config();

// Render the page
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
