import React, { Component } from "react";
import "./transformer.scss";
import { DnDManager, px, toInt, getDim } from "../../utils/dnd-manager";

export default class Transformer extends Component {
  static defaultProps = {
    target: null,
    allowToResizeWidth: true,
    allowToResizeHeight: true,
    allowToMove: true,
    minWidth: 10,
    minHeight: 10
  };

  state = {
    leftPos: null,
    rightPos: null,
    topPos: null,
    bottomPos: null,
    bottomRightPos: null
  };

  gripHeight(pos) {
    return this[`${pos}GripperDim`].height / 2;
  }

  gripWidth(pos) {
    return this[`${pos}GripperDim`].width / 2;
  }

  onDragGripper = (node, { left, top }, className) => {
    let {
      state: { leftPos, rightPos, topPos, bottomPos }
    } = this;

    switch (className) {
      case "right-resize-gripper": {
        this.positionHandles({
          left: toInt(leftPos.left) + this.gripWidth("left"),
          top: toInt(topPos.top) + this.gripHeight("top"),
          width: left - toInt(leftPos.left),
          height: toInt(bottomPos.top) - toInt(topPos.top)
        });
        break;
      }
      case "left-resize-gripper": {
        this.positionHandles({
          left: left + this.gripWidth("left"),
          top: toInt(topPos.top) + this.gripHeight("top"),
          width: toInt(rightPos.left) - left,
          height: toInt(bottomPos.top) - toInt(topPos.top)
        });
        break;
      }
      case "bottom-resize-gripper": {
        this.positionHandles({
          left: toInt(leftPos.left) + this.gripWidth("left"),
          top: toInt(topPos.top) + this.gripHeight("top"),
          width: toInt(rightPos.left) - toInt(leftPos.left),
          height: top - toInt(topPos.top)
        });
        break;
      }
      case "top-resize-gripper": {
        this.positionHandles({
          left: toInt(leftPos.left) + this.gripWidth("left"),
          top: top + this.gripHeight("top"),
          width: toInt(rightPos.left) - toInt(leftPos.left),
          height: toInt(bottomPos.top) - top
        });
        break;
      }
      case "bottom-right-resize-gripper": {
        this.positionHandles({
          left: toInt(leftPos.left) + this.gripWidth("left"),
          top: toInt(topPos.top) + this.gripHeight("top"),
          width: left - toInt(leftPos.left),
          height: top - toInt(topPos.top)
        });
        break;
      }
      default: // do nothing;
    }
  };

  onDragMoveGripper = (target, { left, top }) => {
    let { width, height } = getDim({ target });

    this.positionHandles({
      left,
      top,
      width,
      height
    });
  };

  positionHandles = ({ left, top, width, height }) => {
    let leftPos = {
      left: px(left - this.gripWidth("left")),
      top: px(height / 2 + top - this.gripHeight("left"))
    };
    let rightPos = {
      left: px(left + width - this.gripWidth("right")),
      top: px(top + height / 2 - this.gripHeight("right"))
    };

    let topPos = {
      left: px(left + width / 2 - this.gripWidth("top")),
      top: px(top - this.gripHeight("top"))
    };
    let bottomPos = {
      left: px(left + width / 2 - this.gripWidth("bottom")),
      top: px(top + height - this.gripHeight("bottom"))
    };
    let bottomRightPos = {
      left: px(left + width - this.gripWidth("bottomRight")),
      top: px(top + height - this.gripHeight("bottomRight"))
    };

    this.setState({
      // left side
      leftPos,

      // right side
      rightPos,

      // top side
      topPos,

      // bottom side
      bottomPos,

      // bottom right side
      bottomRightPos
    });

    let trans = {
      left,
      top,
      width,
      height
    };

    this.updateTarget(trans);
  };

  updateTarget = trans => {
    let {
      props: { onTransform, target }
    } = this;

    target.style.left = px(trans.left);
    target.style.top = px(trans.top);
    target.style.width = px(trans.width);
    target.style.height = px(trans.height);

    onTransform && onTransform(target, trans);
  };

  initHandles = target => {
    if (!target) return;

    const { localX, localY, width, height } = getDim({
      target
    });

    const {
      props: { minHeight: MIN_HEIGHT, minWidth: MIN_WIDTH }
    } = this;

    DnDManager.getInstance()
      .init(document)
      .attach("left-resize-gripper", {
        noTop: true,
        onDrag: this.onDragGripper,
        maxLeft: localX + width - MIN_WIDTH
      })
      .attach("right-resize-gripper", {
        noTop: true,
        minLeft: localX + MIN_WIDTH,
        onDrag: this.onDragGripper
      })
      .attach("top-resize-gripper", {
        noLeft: true,
        maxTop: height + localY - MIN_HEIGHT,
        onDrag: this.onDragGripper
      })
      .attach("bottom-resize-gripper", {
        noLeft: true,
        minTop: localY + MIN_HEIGHT,
        onDrag: this.onDragGripper
      })
      .attach("bottom-right-resize-gripper", {
        minLeft: localX + MIN_WIDTH,
        minTop: localY + MIN_HEIGHT,
        onDrag: this.onDragGripper
      })
      .attach("move-gripper", {
        onDrag: this.onDragMoveGripper
      });
  };

  getGripperDim = className => {
    let gripper = document.getElementsByClassName(className)[0];
    return gripper ? getDim({ target: gripper }) : { width: 0, height: 0 };
  };

  componentDidUpdate(preProps) {
    this.leftGripperDim = this.getGripperDim("left-resize-gripper");
    this.rightGripperDim = this.getGripperDim("right-resize-gripper");
    this.topGripperDim = this.getGripperDim("top-resize-gripper");
    this.bottomGripperDim = this.getGripperDim("bottom-resize-gripper");
    this.bottomRightGripperDim = this.getGripperDim(
      "bottom-right-resize-gripper"
    );

    if (preProps.target !== this.props.target) {
      let targetDim = getDim({ target: this.props.target });

      let targetParentDim = getDim({ target: this.props.target.parentElement });

      let { width, height, localX: left, localY: top } = targetDim;
      this.positionHandles({ left, top, width, height });
      this.setState({ targetDim, targetParentDim });

      if (!this.bottomRightGripperDim.width) {
        setTimeout(() => {
          this.positionHandles({ left, top, width, height });
        }, 0);
      }
    }
    // drag and re-size will change the target dim's. so have to re-init the handle every time
    this.initHandles(this.props.target);
  }

  render() {
    let {
      state: {
        leftPos,
        rightPos,
        topPos,
        bottomPos,
        bottomRightPos,
        targetDim
      },
      props: { allowToResizeWidth, allowToResizeHeight, allowToMove }
    } = this;

    if (!targetDim) return null;

    let [gripWidth, gripHeight] = [
      this.gripWidth("left"),
      this.gripHeight("top")
    ];

    let moveStyle = {
      left: px(toInt(leftPos.left) + gripWidth),
      top: px(toInt(topPos.top) + gripHeight),
      width: px(toInt(rightPos.left) - toInt(leftPos.left)),
      height: px(toInt(bottomPos.top) - toInt(topPos.top))
    };
    return (
      <>
        {allowToMove || allowToResizeHeight || allowToResizeWidth ? (
          <div
            className="transform-element transformer-border"
            style={moveStyle}
          />
        ) : null}
        {allowToMove && (
          <div className="transform-element move-gripper" style={moveStyle} />
        )}
        {allowToResizeWidth && (
          <ResizeGripper
            className="transform-element left-resize-gripper"
            position={leftPos}
          />
        )}
        {allowToResizeWidth && (
          <ResizeGripper
            className="transform-element right-resize-gripper"
            position={rightPos}
          />
        )}
        {allowToResizeHeight && (
          <ResizeGripper
            className="transform-element top-resize-gripper"
            position={topPos}
          />
        )}
        {allowToResizeHeight && (
          <ResizeGripper
            className="transform-element bottom-resize-gripper"
            position={bottomPos}
          />
        )}
        {allowToResizeHeight && allowToResizeWidth && (
          <ResizeGripper
            className="transform-element bottom-right-resize-gripper"
            position={bottomRightPos}
          />
        )}
      </>
    );
  }
}

const ResizeGripper = ({ position, className = "" }) => (
  <span className={"resize-gripper " + className} style={position} />
);
