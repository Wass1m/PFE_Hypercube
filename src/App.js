import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MainInterface from "./components/Main";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TestPrincipal from "./components/test_principale";
import TestPrincipal_Etude from "./components/test_principale_etude";
import TestPrincipal_Etude2 from "./components/etude2";
import TestPrincipal_fourmis from "./components/nbr_fourmis_etude";
function App() {
  return (
    <Router>
      <Route exact path="/" component={MainInterface} />
      <Route exact path="/main-final" component={TestPrincipal} />
      <Route exact path="/main" component={TestPrincipal_fourmis} />
      <Route exact path="/main2" component={TestPrincipal_Etude2} />
    </Router>
  );
}

export default App;
