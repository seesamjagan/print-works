/*******************************************************************************
 * An utility class to manage drag and drop of absolutely positioned elements.
 *
 * @author: சாமி. ஜெகன் லங்கா
 * @email: seesamjagan (at) yahoo.co.in
 * @license: MIT
 *
 ******************************************************************************/
export class DnDManager {
  static getInstance = () => dndInstance || new DnDManager();

  constructor() {
    if (dndInstance) {
      return dndInstance;
    }
    dndInstance = this;
    this.draggabels = [];
    this.configs = {};
    window.dndInstance = this; // for debugging in console.
  }

  init = dom => {
    if (dom) {
      // clean-up any existing event listener
      dom.removeEventListener("mousedown", this.onMouseDown);

      // add new event listener
      dom.addEventListener("mousedown", this.onMouseDown);
    }
    this.dom = dom;
    return this;
  };

  /**
   * util function to test if a class is already attached as draggable.
   * @param draggable { string }
   */
  isAttached = draggable => this.draggabels.indexOf(draggable) !== -1;

  /**
   * function to attach an element as draggable by its class name and set its config details
   * @param draggable {string} class name
   * @param config {object}
   */
  attach = (draggable, config = null) => {
    if (this.draggabels.indexOf(draggable) < 0) {
      this.draggabels.push(draggable);
    }

    this.configs[draggable] = Object.assign({}, defaultConfig, config || {});

    return this;
  };

  /**
   * function to discard an element from the draggable element list
   * @param draggable {string} class name
   */
  discard = draggable => {
    this.draggabels = this.draggabels.filter(cn => cn !== draggable);
    delete this.configs[draggable];
    return this;
  };

  get target() {
    return this._target;
  }

  set target(value) {
    if (this._target) {
      this._target.classList.toggle("holding");
    }
    this._target = value;
    if (this._target) {
      this._target.classList.toggle("holding");
    }
  }

  /**
   * mouse down handler
   */
  onMouseDown = e => {
    let t = e.target;

    let draggable = this.draggabels.find(draggable =>
      t.classList.contains(draggable)
    );
    if (draggable && !t.classList.contains("no-drag")) {
      log("its a valid dragabble element. store it");
      log("Drag Config for %s", draggable, this.configs[this.draggable]);

      let config = this.configs[draggable];

      this.target = t;
      this.draggable = draggable;
      this._targetDim = getDim(e);

      // stop default mouse actions such as selection
      e.preventDefault();
      e.stopPropagation();

      // notify the drag start event by onDragStart callback
      config.onDragStart && config.onDragStart(t, this._targetDim);

      // hook the mouse move and up event handlers
      this.dom.addEventListener("mousemove", this.onMouseMove);
      this.dom.addEventListener("mouseup", this.onMouseUp);
    }
  };

  /**
   * mouse move handler
   */
  onMouseMove = event => {
    // if we got a target to move
    if (this.target) {
      let node = this.target;

      let left = 0;
      let top = 0;

      const {
        localX,
        localY,
        //windowX,
        //windowY,
        mouseX,
        mouseY,
        parentX,
        parentY,
        width,
        height
      } = this._targetDim;

      // calculate the new left and top
      left = event.clientX - parentX;
      top = event.clientY - parentY;

      let config = this.configs[this.draggable];

      // apply the config on the new left and top position

      var {
        minLeft,
        maxLeft,
        minTop,
        maxTop,
        noLeft,
        noTop,
        gripToCenter,
      } = config;

      if (gripToCenter) {
        left -= width / 2;
        top -= height / 2;
      } else {
        left -= mouseX;
        top -= mouseY;
      }

      // set the left boundary to minLift & maxLeft
      if (minLeft !== false && minLeft > left) {
        left = minLeft;
      }
      if (maxLeft !== false) {
        if (left + width > maxLeft) {
          left = maxLeft - width;
        }
      }
      // set the top boundary to minTop and maxTop
      if (minTop !== false && minTop > top) {
        top = minTop;
      }
      if (maxTop !== false) {
        if (maxTop < top + height) {
          top = maxTop - height;
        }
      }

      // notify dragging event via onDrag callback
      config.onDrag &&
        config.onDrag(node, {
          left: left,
          top: top,
          oldLeft: localX,
          oldTop: localY,
          xDiff: left - localX,
          yDiff: top - localY
        }, this.draggable);

      // apply the computed left and top to the element
      !noLeft && (node.style.left = px(left));
      !noTop && (node.style.top = px(top));
    }
  };

  /**
   * mouse up handler
   */
  onMouseUp = e => {
    // un-hook the mouse move and up event handlers
    this.dom.removeEventListener("mousemove", this.onMouseMove);
    this.dom.removeEventListener("mouseup", this.onMouseUp);

    let config = this.configs[this.draggable];

    // notify drag complete event by onDragEnd callback
    if (config && config.onDragEnd) {
      config.onDragEnd(this.target);
    }

    // clear the refs.
    this.target = null;
  };
}

/**
 * instance of the dndManager class
 */
var dndInstance = null;

const debug = process.env.NODE_ENV === "development";

const log = (...args) => debug && console.log(...args);

/**
 * util function to cinver a string value to integer
 * @param {string} value int value of the given string or 0
 */
export const toInt = value => {
  value = parseInt(value);
  return isNaN(value) ? 0 : value;
};

export const px = value => value + "px";

/**
 * util to find the dimension of the target of the event
 * @param {MouseEvent} param0 event 
 * @param {number} zoom 
 */
export const getDim = ({ target: t, clientX, clientY }, zoom = 1) => {
  let {
    left: windowX ,
    top: windowY,
    width,
    height
  } = t.getBoundingClientRect();

  let localX = parseInt(t.style.left) || 0;
  let localY = parseInt(t.style.top) || 0;
  let parentX = windowX - localX;
  let parentY = windowY - localY;
  let mouseX = clientX - windowX;
  let mouseY = clientY - windowY;

  return {
    localX, // left position of the target in parent
    localY, // top position of the target in parent
    windowX, // left position of the target in document
    windowY, // top position of the target in document
    parentX, // left position of the PARENT in document
    parentY, // top position of the PARENT in document
    mouseX, // left position of the mouse in the target
    mouseY, // top  position of the mouse in the target
    width, // width of the target
    height // height of the target
  };
};

/**
 * default dnd config object
 *
 * @property minLeft {number | boolean}
 * @property maxLeft {number | boolean}
 * @property minTop {number | boolean}
 * @property maxTop {number | boolean}
 * @property noLeft {boolean}
 * @property noTop {boolean}
 * @property gripToCenter {boolean}
 * @property onDragStart {function}
 * @property onDrag {function}
 * @property onDragEnd {function}
 */
const defaultConfig = {
  minLeft: false,
  maxLeft: false,
  minTop: false,
  maxTop: false,
  noLeft: false,
  noTop: false,
  gripToCenter: false,
  zoom: 1,
  onDragStart: null,
  onDrag: null,
  onDragEnd: null
};

/* 
export const mouseCoords = e => {
  if (e.pageX || e.pageY) {
    return { x: e.pageX, y: e.pageY };
  }
  return {
    x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
    y: e.clientY + document.body.scrollTop - document.body.clientTop
  };
};
 */
