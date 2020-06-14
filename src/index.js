import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./static/css/main.css";
import Home from "./components/Home"
import About from "./components/About"
import Combine from "./components/Combine"
import Settings from "./components/Settings"
import Search from "./components/Search"
import Browse from "./components/Browse"

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

        <Route path="/browse">
          <Browse />
        </Route>

      </Switch>
    </div>
  </Router>,
  document.getElementById("main")
);



