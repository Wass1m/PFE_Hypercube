import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MainInterface from "./components/Main";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TestPrincipal from "./components/test_principale";
function App() {
  return (
    <Router>
      <Route exact path="/" component={MainInterface} />
      <Route exact path="/main" component={TestPrincipal} />
    </Router>
  );
}

export default App;
