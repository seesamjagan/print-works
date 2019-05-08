import React, { Component } from "react";
import CardMaker from "../components/card-maker/card-maker.js";

export default class Create extends Component {
  
  render() {
    return (
      <div className="create-route">
          <CardMaker />
      </div>
    );
  }
}
