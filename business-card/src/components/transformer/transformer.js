import React, { Component } from "react";
import "./transformer.scss";
import { DnDManager, px, toInt, getDim } from "../../utils/dnd-manager";
import { classBody } from "@babel/types";

export default class Transformer extends Component {
  state = {
    leftPos: null,
    rightPos: null,
    topPos: null,
    bottomPos: null,
    bottomRightPos: null
  };

  componentDidMount() {
    DnDManager.getInstance()
      .init(document)
      .attach("left-resize-gripper", {
        noTop: true,
        onDrag: this.onDragGripper
      })
      .attach("right-resize-gripper", {
        noTop: true,
        onDrag: this.onDragGripper
      })
      .attach("top-resize-gripper", {
        noLeft: true,
        onDrag: this.onDragGripper
      })
      .attach("bottom-resize-gripper", {
        noLeft: true,
        onDrag: this.onDragGripper
      })
      .attach("bottom-right-resize-gripper", { onDrag: this.onDragGripper });
  }

  onDragGripper = (
    node,
    { left, top, oldLeft, oldTop, xDiff, yDiff },
    className
  ) => {
    let gripSize = 20 / 2;
    let {
      state: { leftPos, rightPos, topPos, bottomPos, bottomRightPos },
      props: { onTransform, target }
    } = this;

    switch (className) {
      case "right-resize-gripper": {
        rightPos = { ...rightPos, left: px(left) };
        leftPos = { ...leftPos };
        topPos = {
          ...topPos,
          left: px(
            (left - toInt(leftPos.left)) / 2 - gripSize + toInt(leftPos.left)
          )
        };
        bottomPos = {
          ...bottomPos,
          left: px(
            (left - toInt(leftPos.left)) / 2 - gripSize + toInt(leftPos.left)
          )
        };
        bottomRightPos = {
          ...bottomRightPos,
          left: px(left)
        };
        break;
      }
      case "left-resize-gripper": {
        leftPos = { ...leftPos, left: px(left) };
        rightPos = { ...rightPos };
        topPos = {
          ...topPos,
          left: px((toInt(rightPos.left) - left) / 2 - gripSize + left)
        };
        bottomPos = {
          ...bottomPos,
          left: px((toInt(rightPos.left) - left) / 2 - gripSize + left)
        };
        bottomRightPos = {
          ...bottomRightPos
        };
        break;
      }
      case "bottom-resize-gripper": {
        topPos = {
          ...topPos
        };
        bottomPos = {
          ...bottomPos,
          top: px(top)
        };
        leftPos = {
          ...leftPos,
          top: px((top - toInt(topPos.top)) / 2 + toInt(topPos.top))
        };
        rightPos = {
          ...rightPos,
          top: px((top - toInt(topPos.top)) / 2 + toInt(topPos.top))
        };
        bottomRightPos = {
          ...bottomRightPos,
          top: px(top)
        };
        break;
      }
      case "top-resize-gripper": {
        topPos = {
          ...topPos,
          top: px(top)
        };
        bottomPos = {
          ...bottomPos
        };
        leftPos = {
          ...leftPos,
          top: px((toInt(bottomPos.top) - top) / 2 + top)
        };
        rightPos = {
          ...rightPos,
          top: px((toInt(bottomPos.top) - top) / 2 + top)
        };
        bottomRightPos = {
          ...bottomRightPos
        };
        break;
      }
      case "bottom-right-resize-gripper": {
        bottomRightPos = {
          left: px(left),
          top: px(top)
        };

        topPos = {
          ...topPos,
          left: px((left - toInt(leftPos.left)) / 2 + toInt(leftPos.left))
        };
        bottomPos = {
          left: px((left - toInt(leftPos.left)) / 2 + toInt(leftPos.left)),
          top: px(top)
        };

        leftPos = {
          ...leftPos,
          top: px((top - toInt(topPos.top)) / 2 + toInt(topPos.top))
        };
        rightPos = {
          left: px(left),
          top: px((top - toInt(topPos.top)) / 2 + toInt(topPos.top))
        };

        break;
      }
      default: // do nothing;
    }

    this.setState({
      topPos,
      leftPos,
      rightPos,
      bottomPos,
      bottomRightPos
    });

    let trans = {
      left: toInt(leftPos.left) + gripSize,
      top: toInt(topPos.top) + gripSize,
      width: toInt(rightPos.left) - toInt(leftPos.left),
      height: toInt(bottomPos.top) - toInt(topPos.top)
    };

    target.style.left = px(trans.left);
    target.style.top = px(trans.top);
    target.style.width = px(trans.width);
    target.style.height = px(trans.height);

    onTransform && onTransform(target, trans);
  };

  componentDidUpdate(preProps, preState) {
    if (preProps.target !== this.props.target) {
      let targetSize = getDim({ target: this.props.target });
      let { width, height } = targetSize;
      const gripperSize = 20 / 2;
      this.setState({
        leftPos: { left: px(-gripperSize), top: px(height / 2 - gripperSize) },
        rightPos: {
          left: px(width - gripperSize),
          top: px(height / 2 - gripperSize)
        },
        topPos: { left: px(width / 2 - gripperSize), top: px(-gripperSize) },
        bottomPos: {
          left: px(width / 2 - gripperSize),
          top: px(height - gripperSize)
        },
        bottomRightPos: {
          left: px(width - gripperSize),
          top: px(height - gripperSize)
        },
        targetSize
      });
    }
  }

  render() {
    let {
      state: {
        leftPos,
        rightPos,
        topPos,
        bottomPos,
        bottomRightPos,
        targetSize
      }
    } = this;

    if (!targetSize) return null;
    /* 
    let gripSize = 20 / 2;

    let style = {
      left: targetSize.localX,
      top: targetSize.localY,
      width: px(toInt(bottomRightPos.left) + gripSize),
      height: px(toInt(bottomRightPos.top) + gripSize)
    };
 */
    return (
      <>
        {/*
        div className="transformer" style={style} */}
        <ResizeGripper className="left-resize-gripper" position={leftPos} />
        <ResizeGripper className="right-resize-gripper" position={rightPos} />
        <ResizeGripper className="top-resize-gripper" position={topPos} />
        <ResizeGripper className="bottom-resize-gripper" position={bottomPos} />
        <ResizeGripper
          className="bottom-right-resize-gripper"
          position={bottomRightPos}
        />
      </>
    );
  }
}

const ResizeGripper = ({ position, className = "" }) => (
  <span className={"resize-gripper " + className} style={position} />
);
