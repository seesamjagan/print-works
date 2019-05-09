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
    return this.gs.height / 2;
  }

  get gripWidth() {
    return this.gs.width / 2;
  }

  componentDidMount() {}

  onDragGripper = (
    node,
    { left, top, oldLeft, oldTop, xDiff, yDiff },
    className
  ) => {
    let gripSize = this.gripWidth;
    let {
      state: { leftPos, rightPos, topPos, bottomPos }
    } = this;

    switch (className) {
      case "right-resize-gripper": {
        this.positionHandles({
          left: toInt(leftPos.left) + gripSize,
          top: toInt(topPos.top) + gripSize,
          width: left - toInt(leftPos.left),
          height: toInt(bottomPos.top) - toInt(topPos.top)
        });
        break;
      }
      case "left-resize-gripper": {
        this.positionHandles({
          left: left + gripSize,
          top: toInt(topPos.top) + gripSize,
          width: toInt(rightPos.left) - left,
          height: toInt(bottomPos.top) - toInt(topPos.top)
        });
        break;
      }
      case "bottom-resize-gripper": {
        this.positionHandles({
          left: toInt(leftPos.left) + gripSize,
          top: toInt(topPos.top) + gripSize,
          width: toInt(rightPos.left) - toInt(leftPos.left),
          height: top - toInt(topPos.top)
        });
        break;
      }
      case "top-resize-gripper": {
        this.positionHandles({
          left: toInt(leftPos.left) + gripSize,
          top: top + gripSize,
          width: toInt(rightPos.left) - toInt(leftPos.left),
          height: toInt(bottomPos.top) - top
        });
        break;
      }
      case "bottom-right-resize-gripper": {
        this.positionHandles({
          left: toInt(leftPos.left) + gripSize,
          top: toInt(topPos.top) + gripSize,
          width: left - toInt(leftPos.left),
          height: top - toInt(topPos.top)
        });
        break;
      }
      default: // do nothing;
    }
  };

  onDragMoveGripper = (target, { left, top }, className) => {
    let { width, height } = getDim({ target });

    this.positionHandles({
        left,
        top,
        width,
        height
      });
  };

  positionHandles = ({ left: localX, top: localY, width, height }) => {
    const gripSize = this.gripWidth;
    let leftPos = {
      left: px(localX - gripSize),
      top: px(height / 2 + localY - gripSize)
    };
    let rightPos = {
      left: px(localX + width - gripSize),
      top: px(localY + height / 2 - gripSize)
    };
    let topPos = {
      left: px(localX + width / 2 - gripSize),
      top: px(localY - gripSize)
    };
    let bottomPos = {
      left: px(localX + width / 2 - gripSize),
      top: px(localY + height - gripSize)
    };
    let bottomRightPos = {
      left: px(localX + width - gripSize),
      top: px(localY + height - gripSize)
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
      left:localX,
      top:localY,
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

    const { localX, localY, parentX, parentY, width, height } = getDim({
      target
    });

    const MIN_WIDTH = 50;
    const MIN_HEIGHT = 50;

    DnDManager.getInstance()
      .init(document)
      .attach("left-resize-gripper", {
        noTop: true,
        onDrag: this.onDragGripper,
        minLeft: -this.gripWidth,
        maxLeft: localX + width - MIN_WIDTH
      })
      .attach("right-resize-gripper", {
        noTop: true,
        minLeft: localX + MIN_WIDTH,
        // maxLeft: xxx, // TODO :: parent width
        onDrag: this.onDragGripper
      })
      .attach("top-resize-gripper", {
        noLeft: true,
        minTop: -this.gripHeight,
        maxTop: height + localY - MIN_HEIGHT,
        onDrag: this.onDragGripper
      })
      .attach("bottom-resize-gripper", {
        noLeft: true,
        minTop: localY + MIN_HEIGHT,
        //maxTop: xxx, // TODO :: parent height
        onDrag: this.onDragGripper
      })
      .attach("bottom-right-resize-gripper", {
        minLeft: localX + MIN_WIDTH,
        minTop: localY + MIN_HEIGHT,
        //maxLeft: xxx, // TODO :: parent width
        //maxTop: xxx, // TODO :: parent height
        onDrag: this.onDragGripper
      })
      .attach("move-gripper", {
        // --
        onDrag: this.onDragMoveGripper
      });
  };

  componentDidUpdate(preProps, preState) {
    let gripper = document.getElementsByClassName("resize-gripper")[0];
    if (gripper) {
      this.gs = getDim({ target: gripper });
    }

    if (preProps.target !== this.props.target) {
      let targetSize = getDim({ target: this.props.target });

      let { width, height, localX:left, localY:top } = targetSize;
      this.positionHandles({ left, top, width, height });
      this.setState({ targetSize });
    }

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
        <div className="transform-gripper move-gripper" style={moveStyle} />
        <ResizeGripper
          className="transform-gripper left-resize-gripper"
          position={leftPos}
        />
        <ResizeGripper
          className="transform-gripper right-resize-gripper"
          position={rightPos}
        />
        <ResizeGripper
          className="transform-gripper top-resize-gripper"
          position={topPos}
        />
        <ResizeGripper
          className="transform-gripper bottom-resize-gripper"
          position={bottomPos}
        />
        <ResizeGripper
          className="transform-gripper bottom-right-resize-gripper"
          position={bottomRightPos}
        />
      </>
    );
  }
}

const ResizeGripper = ({ position, className = "" }) => (
  <span className={"resize-gripper " + className} style={position} />
);
