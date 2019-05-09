import React, { Component } from "react";
import "./transformer.scss";
import { DnDManager, px, toInt, getDim } from "../../utils/dnd-manager";

export default class Transformer extends Component {
  state = {
    leftPos: null,
    rightPos: null,
    topPos: null,
    bottomPos: null,
    bottomRightPos: null
  };

  gs = { width: 10, height: 10 };

  get gripHeight() {
    return this.gs.height/2;
  }

  get gripWidth() {
    return this.gs.width/2;
  }

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
    let gripSize = this.gripWidth;
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
    let gripper = document.getElementsByClassName("resize-gripper")[0];
    if (gripper) {
      this.gs = getDim({ target: gripper });
    }

    if (preProps.target !== this.props.target) {
      let targetSize = getDim({ target: this.props.target });
      let { width, height, localX, localY } = targetSize;
      const gripperSize = this.gripWidth;
      this.setState({
        // left side
        leftPos: {
          left: px(localX - gripperSize),
          top: px(height / 2 + localY - gripperSize)
        },

        // right side
        rightPos: {
          left: px(localX + width - gripperSize),
          top: px(localY + height / 2 - gripperSize)
        },

        // top side
        topPos: {
          left: px(localX + width / 2 - gripperSize),
          top: px(localY - gripperSize)
        },

        // bottom side
        bottomPos: {
          left: px(localX + width / 2 - gripperSize),
          top: px(localY + height - gripperSize)
        },

        // bottom right side
        bottomRightPos: {
          left: px(localX + width - gripperSize),
          top: px(localY + height - gripperSize)
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

    let gripSize = this.gripWidth;

    let moveStyle = {
      left: px(toInt(leftPos.left) + gripSize),
      top: px(toInt(topPos.top) + gripSize),
      width: px(toInt(rightPos.left) - toInt(leftPos.left)),
      height: px(toInt(bottomPos.top) - toInt(topPos.top))
    };
    return (
      <>
        {/*
        div className="transformer" style={style} */}
        <div className="move-gripper" style={moveStyle} />
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
