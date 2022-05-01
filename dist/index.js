'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var lodash = require('lodash');
var ansiEscapes = require('ansi-escapes');
var cliCursor = require('cli-cursor');
var originalIsCI = require('is-ci');
var autoBind = require('auto-bind');
var module$1 = require('module');
var scheduler = require('scheduler');
var createReconciler = require('react-reconciler');
var Yoga = require('yoga-layout-prebuilt');
var widestLine = require('widest-line');
var wrapAnsi = require('wrap-ansi');
var cliTruncate = require('cli-truncate');
var indentString = require('indent-string');
var cliBoxes = require('cli-boxes');
var chalk = require('chalk');
var sliceAnsi = require('slice-ansi');
var stringWidth = require('string-width');
var signalExit = require('signal-exit');
var patchConsole = require('patch-console');
var fs = require('fs');
var StackUtils = require('stack-utils');
var codeExcerpt = require('code-excerpt');
var stream = require('stream');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
	if (e && e.__esModule) return e;
	var n = Object.create(null);
	if (e) {
		Object.keys(e).forEach(function (k) {
			if (k !== 'default') {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	}
	n["default"] = e;
	return Object.freeze(n);
}

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var ansiEscapes__default = /*#__PURE__*/_interopDefaultLegacy(ansiEscapes);
var cliCursor__default = /*#__PURE__*/_interopDefaultLegacy(cliCursor);
var originalIsCI__default = /*#__PURE__*/_interopDefaultLegacy(originalIsCI);
var autoBind__default = /*#__PURE__*/_interopDefaultLegacy(autoBind);
var createReconciler__default = /*#__PURE__*/_interopDefaultLegacy(createReconciler);
var Yoga__default = /*#__PURE__*/_interopDefaultLegacy(Yoga);
var widestLine__default = /*#__PURE__*/_interopDefaultLegacy(widestLine);
var wrapAnsi__default = /*#__PURE__*/_interopDefaultLegacy(wrapAnsi);
var cliTruncate__default = /*#__PURE__*/_interopDefaultLegacy(cliTruncate);
var indentString__default = /*#__PURE__*/_interopDefaultLegacy(indentString);
var cliBoxes__default = /*#__PURE__*/_interopDefaultLegacy(cliBoxes);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var sliceAnsi__default = /*#__PURE__*/_interopDefaultLegacy(sliceAnsi);
var stringWidth__default = /*#__PURE__*/_interopDefaultLegacy(stringWidth);
var signalExit__default = /*#__PURE__*/_interopDefaultLegacy(signalExit);
var patchConsole__default = /*#__PURE__*/_interopDefaultLegacy(patchConsole);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var StackUtils__default = /*#__PURE__*/_interopDefaultLegacy(StackUtils);
var codeExcerpt__default = /*#__PURE__*/_interopDefaultLegacy(codeExcerpt);

const create = (stream, { showCursor = false } = {}) => {
  let previousLineCount = 0;
  let previousOutput = "";
  let hasHiddenCursor = false;
  const render = (str) => {
    if (!showCursor && !hasHiddenCursor) {
      cliCursor__default["default"].hide();
      hasHiddenCursor = true;
    }
    const output = str + "\n";
    if (output === previousOutput) {
      return;
    }
    previousOutput = output;
    stream.write(ansiEscapes__default["default"].eraseLines(previousLineCount) + output);
    previousLineCount = output.split("\n").length;
  };
  render.clear = () => {
    stream.write(ansiEscapes__default["default"].eraseLines(previousLineCount));
    previousOutput = "";
    previousLineCount = 0;
  };
  render.done = () => {
    previousOutput = "";
    previousLineCount = 0;
    if (!showCursor) {
      cliCursor__default["default"].show();
      hasHiddenCursor = false;
    }
  };
  return render;
};
var logUpdate = { create };

var require$1 = (
			false
				? module$1.createRequire((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('index.js', document.baseURI).href)))
				: require
		);

const cache$1 = {};
var measureText = (text) => {
  if (text.length === 0) {
    return {
      width: 0,
      height: 0
    };
  }
  if (cache$1[text]) {
    return cache$1[text];
  }
  const width = widestLine__default["default"](text);
  const height = text.split("\n").length;
  cache$1[text] = { width, height };
  return { width, height };
};

const applyPositionStyles = (node, style) => {
  if ("position" in style) {
    node.setPositionType(style.position === "absolute" ? Yoga__default["default"].POSITION_TYPE_ABSOLUTE : Yoga__default["default"].POSITION_TYPE_RELATIVE);
  }
};
const applyMarginStyles = (node, style) => {
  if ("marginLeft" in style) {
    node.setMargin(Yoga__default["default"].EDGE_START, style.marginLeft || 0);
  }
  if ("marginRight" in style) {
    node.setMargin(Yoga__default["default"].EDGE_END, style.marginRight || 0);
  }
  if ("marginTop" in style) {
    node.setMargin(Yoga__default["default"].EDGE_TOP, style.marginTop || 0);
  }
  if ("marginBottom" in style) {
    node.setMargin(Yoga__default["default"].EDGE_BOTTOM, style.marginBottom || 0);
  }
};
const applyPaddingStyles = (node, style) => {
  if ("paddingLeft" in style) {
    node.setPadding(Yoga__default["default"].EDGE_LEFT, style.paddingLeft || 0);
  }
  if ("paddingRight" in style) {
    node.setPadding(Yoga__default["default"].EDGE_RIGHT, style.paddingRight || 0);
  }
  if ("paddingTop" in style) {
    node.setPadding(Yoga__default["default"].EDGE_TOP, style.paddingTop || 0);
  }
  if ("paddingBottom" in style) {
    node.setPadding(Yoga__default["default"].EDGE_BOTTOM, style.paddingBottom || 0);
  }
};
const applyFlexStyles = (node, style) => {
  var _a;
  if ("flexGrow" in style) {
    node.setFlexGrow((_a = style.flexGrow) != null ? _a : 0);
  }
  if ("flexShrink" in style) {
    node.setFlexShrink(typeof style.flexShrink === "number" ? style.flexShrink : 1);
  }
  if ("flexDirection" in style) {
    if (style.flexDirection === "row") {
      node.setFlexDirection(Yoga__default["default"].FLEX_DIRECTION_ROW);
    }
    if (style.flexDirection === "row-reverse") {
      node.setFlexDirection(Yoga__default["default"].FLEX_DIRECTION_ROW_REVERSE);
    }
    if (style.flexDirection === "column") {
      node.setFlexDirection(Yoga__default["default"].FLEX_DIRECTION_COLUMN);
    }
    if (style.flexDirection === "column-reverse") {
      node.setFlexDirection(Yoga__default["default"].FLEX_DIRECTION_COLUMN_REVERSE);
    }
  }
  if ("flexBasis" in style) {
    if (typeof style.flexBasis === "number") {
      node.setFlexBasis(style.flexBasis);
    } else if (typeof style.flexBasis === "string") {
      node.setFlexBasisPercent(Number.parseInt(style.flexBasis, 10));
    } else {
      node.setFlexBasis(NaN);
    }
  }
  if ("alignItems" in style) {
    if (style.alignItems === "stretch" || !style.alignItems) {
      node.setAlignItems(Yoga__default["default"].ALIGN_STRETCH);
    }
    if (style.alignItems === "flex-start") {
      node.setAlignItems(Yoga__default["default"].ALIGN_FLEX_START);
    }
    if (style.alignItems === "center") {
      node.setAlignItems(Yoga__default["default"].ALIGN_CENTER);
    }
    if (style.alignItems === "flex-end") {
      node.setAlignItems(Yoga__default["default"].ALIGN_FLEX_END);
    }
  }
  if ("alignSelf" in style) {
    if (style.alignSelf === "auto" || !style.alignSelf) {
      node.setAlignSelf(Yoga__default["default"].ALIGN_AUTO);
    }
    if (style.alignSelf === "flex-start") {
      node.setAlignSelf(Yoga__default["default"].ALIGN_FLEX_START);
    }
    if (style.alignSelf === "center") {
      node.setAlignSelf(Yoga__default["default"].ALIGN_CENTER);
    }
    if (style.alignSelf === "flex-end") {
      node.setAlignSelf(Yoga__default["default"].ALIGN_FLEX_END);
    }
  }
  if ("justifyContent" in style) {
    if (style.justifyContent === "flex-start" || !style.justifyContent) {
      node.setJustifyContent(Yoga__default["default"].JUSTIFY_FLEX_START);
    }
    if (style.justifyContent === "center") {
      node.setJustifyContent(Yoga__default["default"].JUSTIFY_CENTER);
    }
    if (style.justifyContent === "flex-end") {
      node.setJustifyContent(Yoga__default["default"].JUSTIFY_FLEX_END);
    }
    if (style.justifyContent === "space-between") {
      node.setJustifyContent(Yoga__default["default"].JUSTIFY_SPACE_BETWEEN);
    }
    if (style.justifyContent === "space-around") {
      node.setJustifyContent(Yoga__default["default"].JUSTIFY_SPACE_AROUND);
    }
  }
};
const applyDimensionStyles = (node, style) => {
  var _a, _b;
  if ("width" in style) {
    if (typeof style.width === "number") {
      node.setWidth(style.width);
    } else if (typeof style.width === "string") {
      node.setWidthPercent(Number.parseInt(style.width, 10));
    } else {
      node.setWidthAuto();
    }
  }
  if ("height" in style) {
    if (typeof style.height === "number") {
      node.setHeight(style.height);
    } else if (typeof style.height === "string") {
      node.setHeightPercent(Number.parseInt(style.height, 10));
    } else {
      node.setHeightAuto();
    }
  }
  if ("minWidth" in style) {
    if (typeof style.minWidth === "string") {
      node.setMinWidthPercent(Number.parseInt(style.minWidth, 10));
    } else {
      node.setMinWidth((_a = style.minWidth) != null ? _a : 0);
    }
  }
  if ("minHeight" in style) {
    if (typeof style.minHeight === "string") {
      node.setMinHeightPercent(Number.parseInt(style.minHeight, 10));
    } else {
      node.setMinHeight((_b = style.minHeight) != null ? _b : 0);
    }
  }
};
const applyDisplayStyles = (node, style) => {
  if ("display" in style) {
    node.setDisplay(style.display === "flex" ? Yoga__default["default"].DISPLAY_FLEX : Yoga__default["default"].DISPLAY_NONE);
  }
};
const applyBorderStyles = (node, style) => {
  if ("borderStyle" in style) {
    const borderWidth = typeof style.borderStyle === "string" ? 1 : 0;
    node.setBorder(Yoga__default["default"].EDGE_TOP, borderWidth);
    node.setBorder(Yoga__default["default"].EDGE_BOTTOM, borderWidth);
    node.setBorder(Yoga__default["default"].EDGE_LEFT, borderWidth);
    node.setBorder(Yoga__default["default"].EDGE_RIGHT, borderWidth);
  }
};
var applyStyles = (node, style = {}) => {
  applyPositionStyles(node, style);
  applyMarginStyles(node, style);
  applyPaddingStyles(node, style);
  applyFlexStyles(node, style);
  applyDimensionStyles(node, style);
  applyDisplayStyles(node, style);
  applyBorderStyles(node, style);
};

const cache = {};
var wrapText = (text, maxWidth, wrapType) => {
  const cacheKey = text + String(maxWidth) + String(wrapType);
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  let wrappedText = text;
  if (wrapType === "wrap") {
    wrappedText = wrapAnsi__default["default"](text, maxWidth, {
      trim: false,
      hard: true
    });
  }
  if (wrapType.startsWith("truncate")) {
    let position = "end";
    if (wrapType === "truncate-middle") {
      position = "middle";
    }
    if (wrapType === "truncate-start") {
      position = "start";
    }
    wrappedText = cliTruncate__default["default"](text, maxWidth, { position });
  }
  cache[cacheKey] = wrappedText;
  return wrappedText;
};

const squashTextNodes = (node) => {
  let text = "";
  if (node.childNodes.length > 0) {
    for (const childNode of node.childNodes) {
      let nodeText = "";
      if (childNode.nodeName === "#text") {
        nodeText = childNode.nodeValue;
      } else {
        if (childNode.nodeName === "ink-text" || childNode.nodeName === "ink-virtual-text") {
          nodeText = squashTextNodes(childNode);
        }
        if (nodeText.length > 0 && typeof childNode.internal_transform === "function") {
          nodeText = childNode.internal_transform(nodeText);
        }
      }
      text += nodeText;
    }
  }
  return text;
};

const createNode = (nodeName) => {
  var _a;
  const node = {
    nodeName,
    style: {},
    attributes: {},
    childNodes: [],
    parentNode: null,
    yogaNode: nodeName === "ink-virtual-text" ? void 0 : Yoga__default["default"].Node.create()
  };
  if (nodeName === "ink-text") {
    (_a = node.yogaNode) == null ? void 0 : _a.setMeasureFunc(measureTextNode.bind(null, node));
  }
  return node;
};
const appendChildNode = (node, childNode) => {
  var _a;
  if (childNode.parentNode) {
    removeChildNode(childNode.parentNode, childNode);
  }
  childNode.parentNode = node;
  node.childNodes.push(childNode);
  if (childNode.yogaNode) {
    (_a = node.yogaNode) == null ? void 0 : _a.insertChild(childNode.yogaNode, node.yogaNode.getChildCount());
  }
  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    markNodeAsDirty(node);
  }
};
const insertBeforeNode = (node, newChildNode, beforeChildNode) => {
  var _a, _b;
  if (newChildNode.parentNode) {
    removeChildNode(newChildNode.parentNode, newChildNode);
  }
  newChildNode.parentNode = node;
  const index = node.childNodes.indexOf(beforeChildNode);
  if (index >= 0) {
    node.childNodes.splice(index, 0, newChildNode);
    if (newChildNode.yogaNode) {
      (_a = node.yogaNode) == null ? void 0 : _a.insertChild(newChildNode.yogaNode, index);
    }
    return;
  }
  node.childNodes.push(newChildNode);
  if (newChildNode.yogaNode) {
    (_b = node.yogaNode) == null ? void 0 : _b.insertChild(newChildNode.yogaNode, node.yogaNode.getChildCount());
  }
  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    markNodeAsDirty(node);
  }
};
const removeChildNode = (node, removeNode) => {
  var _a, _b;
  if (removeNode.yogaNode) {
    (_b = (_a = removeNode.parentNode) == null ? void 0 : _a.yogaNode) == null ? void 0 : _b.removeChild(removeNode.yogaNode);
  }
  removeNode.parentNode = null;
  const index = node.childNodes.indexOf(removeNode);
  if (index >= 0) {
    node.childNodes.splice(index, 1);
  }
  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    markNodeAsDirty(node);
  }
};
const setAttribute = (node, key, value) => {
  node.attributes[key] = value;
};
const setStyle = (node, style) => {
  node.style = style;
  if (node.yogaNode) {
    applyStyles(node.yogaNode, style);
  }
};
const createTextNode = (text) => {
  const node = {
    nodeName: "#text",
    nodeValue: text,
    yogaNode: void 0,
    parentNode: null,
    style: {}
  };
  setTextNodeValue(node, text);
  return node;
};
const measureTextNode = function(node, width) {
  var _a, _b;
  const text = node.nodeName === "#text" ? node.nodeValue : squashTextNodes(node);
  const dimensions = measureText(text);
  if (dimensions.width <= width) {
    return dimensions;
  }
  if (dimensions.width >= 1 && width > 0 && width < 1) {
    return dimensions;
  }
  const textWrap = (_b = (_a = node.style) == null ? void 0 : _a.textWrap) != null ? _b : "wrap";
  const wrappedText = wrapText(text, width, textWrap);
  return measureText(wrappedText);
};
const findClosestYogaNode = (node) => {
  var _a;
  if (!node || !node.parentNode) {
    return void 0;
  }
  return (_a = node.yogaNode) != null ? _a : findClosestYogaNode(node.parentNode);
};
const markNodeAsDirty = (node) => {
  const yogaNode = findClosestYogaNode(node);
  yogaNode == null ? void 0 : yogaNode.markDirty();
};
const setTextNodeValue = (node, text) => {
  if (typeof text !== "string") {
    text = String(text);
  }
  node.nodeValue = text;
  markNodeAsDirty(node);
};

if (process.env.DEV === "true") {
  try {
    require$1("./devtools");
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      console.warn(`
Debugging with React Devtools requires \`react-devtools-core\` dependency to be installed.

$ npm install --save-dev react-devtools-core
				`.trim() + "\n");
    } else {
      throw error;
    }
  }
}
const cleanupYogaNode = (node) => {
  node == null ? void 0 : node.unsetMeasureFunc();
  node == null ? void 0 : node.freeRecursive();
};
var reconciler = createReconciler__default["default"]({
  schedulePassiveEffects: scheduler.unstable_scheduleCallback,
  cancelPassiveEffects: scheduler.unstable_cancelCallback,
  now: Date.now,
  getRootHostContext: () => ({
    isInsideText: false
  }),
  prepareForCommit: () => null,
  preparePortalMount: () => null,
  clearContainer: () => false,
  shouldDeprioritizeSubtree: () => false,
  resetAfterCommit: (rootNode) => {
    if (rootNode.isStaticDirty) {
      rootNode.isStaticDirty = false;
      if (typeof rootNode.onImmediateRender === "function") {
        rootNode.onImmediateRender();
      }
      return;
    }
    if (typeof rootNode.onRender === "function") {
      rootNode.onRender();
    }
  },
  getChildHostContext: (parentHostContext, type) => {
    const previousIsInsideText = parentHostContext.isInsideText;
    const isInsideText = type === "ink-text" || type === "ink-virtual-text";
    if (previousIsInsideText === isInsideText) {
      return parentHostContext;
    }
    return { isInsideText };
  },
  shouldSetTextContent: () => false,
  createInstance: (originalType, newProps, _root, hostContext) => {
    if (hostContext.isInsideText && originalType === "ink-box") {
      throw new Error(`<Box> can\u2019t be nested inside <Text> component`);
    }
    const type = originalType === "ink-text" && hostContext.isInsideText ? "ink-virtual-text" : originalType;
    const node = createNode(type);
    for (const [key, value] of Object.entries(newProps)) {
      if (key === "children") {
        continue;
      } else if (key === "style") {
        setStyle(node, value);
      } else if (key === "internal_transform") {
        node.internal_transform = value;
      } else if (key === "internal_static") {
        node.internal_static = true;
      } else {
        setAttribute(node, key, value);
      }
    }
    return node;
  },
  createTextInstance: (text, _root, hostContext) => {
    if (!hostContext.isInsideText) {
      throw new Error(`Text string "${text}" must be rendered inside <Text> component`);
    }
    return createTextNode(text);
  },
  resetTextContent: () => {
  },
  hideTextInstance: (node) => {
    setTextNodeValue(node, "");
  },
  unhideTextInstance: (node, text) => {
    setTextNodeValue(node, text);
  },
  getPublicInstance: (instance) => instance,
  hideInstance: (node) => {
    var _a;
    (_a = node.yogaNode) == null ? void 0 : _a.setDisplay(Yoga__default["default"].DISPLAY_NONE);
  },
  unhideInstance: (node) => {
    var _a;
    (_a = node.yogaNode) == null ? void 0 : _a.setDisplay(Yoga__default["default"].DISPLAY_FLEX);
  },
  appendInitialChild: appendChildNode,
  appendChild: appendChildNode,
  insertBefore: insertBeforeNode,
  finalizeInitialChildren: (node, _type, _props, rootNode) => {
    if (node.internal_static) {
      rootNode.isStaticDirty = true;
      rootNode.staticNode = node;
    }
    return false;
  },
  supportsMutation: true,
  appendChildToContainer: appendChildNode,
  insertInContainerBefore: insertBeforeNode,
  removeChildFromContainer: (node, removeNode) => {
    removeChildNode(node, removeNode);
    cleanupYogaNode(removeNode.yogaNode);
  },
  prepareUpdate: (node, _type, oldProps, newProps, rootNode) => {
    if (node.internal_static) {
      rootNode.isStaticDirty = true;
    }
    const updatePayload = {};
    const keys = Object.keys(newProps);
    for (const key of keys) {
      if (newProps[key] !== oldProps[key]) {
        const isStyle = key === "style" && typeof newProps.style === "object" && typeof oldProps.style === "object";
        if (isStyle) {
          const newStyle = newProps.style;
          const oldStyle = oldProps.style;
          const styleKeys = Object.keys(newStyle);
          for (const styleKey of styleKeys) {
            if (styleKey === "borderStyle" || styleKey === "borderColor") {
              if (typeof updatePayload.style !== "object") {
                const style = {};
                updatePayload.style = style;
              }
              updatePayload.style.borderStyle = newStyle.borderStyle;
              updatePayload.style.borderColor = newStyle.borderColor;
            }
            if (newStyle[styleKey] !== oldStyle[styleKey]) {
              if (typeof updatePayload.style !== "object") {
                const style = {};
                updatePayload.style = style;
              }
              updatePayload.style[styleKey] = newStyle[styleKey];
            }
          }
          continue;
        }
        updatePayload[key] = newProps[key];
      }
    }
    return updatePayload;
  },
  commitUpdate: (node, updatePayload) => {
    for (const [key, value] of Object.entries(updatePayload)) {
      if (key === "children") {
        continue;
      } else if (key === "style") {
        setStyle(node, value);
      } else if (key === "internal_transform") {
        node.internal_transform = value;
      } else if (key === "internal_static") {
        node.internal_static = true;
      } else {
        setAttribute(node, key, value);
      }
    }
  },
  commitTextUpdate: (node, _oldText, newText) => {
    setTextNodeValue(node, newText);
  },
  removeChild: (node, removeNode) => {
    removeChildNode(node, removeNode);
    cleanupYogaNode(removeNode.yogaNode);
  }
});

var getMaxWidth = (yogaNode) => {
  return yogaNode.getComputedWidth() - yogaNode.getComputedPadding(Yoga__default["default"].EDGE_LEFT) - yogaNode.getComputedPadding(Yoga__default["default"].EDGE_RIGHT) - yogaNode.getComputedBorder(Yoga__default["default"].EDGE_LEFT) - yogaNode.getComputedBorder(Yoga__default["default"].EDGE_RIGHT);
};

const RGB_LIKE_REGEX = /^(rgb|hsl|hsv|hwb)\(\s?(\d+),\s?(\d+),\s?(\d+)\s?\)$/;
const ANSI_REGEX = /^(ansi|ansi256)\(\s?(\d+)\s?\)$/;
const getMethod = (name, type) => {
  if (type === "foreground") {
    return name;
  }
  return "bg" + name[0].toUpperCase() + name.slice(1);
};
var colorize = (str, color, type) => {
  if (!color) {
    return str;
  }
  if (color in chalk__default["default"]) {
    const method = getMethod(color, type);
    return chalk__default["default"][method](str);
  }
  if (color.startsWith("#")) {
    const method = getMethod("hex", type);
    return chalk__default["default"][method](color)(str);
  }
  if (color.startsWith("ansi")) {
    const matches = ANSI_REGEX.exec(color);
    if (!matches) {
      return str;
    }
    const method = getMethod(matches[1], type);
    const value = Number(matches[2]);
    return chalk__default["default"][method](value)(str);
  }
  const isRgbLike = color.startsWith("rgb") || color.startsWith("hsl") || color.startsWith("hsv") || color.startsWith("hwb");
  if (isRgbLike) {
    const matches = RGB_LIKE_REGEX.exec(color);
    if (!matches) {
      return str;
    }
    const method = getMethod(matches[1], type);
    const firstValue = Number(matches[2]);
    const secondValue = Number(matches[3]);
    const thirdValue = Number(matches[4]);
    return chalk__default["default"][method](firstValue, secondValue, thirdValue)(str);
  }
  return str;
};

var renderBorder = (x, y, node, output) => {
  if (typeof node.style.borderStyle === "string") {
    const width = node.yogaNode.getComputedWidth();
    const height = node.yogaNode.getComputedHeight();
    const color = node.style.borderColor;
    const box = cliBoxes__default["default"][node.style.borderStyle];
    const topBorder = colorize(box.topLeft + box.horizontal.repeat(width - 2) + box.topRight, color, "foreground");
    const verticalBorder = (colorize(box.vertical, color, "foreground") + "\n").repeat(height - 2);
    const bottomBorder = colorize(box.bottomLeft + box.horizontal.repeat(width - 2) + box.bottomRight, color, "foreground");
    output.write(x, y, topBorder, { transformers: [] });
    output.write(x, y + 1, verticalBorder, { transformers: [] });
    output.write(x + width - 1, y + 1, verticalBorder, { transformers: [] });
    output.write(x, y + height - 1, bottomBorder, { transformers: [] });
  }
};

const applyPaddingToText = (node, text) => {
  var _a;
  const yogaNode = (_a = node.childNodes[0]) == null ? void 0 : _a.yogaNode;
  if (yogaNode) {
    const offsetX = yogaNode.getComputedLeft();
    const offsetY = yogaNode.getComputedTop();
    text = "\n".repeat(offsetY) + indentString__default["default"](text, offsetX);
  }
  return text;
};
const renderNodeToOutput = (node, output, options) => {
  var _a;
  const {
    offsetX = 0,
    offsetY = 0,
    transformers = [],
    skipStaticElements
  } = options;
  if (skipStaticElements && node.internal_static) {
    return;
  }
  const { yogaNode } = node;
  if (yogaNode) {
    if (yogaNode.getDisplay() === Yoga__default["default"].DISPLAY_NONE) {
      return;
    }
    const x = offsetX + yogaNode.getComputedLeft();
    const y = offsetY + yogaNode.getComputedTop();
    let newTransformers = transformers;
    if (typeof node.internal_transform === "function") {
      newTransformers = [node.internal_transform, ...transformers];
    }
    if (node.nodeName === "ink-text") {
      let text = squashTextNodes(node);
      if (text.length > 0) {
        const currentWidth = widestLine__default["default"](text);
        const maxWidth = getMaxWidth(yogaNode);
        if (currentWidth > maxWidth) {
          const textWrap = (_a = node.style.textWrap) != null ? _a : "wrap";
          text = wrapText(text, maxWidth, textWrap);
        }
        text = applyPaddingToText(node, text);
        output.write(x, y, text, { transformers: newTransformers });
      }
      return;
    }
    if (node.nodeName === "ink-box") {
      renderBorder(x, y, node, output);
    }
    if (node.nodeName === "ink-root" || node.nodeName === "ink-box") {
      for (const childNode of node.childNodes) {
        renderNodeToOutput(childNode, output, {
          offsetX: x,
          offsetY: y,
          transformers: newTransformers,
          skipStaticElements
        });
      }
    }
  }
};

class Output {
  constructor(options) {
    this.writes = [];
    const { width, height } = options;
    this.width = width;
    this.height = height;
  }
  write(x, y, text, options) {
    const { transformers } = options;
    if (!text) {
      return;
    }
    this.writes.push({ x, y, text, transformers });
  }
  get() {
    const output = [];
    for (let y = 0; y < this.height; y++) {
      output.push(" ".repeat(this.width));
    }
    for (const write of this.writes) {
      const { x, y, text, transformers } = write;
      const lines = text.split("\n");
      let offsetY = 0;
      for (let line of lines) {
        const currentLine = output[y + offsetY];
        if (!currentLine) {
          continue;
        }
        const width = stringWidth__default["default"](line);
        for (const transformer of transformers) {
          line = transformer(line);
        }
        output[y + offsetY] = sliceAnsi__default["default"](currentLine, 0, x) + line + sliceAnsi__default["default"](currentLine, x + width);
        offsetY++;
      }
    }
    const generatedOutput = output.map((line) => line.trimRight()).join("\n");
    return {
      output: generatedOutput,
      height: output.length
    };
  }
}

var render$1 = (node, terminalWidth) => {
  var _a;
  node.yogaNode.setWidth(terminalWidth);
  if (node.yogaNode) {
    node.yogaNode.calculateLayout(void 0, void 0, Yoga__default["default"].DIRECTION_LTR);
    const output = new Output({
      width: node.yogaNode.getComputedWidth(),
      height: node.yogaNode.getComputedHeight()
    });
    renderNodeToOutput(node, output, { skipStaticElements: true });
    let staticOutput;
    if ((_a = node.staticNode) == null ? void 0 : _a.yogaNode) {
      staticOutput = new Output({
        width: node.staticNode.yogaNode.getComputedWidth(),
        height: node.staticNode.yogaNode.getComputedHeight()
      });
      renderNodeToOutput(node.staticNode, staticOutput, {
        skipStaticElements: false
      });
    }
    const { output: generatedOutput, height: outputHeight } = output.get();
    return {
      output: generatedOutput,
      outputHeight,
      staticOutput: staticOutput ? `${staticOutput.get().output}
` : ""
    };
  }
  return {
    output: "",
    outputHeight: 0,
    staticOutput: ""
  };
};

var instances = /* @__PURE__ */ new WeakMap();

const AppContext = React.createContext({
  exit: () => {
  }
});
AppContext.displayName = "InternalAppContext";

const StdinContext = React.createContext({
  stdin: void 0,
  setRawMode: () => {
  },
  isRawModeSupported: false,
  internal_exitOnCtrlC: true
});
StdinContext.displayName = "InternalStdinContext";

const StdoutContext = React.createContext({
  stdout: void 0,
  write: () => {
  }
});
StdoutContext.displayName = "InternalStdoutContext";

const StderrContext = React.createContext({
  stderr: void 0,
  write: () => {
  }
});
StderrContext.displayName = "InternalStderrContext";

const FocusContext = React.createContext({
  activeId: void 0,
  add: () => {
  },
  remove: () => {
  },
  activate: () => {
  },
  deactivate: () => {
  },
  enableFocus: () => {
  },
  disableFocus: () => {
  },
  focusNext: () => {
  },
  focusPrevious: () => {
  },
  focus: () => {
  }
});
FocusContext.displayName = "InternalFocusContext";

var __defProp$2 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2.call(b, prop))
      __defNormalProp$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(b)) {
      if (__propIsEnum$2.call(b, prop))
        __defNormalProp$2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const Box = React.forwardRef((_a, ref) => {
  var _b = _a, { children } = _b, style = __objRest(_b, ["children"]);
  const transformedStyle = __spreadProps(__spreadValues$2({}, style), {
    marginLeft: style.marginLeft || style.marginX || style.margin || 0,
    marginRight: style.marginRight || style.marginX || style.margin || 0,
    marginTop: style.marginTop || style.marginY || style.margin || 0,
    marginBottom: style.marginBottom || style.marginY || style.margin || 0,
    paddingLeft: style.paddingLeft || style.paddingX || style.padding || 0,
    paddingRight: style.paddingRight || style.paddingX || style.padding || 0,
    paddingTop: style.paddingTop || style.paddingY || style.padding || 0,
    paddingBottom: style.paddingBottom || style.paddingY || style.padding || 0
  });
  return /* @__PURE__ */ React__default["default"].createElement("ink-box", {
    ref,
    style: transformedStyle
  }, children);
});
Box.displayName = "Box";
Box.defaultProps = {
  flexDirection: "row",
  flexGrow: 0,
  flexShrink: 1
};

const Text = ({
  color,
  backgroundColor,
  dimColor,
  bold,
  italic,
  underline,
  strikethrough,
  inverse,
  wrap,
  children
}) => {
  if (children === void 0 || children === null) {
    return null;
  }
  const transform = (children2) => {
    if (dimColor) {
      children2 = chalk__default["default"].dim(children2);
    }
    if (color) {
      children2 = colorize(children2, color, "foreground");
    }
    if (backgroundColor) {
      children2 = colorize(children2, backgroundColor, "background");
    }
    if (bold) {
      children2 = chalk__default["default"].bold(children2);
    }
    if (italic) {
      children2 = chalk__default["default"].italic(children2);
    }
    if (underline) {
      children2 = chalk__default["default"].underline(children2);
    }
    if (strikethrough) {
      children2 = chalk__default["default"].strikethrough(children2);
    }
    if (inverse) {
      children2 = chalk__default["default"].inverse(children2);
    }
    return children2;
  };
  return /* @__PURE__ */ React__default["default"].createElement("ink-text", {
    style: { flexGrow: 0, flexShrink: 1, flexDirection: "row", textWrap: wrap },
    internal_transform: transform
  }, children);
};
Text.displayName = "Text";
Text.defaultProps = {
  dimColor: false,
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  wrap: "wrap"
};

const stackUtils = new StackUtils__default["default"]({
  cwd: process.cwd(),
  internals: StackUtils__default["default"].nodeInternals()
});
const ErrorOverview = ({ error }) => {
  const stack = error.stack ? error.stack.split("\n").slice(1) : void 0;
  const origin = stack ? stackUtils.parseLine(stack[0]) : void 0;
  let excerpt;
  let lineWidth = 0;
  if ((origin == null ? void 0 : origin.file) && (origin == null ? void 0 : origin.line) && fs__namespace.existsSync(origin.file)) {
    const sourceCode = fs__namespace.readFileSync(origin.file, "utf8");
    excerpt = codeExcerpt__default["default"](sourceCode, origin.line);
    if (excerpt) {
      for (const { line } of excerpt) {
        lineWidth = Math.max(lineWidth, String(line).length);
      }
    }
  }
  return /* @__PURE__ */ React__default["default"].createElement(Box, {
    flexDirection: "column",
    padding: 1
  }, /* @__PURE__ */ React__default["default"].createElement(Box, null, /* @__PURE__ */ React__default["default"].createElement(Text, {
    backgroundColor: "red",
    color: "white"
  }, " ", "ERROR", " "), /* @__PURE__ */ React__default["default"].createElement(Text, null, " ", error.message)), origin && /* @__PURE__ */ React__default["default"].createElement(Box, {
    marginTop: 1
  }, /* @__PURE__ */ React__default["default"].createElement(Text, {
    dimColor: true
  }, origin.file, ":", origin.line, ":", origin.column)), origin && excerpt && /* @__PURE__ */ React__default["default"].createElement(Box, {
    marginTop: 1,
    flexDirection: "column"
  }, excerpt.map(({ line, value }) => /* @__PURE__ */ React__default["default"].createElement(Box, {
    key: line
  }, /* @__PURE__ */ React__default["default"].createElement(Box, {
    width: lineWidth + 1
  }, /* @__PURE__ */ React__default["default"].createElement(Text, {
    dimColor: line !== origin.line,
    backgroundColor: line === origin.line ? "red" : void 0,
    color: line === origin.line ? "white" : void 0
  }, String(line).padStart(lineWidth, " "), ":")), /* @__PURE__ */ React__default["default"].createElement(Text, {
    key: line,
    backgroundColor: line === origin.line ? "red" : void 0,
    color: line === origin.line ? "white" : void 0
  }, " " + value)))), error.stack && /* @__PURE__ */ React__default["default"].createElement(Box, {
    marginTop: 1,
    flexDirection: "column"
  }, error.stack.split("\n").slice(1).map((line) => {
    const parsedLine = stackUtils.parseLine(line);
    if (!parsedLine) {
      return /* @__PURE__ */ React__default["default"].createElement(Box, {
        key: line
      }, /* @__PURE__ */ React__default["default"].createElement(Text, {
        dimColor: true
      }, "- "), /* @__PURE__ */ React__default["default"].createElement(Text, {
        dimColor: true,
        bold: true
      }, line));
    }
    return /* @__PURE__ */ React__default["default"].createElement(Box, {
      key: line
    }, /* @__PURE__ */ React__default["default"].createElement(Text, {
      dimColor: true
    }, "- "), /* @__PURE__ */ React__default["default"].createElement(Text, {
      dimColor: true,
      bold: true
    }, parsedLine.function), /* @__PURE__ */ React__default["default"].createElement(Text, {
      dimColor: true,
      color: "gray"
    }, " ", "(", parsedLine.file, ":", parsedLine.line, ":", parsedLine.column, ")"));
  })));
};

const TAB = "	";
const SHIFT_TAB = "\x1B[Z";
const ESC = "\x1B";
class App extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      isFocusEnabled: true,
      activeFocusId: void 0,
      focusables: [],
      error: void 0
    };
    this.rawModeEnabledCount = 0;
    this.handleSetRawMode = (isEnabled) => {
      const { stdin } = this.props;
      if (!this.isRawModeSupported()) {
        if (stdin === process.stdin) {
          throw new Error("Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported");
        } else {
          throw new Error("Raw mode is not supported on the stdin provided to Ink.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported");
        }
      }
      stdin.setEncoding("utf8");
      if (isEnabled) {
        if (this.rawModeEnabledCount === 0) {
          stdin.addListener("data", this.handleInput);
          stdin.resume();
          stdin.setRawMode(true);
        }
        this.rawModeEnabledCount++;
        return;
      }
      if (--this.rawModeEnabledCount === 0) {
        stdin.setRawMode(false);
        stdin.removeListener("data", this.handleInput);
        stdin.pause();
      }
    };
    this.handleInput = (input) => {
      if (input === "" && this.props.exitOnCtrlC) {
        this.handleExit();
      }
      if (input === ESC && this.state.activeFocusId) {
        this.setState({
          activeFocusId: void 0
        });
      }
      if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
        if (input === TAB) {
          this.focusNext();
        }
        if (input === SHIFT_TAB) {
          this.focusPrevious();
        }
      }
    };
    this.handleExit = (error) => {
      if (this.isRawModeSupported()) {
        this.handleSetRawMode(false);
      }
      this.props.onExit(error);
    };
    this.enableFocus = () => {
      this.setState({
        isFocusEnabled: true
      });
    };
    this.disableFocus = () => {
      this.setState({
        isFocusEnabled: false
      });
    };
    this.focus = (id) => {
      this.setState((previousState) => {
        const hasFocusableId = previousState.focusables.some((focusable) => (focusable == null ? void 0 : focusable.id) === id);
        if (!hasFocusableId) {
          return previousState;
        }
        return { activeFocusId: id };
      });
    };
    this.focusNext = () => {
      this.setState((previousState) => {
        var _a;
        const firstFocusableId = (_a = previousState.focusables[0]) == null ? void 0 : _a.id;
        const nextFocusableId = this.findNextFocusable(previousState);
        return {
          activeFocusId: nextFocusableId || firstFocusableId
        };
      });
    };
    this.focusPrevious = () => {
      this.setState((previousState) => {
        var _a;
        const lastFocusableId = (_a = previousState.focusables[previousState.focusables.length - 1]) == null ? void 0 : _a.id;
        const previousFocusableId = this.findPreviousFocusable(previousState);
        return {
          activeFocusId: previousFocusableId || lastFocusableId
        };
      });
    };
    this.addFocusable = (id, { autoFocus }) => {
      this.setState((previousState) => {
        let nextFocusId = previousState.activeFocusId;
        if (!nextFocusId && autoFocus) {
          nextFocusId = id;
        }
        return {
          activeFocusId: nextFocusId,
          focusables: [
            ...previousState.focusables,
            {
              id,
              isActive: true
            }
          ]
        };
      });
    };
    this.removeFocusable = (id) => {
      this.setState((previousState) => ({
        activeFocusId: previousState.activeFocusId === id ? void 0 : previousState.activeFocusId,
        focusables: previousState.focusables.filter((focusable) => {
          return focusable.id !== id;
        })
      }));
    };
    this.activateFocusable = (id) => {
      this.setState((previousState) => ({
        focusables: previousState.focusables.map((focusable) => {
          if (focusable.id !== id) {
            return focusable;
          }
          return {
            id,
            isActive: true
          };
        })
      }));
    };
    this.deactivateFocusable = (id) => {
      this.setState((previousState) => ({
        activeFocusId: previousState.activeFocusId === id ? void 0 : previousState.activeFocusId,
        focusables: previousState.focusables.map((focusable) => {
          if (focusable.id !== id) {
            return focusable;
          }
          return {
            id,
            isActive: false
          };
        })
      }));
    };
    this.findNextFocusable = (state) => {
      var _a;
      const activeIndex = state.focusables.findIndex((focusable) => {
        return focusable.id === state.activeFocusId;
      });
      for (let index = activeIndex + 1; index < state.focusables.length; index++) {
        if ((_a = state.focusables[index]) == null ? void 0 : _a.isActive) {
          return state.focusables[index].id;
        }
      }
      return void 0;
    };
    this.findPreviousFocusable = (state) => {
      var _a;
      const activeIndex = state.focusables.findIndex((focusable) => {
        return focusable.id === state.activeFocusId;
      });
      for (let index = activeIndex - 1; index >= 0; index--) {
        if ((_a = state.focusables[index]) == null ? void 0 : _a.isActive) {
          return state.focusables[index].id;
        }
      }
      return void 0;
    };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  isRawModeSupported() {
    return this.props.stdin.isTTY;
  }
  render() {
    return /* @__PURE__ */ React__default["default"].createElement(AppContext.Provider, {
      value: {
        exit: this.handleExit
      }
    }, /* @__PURE__ */ React__default["default"].createElement(StdinContext.Provider, {
      value: {
        stdin: this.props.stdin,
        setRawMode: this.handleSetRawMode,
        isRawModeSupported: this.isRawModeSupported(),
        internal_exitOnCtrlC: this.props.exitOnCtrlC
      }
    }, /* @__PURE__ */ React__default["default"].createElement(StdoutContext.Provider, {
      value: {
        stdout: this.props.stdout,
        write: this.props.writeToStdout
      }
    }, /* @__PURE__ */ React__default["default"].createElement(StderrContext.Provider, {
      value: {
        stderr: this.props.stderr,
        write: this.props.writeToStderr
      }
    }, /* @__PURE__ */ React__default["default"].createElement(FocusContext.Provider, {
      value: {
        activeId: this.state.activeFocusId,
        add: this.addFocusable,
        remove: this.removeFocusable,
        activate: this.activateFocusable,
        deactivate: this.deactivateFocusable,
        enableFocus: this.enableFocus,
        disableFocus: this.disableFocus,
        focusNext: this.focusNext,
        focusPrevious: this.focusPrevious,
        focus: this.focus
      }
    }, this.state.error ? /* @__PURE__ */ React__default["default"].createElement(ErrorOverview, {
      error: this.state.error
    }) : this.props.children)))));
  }
  componentDidMount() {
    cliCursor__default["default"].hide(this.props.stdout);
  }
  componentWillUnmount() {
    cliCursor__default["default"].show(this.props.stdout);
    if (this.isRawModeSupported()) {
      this.handleSetRawMode(false);
    }
  }
  componentDidCatch(error) {
    this.handleExit(error);
  }
}
App.displayName = "InternalApp";

const isCI = process.env.CI === "false" ? false : originalIsCI__default["default"];
const noop = () => {
};
class Ink {
  constructor(options) {
    this.resolveExitPromise = () => {
    };
    this.rejectExitPromise = () => {
    };
    this.unsubscribeExit = () => {
    };
    this.onRender = () => {
      if (this.isUnmounted) {
        return;
      }
      const { output, outputHeight, staticOutput } = render$1(this.rootNode, this.options.stdout.columns || 80);
      const hasStaticOutput = staticOutput && staticOutput !== "\n";
      if (this.options.debug) {
        if (hasStaticOutput) {
          this.fullStaticOutput += staticOutput;
        }
        this.options.stdout.write(this.fullStaticOutput + output);
        return;
      }
      if (isCI) {
        if (hasStaticOutput) {
          this.options.stdout.write(staticOutput);
        }
        this.lastOutput = output;
        return;
      }
      if (hasStaticOutput) {
        this.fullStaticOutput += staticOutput;
      }
      if (outputHeight >= this.options.stdout.rows) {
        this.options.stdout.write(ansiEscapes__default["default"].clearTerminal + this.fullStaticOutput + output);
        this.lastOutput = output;
        return;
      }
      if (hasStaticOutput) {
        this.log.clear();
        this.options.stdout.write(staticOutput);
        this.log(output);
      }
      if (!hasStaticOutput && output !== this.lastOutput) {
        this.throttledLog(output);
      }
      this.lastOutput = output;
    };
    autoBind__default["default"](this);
    this.options = options;
    this.rootNode = createNode("ink-root");
    this.rootNode.onRender = options.debug ? this.onRender : lodash.throttle(this.onRender, 32, {
      leading: true,
      trailing: true
    });
    this.rootNode.onImmediateRender = this.onRender;
    this.log = logUpdate.create(options.stdout);
    this.throttledLog = options.debug ? this.log : lodash.throttle(this.log, void 0, {
      leading: true,
      trailing: true
    });
    this.isUnmounted = false;
    this.lastOutput = "";
    this.fullStaticOutput = "";
    this.container = reconciler.createContainer(this.rootNode, 0, false, null);
    this.unsubscribeExit = signalExit__default["default"](this.unmount, { alwaysLast: false });
    if (process.env.DEV === "true") {
      reconciler.injectIntoDevTools({
        bundleType: 0,
        version: "16.13.1",
        rendererPackageName: "ink"
      });
    }
    if (options.patchConsole) {
      this.patchConsole();
    }
    if (!isCI) {
      options.stdout.on("resize", this.onRender);
      this.unsubscribeResize = () => {
        options.stdout.off("resize", this.onRender);
      };
    }
  }
  render(node) {
    const tree = /* @__PURE__ */ React__default["default"].createElement(App, {
      stdin: this.options.stdin,
      stdout: this.options.stdout,
      stderr: this.options.stderr,
      writeToStdout: this.writeToStdout,
      writeToStderr: this.writeToStderr,
      exitOnCtrlC: this.options.exitOnCtrlC,
      onExit: this.unmount
    }, node);
    reconciler.updateContainer(tree, this.container, null, noop);
  }
  writeToStdout(data) {
    if (this.isUnmounted) {
      return;
    }
    if (this.options.debug) {
      this.options.stdout.write(data + this.fullStaticOutput + this.lastOutput);
      return;
    }
    if (isCI) {
      this.options.stdout.write(data);
      return;
    }
    this.log.clear();
    this.options.stdout.write(data);
    this.log(this.lastOutput);
  }
  writeToStderr(data) {
    if (this.isUnmounted) {
      return;
    }
    if (this.options.debug) {
      this.options.stderr.write(data);
      this.options.stdout.write(this.fullStaticOutput + this.lastOutput);
      return;
    }
    if (isCI) {
      this.options.stderr.write(data);
      return;
    }
    this.log.clear();
    this.options.stderr.write(data);
    this.log(this.lastOutput);
  }
  unmount(error) {
    if (this.isUnmounted) {
      return;
    }
    this.onRender();
    this.unsubscribeExit();
    if (typeof this.restoreConsole === "function") {
      this.restoreConsole();
    }
    if (typeof this.unsubscribeResize === "function") {
      this.unsubscribeResize();
    }
    if (isCI) {
      this.options.stdout.write(this.lastOutput + "\n");
    } else if (!this.options.debug) {
      this.log.done();
    }
    this.isUnmounted = true;
    reconciler.updateContainer(null, this.container, null, noop);
    instances.delete(this.options.stdout);
    if (error instanceof Error) {
      this.rejectExitPromise(error);
    } else {
      this.resolveExitPromise();
    }
  }
  waitUntilExit() {
    if (!this.exitPromise) {
      this.exitPromise = new Promise((resolve, reject) => {
        this.resolveExitPromise = resolve;
        this.rejectExitPromise = reject;
      });
    }
    return this.exitPromise;
  }
  clear() {
    if (!isCI && !this.options.debug) {
      this.log.clear();
    }
  }
  patchConsole() {
    if (this.options.debug) {
      return;
    }
    this.restoreConsole = patchConsole__default["default"]((stream, data) => {
      if (stream === "stdout") {
        this.writeToStdout(data);
      }
      if (stream === "stderr") {
        const isReactMessage = data.startsWith("The above error occurred");
        if (!isReactMessage) {
          this.writeToStderr(data);
        }
      }
    });
  }
}

var __defProp$1 = Object.defineProperty;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
const render = (node, options) => {
  const inkOptions = __spreadValues$1({
    stdout: process.stdout,
    stdin: process.stdin,
    stderr: process.stderr,
    debug: false,
    exitOnCtrlC: true,
    patchConsole: true
  }, getOptions(options));
  const instance = getInstance(inkOptions.stdout, () => new Ink(inkOptions));
  instance.render(node);
  return {
    rerender: instance.render,
    unmount: () => instance.unmount(),
    waitUntilExit: instance.waitUntilExit,
    cleanup: () => instances.delete(inkOptions.stdout),
    clear: instance.clear
  };
};
const getOptions = (stdout = {}) => {
  if (stdout instanceof stream.Stream) {
    return {
      stdout,
      stdin: process.stdin
    };
  }
  return stdout;
};
const getInstance = (stdout, createInstance) => {
  let instance;
  if (instances.has(stdout)) {
    instance = instances.get(stdout);
  } else {
    instance = createInstance();
    instances.set(stdout, instance);
  }
  return instance;
};

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const Static = (props) => {
  const { items, children: render, style: customStyle } = props;
  const [index, setIndex] = React.useState(0);
  const itemsToRender = React.useMemo(() => {
    return items.slice(index);
  }, [items, index]);
  React.useLayoutEffect(() => {
    setIndex(items.length);
  }, [items.length]);
  const children = itemsToRender.map((item, itemIndex) => {
    return render(item, index + itemIndex);
  });
  const style = React.useMemo(() => __spreadValues({
    position: "absolute",
    flexDirection: "column"
  }, customStyle), [customStyle]);
  return /* @__PURE__ */ React__default["default"].createElement("ink-box", {
    internal_static: true,
    style
  }, children);
};
Static.displayName = "Static";

const Transform = ({ children, transform }) => {
  if (children === void 0 || children === null) {
    return null;
  }
  return /* @__PURE__ */ React__default["default"].createElement("ink-text", {
    style: { flexGrow: 0, flexShrink: 1, flexDirection: "row" },
    internal_transform: transform
  }, children);
};
Transform.displayName = "Transform";

const Newline = ({ count = 1 }) => /* @__PURE__ */ React__default["default"].createElement("ink-text", null, "\n".repeat(count));
Newline.displayName = "Newline";

const Spacer = () => /* @__PURE__ */ React__default["default"].createElement(Box, {
  flexGrow: 1
});
Spacer.displayName = "Spacer";

const useStdin = () => React.useContext(StdinContext);

const useInput = (inputHandler, options = {}) => {
  const { stdin, setRawMode, internal_exitOnCtrlC } = useStdin();
  React.useEffect(() => {
    if (options.isActive === false) {
      return;
    }
    setRawMode(true);
    return () => {
      setRawMode(false);
    };
  }, [options.isActive, setRawMode]);
  React.useEffect(() => {
    if (options.isActive === false) {
      return;
    }
    const handleData = (data) => {
      let input = String(data);
      const key = {
        upArrow: input === "\x1B[A",
        downArrow: input === "\x1B[B",
        leftArrow: input === "\x1B[D",
        rightArrow: input === "\x1B[C",
        pageDown: input === "\x1B[6~",
        pageUp: input === "\x1B[5~",
        return: input === "\r",
        escape: input === "\x1B",
        ctrl: false,
        shift: false,
        tab: input === "	" || input === "\x1B[Z",
        backspace: input === "\b",
        delete: input === "\x7F" || input === "\x1B[3~",
        meta: false
      };
      if (input <= "" && !key.return) {
        input = String.fromCharCode(input.charCodeAt(0) + "a".charCodeAt(0) - 1);
        key.ctrl = true;
      }
      if (input.startsWith("\x1B")) {
        input = input.slice(1);
        key.meta = true;
      }
      const isLatinUppercase = input >= "A" && input <= "Z";
      const isCyrillicUppercase = input >= "\u0410" && input <= "\u042F";
      if (input.length === 1 && (isLatinUppercase || isCyrillicUppercase)) {
        key.shift = true;
      }
      if (key.tab && input === "[Z") {
        key.shift = true;
      }
      if (key.tab || key.backspace || key.delete) {
        input = "";
      }
      if (!(input === "c" && key.ctrl) || !internal_exitOnCtrlC) {
        inputHandler(input, key);
      }
    };
    stdin == null ? void 0 : stdin.on("data", handleData);
    return () => {
      stdin == null ? void 0 : stdin.off("data", handleData);
    };
  }, [options.isActive, stdin, internal_exitOnCtrlC, inputHandler]);
};

const useApp = () => React.useContext(AppContext);

const useStdout = () => React.useContext(StdoutContext);

const useStderr = () => React.useContext(StderrContext);

const useFocus = ({
  isActive = true,
  autoFocus = false,
  id: customId
} = {}) => {
  const { isRawModeSupported, setRawMode } = useStdin();
  const { activeId, add, remove, activate, deactivate, focus } = React.useContext(FocusContext);
  const id = React.useMemo(() => {
    return customId != null ? customId : Math.random().toString().slice(2, 7);
  }, [customId]);
  React.useEffect(() => {
    add(id, { autoFocus });
    return () => {
      remove(id);
    };
  }, [id, autoFocus]);
  React.useEffect(() => {
    if (isActive) {
      activate(id);
    } else {
      deactivate(id);
    }
  }, [isActive, id]);
  React.useEffect(() => {
    if (!isRawModeSupported || !isActive) {
      return;
    }
    setRawMode(true);
    return () => {
      setRawMode(false);
    };
  }, [isActive]);
  return {
    isFocused: Boolean(id) && activeId === id,
    focus
  };
};

const useFocusManager = () => {
  const focusContext = React.useContext(FocusContext);
  return {
    enableFocus: focusContext.enableFocus,
    disableFocus: focusContext.disableFocus,
    focusNext: focusContext.focusNext,
    focusPrevious: focusContext.focusPrevious,
    focus: focusContext.focus
  };
};

var measureElement = (node) => {
  var _a, _b, _c, _d;
  return {
    width: (_b = (_a = node.yogaNode) == null ? void 0 : _a.getComputedWidth()) != null ? _b : 0,
    height: (_d = (_c = node.yogaNode) == null ? void 0 : _c.getComputedHeight()) != null ? _d : 0
  };
};

exports.Box = Box;
exports.Newline = Newline;
exports.Spacer = Spacer;
exports.Static = Static;
exports.Text = Text;
exports.Transform = Transform;
exports.measureElement = measureElement;
exports.render = render;
exports.useApp = useApp;
exports.useFocus = useFocus;
exports.useFocusManager = useFocusManager;
exports.useInput = useInput;
exports.useStderr = useStderr;
exports.useStdin = useStdin;
exports.useStdout = useStdout;
