/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_less__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scripts_models_pieces__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scripts_libs_closest__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scripts_libs_playSound__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scripts_libs_config__ = __webpack_require__(27);






let count = 1;
let currentPiece = {};
let targetPosition = [];
let { width, height, chessBoardLeft, chessBoardTop, chessBoardGirdSize, pieceSize } = __WEBPACK_IMPORTED_MODULE_4__scripts_libs_config__["a" /* default */];
const container = document.querySelector('#container');
container.style.width = width + 'px';
container.style.height = height + 'px';
container.style.margin = '0 auto 20px auto';

const tag = container.querySelector('.tag');
const indicators = [],
      clearIndicators = [];
const stepPieces = [],
      currentSteps = [],
      eatPieces = new Map(); //存走过的棋字 走过之前的位置 吃掉的棋子
let chessMap = new Map(); //存棋盘棋子的位置
let conf,
    base,
    redKing,
    blackKing,
    onOff = true;
let currentSelectPiece = null;
let id = 0;

//检查是否将军
const isGeneral = (piece, map) => {
  let redPieces = [],
      blackPieces = [];

  for (let item of map) {
    if (item[1].base === 'red') {
      if (item[1].type === 'king') redKing = item[1];
      redPieces.push(item[1]);
    } else {
      if (item[1].type === 'king') blackKing = item[1];
      blackPieces.push(item[1]);
    }
  }

  let isBasePieces = piece.base === 'red' ? redPieces : blackPieces;

  for (let { x, y, type, base } of isBasePieces) {
    let pieceType = __WEBPACK_IMPORTED_MODULE_1__scripts_models_pieces__["a" /* default */].filter(item => item.type === type)[0];
    let indicators = pieceType.rule({ x, y, type, base }, chessMap);

    for (let { x, y } of indicators) if (blackKing.x === x && blackKing.y === y || redKing.x === x && redKing.y === y) return true;
  }

  return false;
};

//检查己方棋子走的步不能让己方主将被将
const harmfulStep = (x, y, piece, map) => {

  let redPieces = [],
      blackPieces = [];
  let cloneMap = new Map(map);
  let clonePiece = {},
      cloneRedKing,
      cloneBlackKing;
  Object.assign(clonePiece, piece);

  cloneMap.delete(`${clonePiece.y},${clonePiece.x}`);
  clonePiece.x = Number(x);
  clonePiece.y = Number(y);
  cloneMap.set(`${y},${x}`, clonePiece);

  for (let item of cloneMap) {
    if (item[1].base === 'red') {
      if (item[1].type === 'king') cloneRedKing = item[1];
      redPieces.push(item[1]);
    } else {
      if (item[1].type === 'king') cloneBlackKing = item[1];
      blackPieces.push(item[1]);
    }
  }

  let isBasePieces = piece.base === 'red' ? blackPieces : redPieces;
  //模拟可以走的棋子
  for (let { x, y, type, base } of isBasePieces) {
    let pieceType = __WEBPACK_IMPORTED_MODULE_1__scripts_models_pieces__["a" /* default */].filter(item => item.type === type)[0];
    let indicators = pieceType.rule({ x, y, type, base }, cloneMap);

    for (let { x, y } of indicators) if (cloneRedKing.x === x && cloneRedKing.y === y || cloneBlackKing.x === x && cloneBlackKing.y === y) return false;
  }

  return true;
};

//获得棋子位置
const piecePositionByXY = (x, y) => ({
  x: `${chessBoardLeft + x * chessBoardGirdSize[0] - pieceSize / 2}`,
  y: `${chessBoardTop + y * chessBoardGirdSize[1] - pieceSize / 2}`
});

//更新棋子位置
const updatePiecePosition = ({ el, x, y, type, base, labelRed, labelBlack }, position) => {
  el.style.left = position.x + 'px';
  el.style.top = position.y + 'px';
  el.dataset.x = x;
  el.dataset.y = y;
  el.dataset.type = type;
  el.dataset.label = base === 'red' ? labelRed : labelBlack;
  el.style.width = pieceSize + 'px';
  el.style.height = pieceSize + 'px';
};

//初始化所有棋子
for (let { type, rule, defaultPosition, labelRed, labelBlack } of __WEBPACK_IMPORTED_MODULE_1__scripts_models_pieces__["a" /* default */]) {
  for (let { x, y, base } of defaultPosition) {
    let pieceEl;
    pieceEl = document.createElement('div');
    pieceEl.className = `piece ${base} ${type}`;

    let position = piecePositionByXY(x, y);

    container.appendChild(pieceEl);
    chessMap.set(`${y},${x}`, conf = { x, y, base, type, labelRed, labelBlack, el: pieceEl });
    updatePiecePosition(conf, position);
  }
}

// 新增步数信息
const createRecord = text => {
  let p = document.createElement('p');
  let record = document.querySelector('.record');
  if (!text) {
    p.innerHTML = '红方先走';
  } else {
    p.innerHTML = `${count}. ${/\d/.test(text) ? '黑方' : '红方'}  ${text}`;
    count++;
  }
  record.appendChild(p);
  if (record.offsetHeight < p.offsetHeight * count) {
    record.scrollTop = record.scrollHeight - record.offsetHeight;
  }
};

//红方位置映射表
const redPostitonText = num => {
  switch (num) {
    case 0:
      return '九';
    case 1:
      return '八';
    case 2:
      return '七';
    case 3:
      return '六';
    case 4:
      return '五';
    case 5:
      return '四';
    case 6:
      return '三';
    case 7:
      return '二';
    case 8:
      return '一';
  }
};

//红方位置映射表
const redText = num => {
  switch (num) {
    case 9:
      return '九';
    case 8:
      return '八';
    case 7:
      return '七';
    case 6:
      return '六';
    case 5:
      return '五';
    case 4:
      return '四';
    case 3:
      return '三';
    case 2:
      return '二';
    case 1:
      return '一';
  }
};

//棋子位置映射表
createRecord();
let recordChessStep = ({ position, base, label, type }, targetPosition) => {
  if (base === 'red') {
    let moves = position[1] === targetPosition[1] ? '平' : position[1] > targetPosition[1] ? '进' : '退';
    createRecord(` 
      ${label} 
      ${redPostitonText(position[0])} 
      ${moves} 
      ${moves === '平' ? redPostitonText(targetPosition[0]) : type === 'horse' || type === 'guard' || type === 'eleph' ? redPostitonText(targetPosition[0]) : redText(Math.abs(position[1] - targetPosition[1]))}
    `);
  } else {
    let moves = position[1] === targetPosition[1] ? '平' : position[1] > targetPosition[1] ? '退' : '进';
    createRecord(`
      ${label} 
      ${position[0] + 1} 
      ${moves}
      ${moves === '平' ? targetPosition[0] + 1 : type === 'horse' || type === 'guard' || type === 'eleph' ? targetPosition[0] + 1 : Math.abs(position[1] - targetPosition[1])}
    `);
  }
};

//棋子能走的指示位置
const drawindicator = (x, y) => {
  let indicatorsEl;
  if (clearIndicators.length) {
    indicatorsEl = clearIndicators.shift();
    indicatorsEl.classList.remove('hidden');
  } else {
    indicatorsEl = document.createElement('div');
    indicatorsEl.className = 'indicator';
    indicatorsEl.style.width = width + 'px';
    indicatorsEl.style.height = height + 'px';
    container.appendChild(indicatorsEl);
  }

  let position = piecePositionByXY(x, y);
  updatePiecePosition({ el: indicatorsEl, x, y }, position);
  indicators.push(indicatorsEl);
};

//清除指示位置
const clearInstructions = () => {
  for (let indicator of indicators) indicator.classList.add('hidden');

  clearIndicators.push.apply(clearIndicators, indicators);
  indicators.length = 0;
};

//检查是否无法解将或无步可走
const examineGameOver = (piece, map) => {
  let redPieces = [],
      blackPieces = [];

  for (let item of map) {
    if (item[1].base === 'red') redPieces.push(item[1]);else blackPieces.push(item[1]);
  }

  let isBasePieces = piece.base === 'red' ? blackPieces : redPieces;

  for (let isBasePiece of isBasePieces) {
    let pieceType = __WEBPACK_IMPORTED_MODULE_1__scripts_models_pieces__["a" /* default */].filter(item => item.type === isBasePiece.type)[0];
    let indicators = pieceType.rule(isBasePiece, chessMap);

    for (let { x, y } of indicators) if (harmfulStep(x, y, isBasePiece, chessMap)) return false;
  }
  return true;
};

container.addEventListener('click', event => {
  let pieceEl, indicatorEl, regretEl;

  clearInstructions();
  //点击棋子
  if (pieceEl = Object(__WEBPACK_IMPORTED_MODULE_2__scripts_libs_closest__["a" /* default */])(event.target, '.piece')) {
    base = onOff ? 'red' : 'black';

    let { x, y, label, type } = pieceEl.dataset;

    currentPiece = {
      position: [Number(x), Number(y)],
      base,
      label,
      type
    };

    currentSelectPiece = chessMap.get(`${y},${x}`);

    if (currentSelectPiece.base !== base) return;
    let piece = __WEBPACK_IMPORTED_MODULE_1__scripts_models_pieces__["a" /* default */].filter(item => item.type === currentSelectPiece.type)[0];
    let indicators = piece.rule(currentSelectPiece, chessMap);

    for (let { x, y } of indicators) if (harmfulStep(x, y, currentSelectPiece, chessMap)) drawindicator(x, y);
  }
  //点击指示位置
  if (indicatorEl = Object(__WEBPACK_IMPORTED_MODULE_2__scripts_libs_closest__["a" /* default */])(event.target, '.indicator')) {
    let { x, y } = indicatorEl.dataset;
    let isInPieceUp;
    targetPosition = [Number(x), Number(y)];
    onOff = !onOff;
    setTimeout(() => tag.classList.toggle('red'), 400);

    if (isInPieceUp = chessMap.get(`${y},${x}`)) {
      isInPieceUp.el.style.display = 'none';
      eatPieces.set(`${isInPieceUp.y},${id},${isInPieceUp.x}`, isInPieceUp);
      id++;
    }

    stepPieces.push({
      el: currentSelectPiece.el,
      x: currentSelectPiece.x,
      y: currentSelectPiece.y,
      type: currentSelectPiece.type,
      base: currentSelectPiece.base
    });
    currentSteps.push({ x, y });
    chessMap.delete(`${currentSelectPiece.y},${currentSelectPiece.x}`);
    currentSelectPiece.x = Number(x);
    currentSelectPiece.y = Number(y);
    chessMap.set(`${y},${x}`, currentSelectPiece);
    updatePiecePosition(currentSelectPiece, piecePositionByXY(x, y));
    recordChessStep(currentPiece, targetPosition);

    if (examineGameOver(currentSelectPiece, chessMap)) setTimeout(() => alert((currentSelectPiece.base === 'red' ? '红' : '黑') + '方赢了'), 700);
  }
  //悔棋
  if (regretEl = Object(__WEBPACK_IMPORTED_MODULE_2__scripts_libs_closest__["a" /* default */])(event.target, '.regret')) {

    if (stepPieces.length) {
      const step = stepPieces.pop(),
            currentStep = currentSteps.pop();
      let isRestorePiece;

      onOff = !onOff;
      setTimeout(() => tag.classList.toggle('red'), 400);

      if (isRestorePiece = eatPieces.get(`${currentStep.y},${id - 1},${currentStep.x}`)) {
        isRestorePiece.el.style.display = 'block';
        eatPieces.delete(`${currentStep.y},${id - 1},${currentStep.x}`);
        chessMap.set(`${currentStep.y},${currentStep.x}`, isRestorePiece);
        id--;
      } else chessMap.delete(`${currentStep.y},${currentStep.x}`);

      chessMap.set(`${step.y},${step.x}`, step);
      updatePiecePosition(step, piecePositionByXY(step.x, step.y));
    }
  }
}, false);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(22)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/less-loader/dist/cjs.js!./index.less", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/less-loader/dist/cjs.js!./index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(3);
exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "body {\n  background-color: #dddddd;\n  overflow: hidden;\n}\nhtml,\nbody {\n  margin: 0;\n  padding: 0;\n}\n#app {\n  width: 100%;\n  height: 100%;\n  margin-top: 20px;\n}\n#app #container {\n  background-image: url(" + escape(__webpack_require__(5)) + ");\n  background-size: 100%;\n  position: relative;\n}\n#app #container > .tag {\n  position: absolute;\n  width: 36px;\n  height: 36px;\n  right: -18px;\n  top: 454px;\n  background-image: url(" + escape(__webpack_require__(6)) + ");\n  background-size: cover;\n  transition: all .3s ease;\n}\n#app #container > .tag.red {\n  top: 100px;\n}\n#app #container > .piece {\n  position: absolute;\n  border-radius: 50%;\n  transition: all .3s ease;\n  cursor: pointer;\n}\n#app #container > .piece.black,\n#app #container > .piece.red {\n  background-size: cover;\n}\n#app #container > .piece.black.king {\n  background-image: url(" + escape(__webpack_require__(7)) + ");\n}\n#app #container > .piece.red.king {\n  background-image: url(" + escape(__webpack_require__(8)) + ");\n}\n#app #container > .piece.black.rook {\n  background-image: url(" + escape(__webpack_require__(9)) + ");\n}\n#app #container > .piece.red.rook {\n  background-image: url(" + escape(__webpack_require__(10)) + ");\n}\n#app #container > .piece.black.horse {\n  background-image: url(" + escape(__webpack_require__(11)) + ");\n}\n#app #container > .piece.red.horse {\n  background-image: url(" + escape(__webpack_require__(12)) + ");\n}\n#app #container > .piece.black.guard {\n  background-image: url(" + escape(__webpack_require__(13)) + ");\n}\n#app #container > .piece.red.guard {\n  background-image: url(" + escape(__webpack_require__(14)) + ");\n}\n#app #container > .piece.black.eleph {\n  background-image: url(" + escape(__webpack_require__(15)) + ");\n}\n#app #container > .piece.red.eleph {\n  background-image: url(" + escape(__webpack_require__(16)) + ");\n}\n#app #container > .piece.black.pawn {\n  background-image: url(" + escape(__webpack_require__(17)) + ");\n}\n#app #container > .piece.red.pawn {\n  background-image: url(" + escape(__webpack_require__(18)) + ");\n}\n#app #container > .piece.black.cannon {\n  background-image: url(" + escape(__webpack_require__(19)) + ");\n}\n#app #container > .piece.red.cannon {\n  background-image: url(" + escape(__webpack_require__(20)) + ");\n}\n#app #container > .indicator {\n  background-image: url(" + escape(__webpack_require__(21)) + ");\n  opacity: .9;\n  background-size: cover;\n  position: absolute;\n  border-radius: 50%;\n}\n#app #container > .indicator.hidden {\n  display: none;\n}\n#app #container .indicator:hover {\n  box-shadow: 0 0 3px 3px #343BE1;\n}\n#app #container .piece.red:hover {\n  box-shadow: 0 0 3px 3px #ff0000;\n}\n#app #container .piece.black:hover {\n  box-shadow: 0 0 3px 3px #000;\n}\n#app .regret {\n  position: absolute;\n  top: 0;\n  left: 0;\n  display: inline-block;\n  background-color: #fff;\n  outline: none;\n}\n#app .regret:hover {\n  background-color: red;\n  color: #fff;\n}\n#app .record {\n  position: absolute;\n  left: 560px;\n  top: 0px;\n  height: 400px;\n  width: 200px;\n}\n#app .record > p {\n  margin: 0;\n  line-height: 1.6rem;\n}\n#app .record.mobile {\n  position: relative;\n  width: 100%;\n  padding: 5px 10px;\n  left: 0;\n  overflow-y: scroll;\n  --webkit--overflow-scrolling: touch;\n}\n", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/chessboard.c1d233c.png";

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/tag.c6f710f.png";

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/king1.02c8675.png";

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/king.e530541.png";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/rook1.e32cd80.png";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/rook.a2c3616.png";

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/horse1.e6dad7d.png";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/horse.e450c07.png";

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/guard1.8d8f321.png";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/guard.55f04ba.png";

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/eleph1.82ede49.png";

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/eleph.8d8f645.png";

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/pawn1.2938ea2.png";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/pawn.37e114d.png";

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/cannon1.2b6c283.png";

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/cannon.30f8e0b.png";

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/indicator.6ac7333.png";

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(23);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 23 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const isInChessboard = (x, y) => x >= 0 && x < 9 && y >= 0 && y < 10; //是否在棋盘内
const isInSudoku = (x, y) => x > 2 && x < 6 && (y >= 0 && y < 3 || y <= 9 && y > 6); //是否在九宫格内

//上下左右四个方向
const allDir = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];

/* harmony default export */ __webpack_exports__["a"] = ([
// {
//   type: 'god',
//   rule( piece, map ){
//     const result = [];
//     for( let y = 0; y < 10; y++ )
//       for( let x = 0; x < 9; x++ )
//         if( !map.has( `${y},${x}` ) )
//           result.push( { x, y } );

//     return result;
//   },

//   defaultPosition: ( ()=>{
//     const result = [];

//     for( let x = 0; x < 9; x++ ){
//       result.push( { x, y: 0, base: 'black' } );
//       result.push( { x, y: 9, base: 'red' } );
//     }

//     return result;
//   })()
// },
{
  type: 'rook',
  labelRed: '車',
  labelBlack: '車',
  rule(piece, map) {
    const result = [],
          allDirsEnable = [1, 1, 1, 1];
    let obstaclePiece,
        step = 1;

    while (true) {
      if (allDirsEnable.every(number => number === 0)) break;

      for (let i = 0; i < allDir.length; i++) {
        let dir = allDir[i];
        let x = piece.x + dir.x * step,
            y = piece.y + dir.y * step;

        if (!isInChessboard(x, y)) {
          allDirsEnable[i] = 0;
          continue;
        }

        if (obstaclePiece = map.get(`${y},${x}`)) {
          if (obstaclePiece.base !== piece.base && allDirsEnable[i]) {
            result.push({ x, y });
            allDirsEnable[i] = 0;
            continue;
          } else {
            allDirsEnable[i] = 0;
            continue;
          }
        } else if (allDirsEnable[i]) {
          result.push({ x, y });
        }
      }
      step++;
    }
    return result;
  },

  defaultPosition: [{ x: 0, y: 0, base: 'black' }, { x: 8, y: 0, base: 'black' }, { x: 0, y: 9, base: 'red' }, { x: 8, y: 9, base: 'red' }]
}, {
  type: 'horse',
  labelRed: '馬',
  labelBlack: '馬',
  rule(piece, map) {
    const result = [];

    for (let i = 0; i < allDir.length; i++) {
      let dir = allDir[i];
      let obstaclePiece;
      let x = piece.x + dir.x,
          y = piece.y + dir.y;

      if (!map.has(`${y},${x}`)) {
        for (let item of this.steps[i]) {
          let x = piece.x + item.x,
              y = piece.y + item.y;

          if (!isInChessboard(x, y)) continue;

          if (!(obstaclePiece = map.get(`${y},${x}`)) || piece.base !== obstaclePiece.base) result.push({ x, y });
        }
      }
    }
    return result;
  },

  defaultPosition: [{ x: 1, y: 0, base: 'black' }, { x: 7, y: 0, base: 'black' }, { x: 1, y: 9, base: 'red' }, { x: 7, y: 9, base: 'red' }],

  steps: [[{ x: -1, y: -2 }, { x: 1, y: -2 }], [{ x: 2, y: -1 }, { x: 2, y: 1 }], [{ x: 1, y: 2 }, { x: -1, y: 2 }], [{ x: -2, y: 1 }, { x: -2, y: -1 }]]
}, {
  type: 'king',
  labelRed: '帥',
  labelBlack: '將',
  rule(piece, map) {
    const result = [];
    let obstaclePiece, is;
    let redKing, blackKing;
    let amongPiece = [];

    for (let dir of allDir) {
      let x = piece.x + dir.x,
          y = piece.y + dir.y;

      if (!isInSudoku(x, y)) continue;

      if (!(obstaclePiece = map.get(`${y},${x}`)) || obstaclePiece.base !== piece.base) result.push({ x, y });
    }

    for (let [key, piece] of map) {
      if (piece.type === 'king' && piece.base === 'red') redKing = piece;

      if (piece.type === 'king' && piece.base === 'black') blackKing = piece;
    }

    if (redKing.x === blackKing.x) {
      for (let i = blackKing.y + 1; i < redKing.y; i++) amongPiece.push(map.has(`${i},${redKing.x}`));

      if (amongPiece.every(item => item === false)) result.push({ x: blackKing.x, y: blackKing.y }, { x: redKing.x, y: redKing.y });
    }

    return result;
  },

  defaultPosition: [{ x: 4, y: 0, base: 'black' }, { x: 4, y: 9, base: 'red' }]
}, {
  type: 'guard',
  labelRed: '仕',
  labelBlack: '士',
  rule(piece, map) {
    const result = [];
    let obstaclePiece;

    for (let dir of this.steps) {
      let x = piece.x + dir.x,
          y = piece.y + dir.y;

      if (!isInSudoku(x, y)) continue;

      if (!(obstaclePiece = map.get(`${y},${x}`)) || obstaclePiece.base !== piece.base) result.push({ x, y });
    }

    return result;
  },

  defaultPosition: [{ x: 3, y: 0, base: 'black' }, { x: 5, y: 0, base: 'black' }, { x: 3, y: 9, base: 'red' }, { x: 5, y: 9, base: 'red' }],

  steps: [{ x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: -1, y: -1 }]
}, {
  type: 'eleph',
  labelRed: '相',
  labelBlack: '象',
  rule(piece, map) {
    const result = [];
    let obstaclePiece, obstacPiece;

    for (let i = 0; i < this.steps.length; i++) {
      let dir = this.steps[i],
          obstacPosition = this.obstac[i];
      let x = piece.x + dir.x,
          y = piece.y + dir.y;
      let obstacX = piece.x + obstacPosition.x,
          obstacY = piece.y + obstacPosition.y;

      if (!isInChessboard(x, y) || this.isInDomain(y) || (obstacPiece = map.get(`${obstacY},${obstacX}`))) continue;

      if (!(obstaclePiece = map.get(`${y},${x}`)) || obstaclePiece.base !== piece.base) result.push({ x, y });
    }

    return result;
  },

  defaultPosition: [{ x: 2, y: 0, base: 'black' }, { x: 6, y: 0, base: 'black' }, { x: 2, y: 9, base: 'red' }, { x: 6, y: 9, base: 'red' }],

  isInDomain(y) {
    return y === 3 || y === 6;
  },

  obstac: [{ x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: -1, y: -1 }],

  steps: [{ x: 2, y: -2 }, { x: 2, y: 2 }, { x: -2, y: 2 }, { x: -2, y: -2 }]
}, {
  type: 'pawn',
  labelRed: '兵',
  labelBlack: '卒',
  rule(piece, map) {
    const result = [];
    const isCrossed = piece.base === 'red' ? piece.y < 5 : piece.y > 4;

    for (let dir of allDir) {
      let x = piece.x + dir.x,
          y = piece.y + dir.y,
          obstaclePiece;

      if (dir.y === 1 && piece.base === 'red' || dir.y === -1 && piece.base === 'black') continue;

      if (!isInChessboard(x, y) || !isCrossed && dir.x !== 0) continue;

      if (!(obstaclePiece = map.get(`${y},${x}`)) || obstaclePiece.base !== piece.base) result.push({ x, y });
    }

    return result;
  },

  defaultPosition: (() => {
    const result = [];

    for (let i = 0; i < 10; i += 2) {
      result.push({ x: i, y: 3, base: 'black' });
      result.push({ x: i, y: 6, base: 'red' });
    }

    return result;
  })()
}, {
  type: 'cannon',
  labelRed: '炮',
  labelBlack: '砲',
  rule(piece, map) {
    const result = [],
          allDirsEnable = [1, 1, 1, 1],
          obstacles = [0, 0, 0, 0];
    let step = 1,
        obstaclePiece;

    while (true) {

      if (allDirsEnable.every(number => number === 0)) break;

      for (let i = 0; i < allDir.length; i++) {
        let dir = allDir[i];
        let x = piece.x + dir.x * step,
            y = piece.y + dir.y * step;

        if (!isInChessboard(x, y)) {
          allDirsEnable[i] = 0;
          continue;
        }

        if (obstaclePiece = map.get(`${y},${x}`)) {
          obstacles[i]++;

          if (obstacles[i] === 2 && obstaclePiece.base !== piece.base) result.push({ x, y });
        } else if (!obstacles[i]) result.push({ x, y });
      }
      step++;
    }
    return result;
  },

  defaultPosition: [{ x: 1, y: 2, base: 'black' }, { x: 7, y: 2, base: 'black' }, { x: 1, y: 7, base: 'red' }, { x: 7, y: 7, base: 'red' }]
}]);

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * closest.js
 * @author dron
 * @createAt 2016-07-28
 *
 * usage:
 *
 * clostst( el, '.placeholder' ); // clostst by className
 * clostst( el, 'li' ); // clostst by tagName
 * 
 * clostst( el, function( el ){ // clostst by custom condition
 *   return el.tagName.toLowerCase() === 'li';
 * } );
 */

const closest = function (from, condition) {
  let el = from,
      classRegx = /^\./;

  if (typeof condition === 'string') {
    condition = (unknow => classRegx.test(unknow) ? el => el.classList.contains(unknow.replace(classRegx, '')) : el => el.tagName.toLowerCase() === unknow.toLowerCase())(condition);
  }

  while (!condition(el)) {
    el = el.parentElement;

    if (!el) return null;
  }

  return el;
};

/* harmony default export */ __webpack_exports__["a"] = (closest);

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * @author locozan
 * @createAt 2016-12-20
 * 音频播放
 *
 * playSound('音频路径',播放多久清除)
 */

const playSound = (src, time) => {
  let audio = document.createElement('audio');
  audio.className = 'snd';
  audio.setAttribute('src', `${src}`);
  audio.autoplay = true;
  audio.load();
  document.body.appendChild(audio);

  setTimeout(() => {
    let snd = document.querySelector('.snd');
    snd.parentNode.removeChild(snd);
  }, time);
};

/* unused harmony default export */ var _unused_webpack_default_export = (playSound);

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const isMobile = () => /mobile/gi.test(navigator.userAgent);
let record = document.querySelector('.record');
let app = document.querySelector('#app');
let width, height;
if (isMobile()) {
  app.classList.add('mobile');
  width = window.screen.width - 20;
  height = Math.round(width / .9);
} else {
  height = window.screen.height - 200;
  width = Math.round(height * .9);
}
record.style.height = window.screen.height - height - 50 + 'px';
let widthRatio = width / 2166;
let heightRatio = height / 2416;

let chessBoardGirdSize = [(2166 - 138 * 2) / 8 * widthRatio, (2416 - 141 * 2) / 9 * heightRatio];
let pieceSize = chessBoardGirdSize[0] - 4;
let chessBoardLeft = 138 * widthRatio;
let chessBoardTop = 141 * heightRatio;

const config = {
  width,
  height,
  chessBoardLeft,
  chessBoardTop,
  chessBoardGirdSize,
  pieceSize
};

/* harmony default export */ __webpack_exports__["a"] = (config);

/***/ })
/******/ ]);