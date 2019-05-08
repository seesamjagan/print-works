import React, { Component } from 'react'

import "./business-card.scss";

const GUTTER = 0.25;
const SAFE_ZONE_OFFSET = 0.25;
const DPI = 300;

export class BusinessCard extends Component {
  render() {
    let {
      props: { size:{w,h}, unit, includeGutter=true }
    } = this;

    let width = w * DPI;
    let height = h * DPI;
    let gutter = GUTTER * DPI;
    let cardStyle = {
      padding: (includeGutter ? gutter : 0) + "px"
    }
    let printStyle = {
      width: width + "px",
      height: height + "px",
    };

    let safeZoneOffset = SAFE_ZONE_OFFSET * DPI + "px";
    let safeZoneStyle = {
      left: safeZoneOffset,
      top: safeZoneOffset,
      right: safeZoneOffset,
      bottom: safeZoneOffset
    }

    return (
      <div className="business-card" style={cardStyle}>
        <div className="print-area" style={printStyle}>
            <div className="safe-zone" style={safeZoneStyle}>

            </div>
        </div>
      </div>
    )
  }
}

export default BusinessCard;
