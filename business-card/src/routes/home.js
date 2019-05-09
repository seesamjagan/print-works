import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class Home extends Component {
  render() {
    return (
      <div>
        Goto <Link to="/create">BizCard Maker</Link>
      </div>
    )
  }
}
