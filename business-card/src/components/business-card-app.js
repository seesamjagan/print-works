import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./business-card-app.scss";
import Header from './header';
import Home from '../routes/home';
import Create from '../routes/create';

export default class BusinessCardApp extends Component {
  render() {
    return (
      <div className="business-card-app">
        <Router>
          <Header />
          <Route path="/" exact component={Home} />
          <Route path="/create" exact component={Create} />
        </Router>
      </div>
    )
  }
}
