import React, { Component } from "react";
import Transformer from "../transformer/transformer";
import html2canvas from "html2canvas";
import "./business-card.scss";

const GUTTER = 0.25;
const SAFE_ZONE_OFFSET = 0.25;
const DPI = 150;

export class BusinessCard extends Component {
  static defaultProps = {
    includeGutter: true,
    printCard: false,
  };

  state = {
    targetSize: null
  };

  onElementClick = e => {
    if (e.target.classList.contains("element")) {
      this.setState({ target: e.target });
      e.stopPropagation();
    } else if (
      e.target.className === "business-card" ||
      e.target.className === "print-area"
    ) {
      this.setState({ target: null });
    }
  };

  onTransform = (target, { left, top, width, height }) => {
    // TODO :: ??
  };

  componentDidUpdate(prevProp, prevState) {

    if(this.props.printCard) {
      setTimeout(()=>{
        html2canvas(document.querySelector("#business-card")).then(canvas => {
          this.props.onPrint && this.props.onPrint(canvas);
        });
      }, 0);
    }
  }

  render() {
    let {
      props: {
        size: { w, h },
        includeGutter,
        printCard,
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

    let className = "business-card";
    if(printCard) {
      className += " printing";
    }

    return (
      <div id="business-card"
        className={className}
        style={CARD_STYLE}
        onClick={this.onElementClick}
      >
        <div className="print-area" style={PRINT_STYLE}>
          <div className="safe-zone" style={SAF_ZONE_STYLE} />
          <TextElement defaultText="text line 1" />
          <TextElement defaultText="text line 2" />
          <Transformer
            target={printCard ? null : target}
            targetSize={targetSize}
            onTransform={this.onTransform}
          />
        </div>
      </div>
    );
  }
}

class TextElement extends Component {
  state = {
    text: ""
  };
  onElementDoubleClick = e => {
    e.target.contentEditable = true;
  };
  onElementBlur = e => {
    e.target.contentEditable = false;
  };

  render() {
    let {
      props: { onClick, style, defaultText },
      state: { text }
    } = this;
    return (
      <section
        className="element text-element"
        style={style}
        onClick={onClick}
        onDoubleClick={this.onElementDoubleClick}
        onBlur={this.onElementBlur}
      >
        {text || defaultText}
      </section>
    );
  }
}

export default BusinessCard;
