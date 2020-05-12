import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./static/css/main.css";
import Home from "./components/Home"
import About from "./components/About"
import Combine from "./components/Combine"
import Settings from "./components/Settings"

ReactDOM.render(
  <Router>
    <div>
      <Switch>

        <Route exact path="/">
          <Home/>
        </Route>

        <Route path="/about">
          <About />
        </Route>

        <Route path="/search">
          <Search />
        </Route>

        <Route path="/combine">
          <Combine />
        </Route>

        <Route path="/settings">
          <Settings />
        </Route>

      </Switch>
    </div>
  </Router>,
  document.getElementById("main")
);


function Search() {
  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/">Home</Link>
    </div>
  );
}


