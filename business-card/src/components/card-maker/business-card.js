import React, { Component } from "react";
import Transformer from "../transformer/transformer";
import "./business-card.scss";


const GUTTER = 0.25;
const SAFE_ZONE_OFFSET = 0.25;
const DPI = 150;

export class BusinessCard extends Component {
  state = {
    targetSize: null
  };

  onElementClick = e => {
    this.setState({target: e.target});
    e.stopPropagation();
  };

  onTransformerResize = (target, {left, top, width, height}) => {
    
    console.log(target)
  }

  render() {
    let {
      props: {
        size: { w, h },
        includeGutter = true,
        dpi: DEFAULT_DPI
      },
      state: { targetSize, target }
    } = this;

    let width = w * DPI;
    let height = h * DPI;
    let gutter = GUTTER * DPI;
    let safeZoneOffset = SAFE_ZONE_OFFSET * DPI + "px";

    const CARD_STYLE = {
      padding: (includeGutter ? gutter : 0) + "px"
    };

    const PRINT_STYLE = {
      width: width + "px",
      height: height + "px"
    };

    const SAF_ZONE_STYLE = {
      left: safeZoneOffset,
      top: safeZoneOffset,
      right: safeZoneOffset,
      bottom: safeZoneOffset
    };

    return (
      <div className="business-card" style={CARD_STYLE}>
        <div className="print-area" style={PRINT_STYLE}>
          <div className="safe-zone" style={SAF_ZONE_STYLE} />
          <TextElement onClick={this.onElementClick} />
          <Transformer target={target} targetSize={targetSize} onResize={this.onTransformerResize} />
        </div>
      </div>
    );
  }
}

class TextElement extends Component {
  onElementDoubleClick = e => {
    e.target.contentEditable = true;
  };
  onElementBlur = e => {
    e.target.contentEditable = false;
  };

  render() {
    let {
      props: {
        onClick, style
      }
    } = this;
    return (
      <section
        className="element text-element"
        style={style}
        onClick={onClick}
        onDoubleClick={this.onElementDoubleClick}
        onBlur={this.onElementBlur}
      >
        this is some text
      </section>
    );
  }
}

export default BusinessCard;
