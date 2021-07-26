import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Router, Switch, Route} from "react-router-dom";

import Routes from './navigation/routes';
import Home from './pages/home';
import Skills from './pages/skills';
import Career from "./pages/career";
import Projects from "./pages/projects";
import history from './services/history';

import "./styles/main.css"
import "./styles/_colors.css"
import "./styles/_typo.css"
import RouterSideNav from './navigation/navbar';

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/skills" component={Skills} />
        <Route exact path="/projects" component={Projects} />
      </Switch>
      <RouterSideNav />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// https://javascript.plainenglish.io/routing-and-navigation-in-react-cffc26e8a389