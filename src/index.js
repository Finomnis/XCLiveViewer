import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import resolveBreakingChanges from "./common/PersistentState/BreakingChanges";

import "flag-icon-css/css/flag-icon.min.css";

import * as serviceWorker from "./serviceWorker";
import { processUrlParameters } from "./UrlParameters";

// Read the .env file
require("dotenv").config();

// Update breaking changes
resolveBreakingChanges();

// Process url parameters
processUrlParameters();

// Render the page
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
