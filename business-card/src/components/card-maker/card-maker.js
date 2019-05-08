import React, { Component } from "react";
import BusinessCard from "./business-card";

import { unit, standard } from "./../../json/card-size.json";

import "./card-maker.scss";

export default class CardMaker extends Component {
  state = {
    size: standard[0],
    includeGutter: true
  };
  onSizeChange = e => {
    let country = e.target.value;
    let size = standard.find(size => size.country === country);
    this.setState({ size });
  };

  onIncludeGutterChange = e => {
    this.setState({
        includeGutter: e.target.checked
    });
  }

  render() {
    let {
      state: { size, includeGutter }
    } = this;
    return (
      <div className="card-maker">
        <div className="header">
          <label>Choose Size:</label>
          <select onChange={this.onSizeChange}>
            {standard.map(({ country, w, h }) => (
              <option key={country} value={country}>
                {country}: ({w} x {h} {unit})
              </option>
            ))}
          </select>
          <input id="includeGutter" type="checkbox" checked={includeGutter} onChange={this.onIncludeGutterChange} /> <label htmlFor="includeGutter">Include Gutter</label>
        </div>
        
        <div className="work-area">
          {size ? (
            <BusinessCard size={size} unit={unit} includeGutter={includeGutter} />
          ) : (
            <div>No size info found!</div>
          )}
        </div>
      </div>
    );
  }
}
