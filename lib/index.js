/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MMTP"] = factory();
	else
		root["MMTP"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/esm-browser/v4.js\");\nvar __extends = (undefined && undefined.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\n\n\nvar TIME_ON_PANGE_STORE_NAME = \"time_on_page_store_name\";\n_utils__WEBPACK_IMPORTED_MODULE_0__.Store.storeName = TIME_ON_PANGE_STORE_NAME;\nvar MmTpTracer = /** @class */ (function (_super) {\n    __extends(MmTpTracer, _super);\n    function MmTpTracer() {\n        var _this = _super.call(this) || this;\n        _this.startTime = 0;\n        _this.endTime = 0;\n        _this.duration = 0;\n        _this.unActionStartTime = 0;\n        _this.unActiveDuration = 0;\n        return _this;\n    }\n    MmTpTracer.prototype.init = function () {\n        // page entry event\n        this.initPageShow();\n        // page exit event\n        // this.initPageExitEvent();\n        // page active change event\n        this.initActiveChangeEvent();\n        this.initSPAPage();\n        this.initMPAPage();\n        this.on(\"sendSuccess\", function () {\n            _utils__WEBPACK_IMPORTED_MODULE_0__.Store.clearAll();\n        });\n    };\n    MmTpTracer.prototype.initSPAPage = function () {\n        // this.initHashEvent();\n        this.initHistoryEvent();\n    };\n    MmTpTracer.prototype.initMPAPage = function () {\n        var _this = this;\n        window.addEventListener(\"beforeunload\", function () {\n            _this.setPageChangeState();\n        });\n    };\n    MmTpTracer.prototype.initHistoryEvent = function () {\n        var _this = this;\n        window.history.pushState = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.rewriteHistroy)(\"pushState\");\n        window.history.replaceState = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.rewriteHistroy)(\"replaceState\");\n        window.addEventListener(\"popstate\", function () {\n            _this.setPageChangeState();\n        });\n        window.addEventListener(\"pushstate\", function () {\n            _this.setPageChangeState();\n        });\n        window.addEventListener(\"replacestate\", function () {\n            _this.setPageChangeState();\n        });\n    };\n    MmTpTracer.prototype.setPageChangeState = function (type) {\n        // pre page end time record\n        this.endTime = new Date().getTime();\n        this.duration = this.endTime - this.startTime;\n        // const record = Store.getStore(this.uniqueName);\n        _utils__WEBPACK_IMPORTED_MODULE_0__.Store.update(this.uniqueName, {\n            endTime: this.endTime,\n            duration: this.duration - this.unActiveDuration,\n        });\n        // notice pre page haven end\n        var pageRecord = _utils__WEBPACK_IMPORTED_MODULE_0__.Store.getStore(this.uniqueName);\n        if (pageRecord && this.duration > 0) {\n            this.emit(\"pageLeave\", pageRecord);\n            this.clean();\n        }\n        if (type != \"beforeunload\" && type != \"pagehide\") {\n            // current page set start time record\n            this.startTime = new Date().getTime();\n            _utils__WEBPACK_IMPORTED_MODULE_0__.Store.update(this.uniqueName, {\n                startTime: this.startTime,\n                location: window.location,\n            });\n        }\n    };\n    // hash router can use popstate event\n    // private initHashEvent() {\n    //   window.addEventListener(\"hashchange\", () => {\n    //     console.log(\"initHashEvent\");\n    //     this.setPageChangeState();\n    //   });\n    // }\n    // page show event\n    MmTpTracer.prototype.initPageShow = function () {\n        var _this = this;\n        // page entry record\n        window.addEventListener(\"pageshow\", function () {\n            _this.startTime = new Date().getTime();\n            _this.setCurrentUniqueName();\n            _utils__WEBPACK_IMPORTED_MODULE_0__.Store.update(_this.uniqueName, {\n                startTime: _this.startTime,\n                location: window.location,\n            });\n        });\n    };\n    // page exit event\n    // private initPageExitEvent() {\n    //   window.addEventListener(\"pagehide\", () => {\n    //     this.setPageChangeState(\"pagehide\");\n    //   });\n    // }\n    // page active change event\n    MmTpTracer.prototype.initActiveChangeEvent = function () {\n        var _this = this;\n        window.addEventListener(\"visibilitychange\", function (event) {\n            if (document.hidden) {\n                _this.unActionStartTime = new Date().getTime();\n                _utils__WEBPACK_IMPORTED_MODULE_0__.Store.update(_this.uniqueName, {\n                    unActionStartTime: _this.unActionStartTime,\n                });\n            }\n            else {\n                var unActionEndTime = new Date().getTime();\n                _this.unActiveDuration = unActionEndTime - _this.unActionStartTime;\n                // 为啥不用this.uniqueName 无法获取当前上下文...\n                _utils__WEBPACK_IMPORTED_MODULE_0__.Store.update(_this.uniqueName, {\n                    unActionEndTime: unActionEndTime,\n                    unActiveDuration: _this.unActiveDuration,\n                });\n            }\n        });\n    };\n    // clear all\n    MmTpTracer.prototype.clean = function () {\n        this.unActionStartTime = 0;\n        this.unActiveDuration = 0;\n        this.duration = 0;\n        this.startTime = 0;\n        this.endTime = 0;\n        _utils__WEBPACK_IMPORTED_MODULE_0__.Store.clearAll();\n    };\n    MmTpTracer.prototype.setCurrentUniqueName = function () {\n        this.uniqueName = (0,uuid__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    };\n    MmTpTracer.prototype.getCurrendTime = function () {\n        return new Date().getTime();\n    };\n    MmTpTracer.prototype.getDuration = function () {\n        return this.endTime - this.startTime;\n    };\n    return MmTpTracer;\n}(_utils__WEBPACK_IMPORTED_MODULE_0__.EventEmitter));\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MmTpTracer);\n\n\n//# sourceURL=webpack://MMTP/./src/index.ts?");

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"EventEmitter\": () => (/* binding */ EventEmitter),\n/* harmony export */   \"Store\": () => (/* binding */ Store),\n/* harmony export */   \"rewriteHistroy\": () => (/* binding */ rewriteHistroy)\n/* harmony export */ });\n/*\n * history monkey patch\n */\nvar rewriteHistroy = function (type) {\n    var routerApi = window.history[type];\n    return function () {\n        var result = routerApi.apply(this, arguments);\n        var e = new Event(type.toLowerCase());\n        e.arguments = arguments;\n        window.dispatchEvent(e);\n        return result;\n    };\n};\n// localstore manage\nvar Store = /** @class */ (function () {\n    function Store() {\n    }\n    Store.setStore = function (name, value) {\n        var newValue = {};\n        newValue[name] = value;\n        try {\n            window.localStorage.setItem(this.storeName, JSON.stringify(newValue));\n        }\n        catch (error) {\n            console.error(error);\n        }\n    };\n    Store.getStore = function (name) {\n        try {\n            return (JSON.parse(window.localStorage.getItem(this.storeName))[name] || {});\n        }\n        catch (error) {\n            return {};\n        }\n    };\n    Store.getALLStore = function () {\n        try {\n            return JSON.parse(window.localStorage.getItem(this.storeName)) || {};\n        }\n        catch (error) {\n            return {};\n        }\n    };\n    Store.clearAll = function () {\n        try {\n            return window.localStorage.removeItem(this.storeName);\n        }\n        catch (error) {\n            return {};\n        }\n    };\n    Store.update = function (name, value) {\n        try {\n            var storeData = Store.getALLStore();\n            storeData[name] = Object.assign(storeData[name] || {}, value);\n            // const upadeData: any = {};\n            // upadeData[name] = value;\n            window.localStorage.setItem(this.storeName, JSON.stringify(storeData));\n        }\n        catch (error) {\n            console.error(error);\n        }\n    };\n    return Store;\n}());\n\n/**\n *  event emitter class\n */\nvar EventEmitter = /** @class */ (function () {\n    function EventEmitter() {\n        this.eventList = {};\n    }\n    EventEmitter.prototype.on = function (eventName, handle) {\n        if (Array.isArray(this.eventList[eventName])) {\n            this.eventList[eventName].push(handle);\n        }\n        else {\n            this.eventList[eventName] = [handle];\n        }\n    };\n    EventEmitter.prototype.emit = function (eventName) {\n        var args = [];\n        for (var _i = 1; _i < arguments.length; _i++) {\n            args[_i - 1] = arguments[_i];\n        }\n        if (this.eventList[eventName]) {\n            this.eventList[eventName].forEach(function (cb) {\n                cb.apply(null, args);\n            });\n        }\n    };\n    EventEmitter.prototype.off = function (eventName, handle) {\n        var arr = this.eventList[eventName] || [];\n        var i = arr.indexOf(handle);\n        if (i >= 0) {\n            this.eventList[eventName].splice(i, 1);\n        }\n    };\n    return EventEmitter;\n}());\n\n\n\n//# sourceURL=webpack://MMTP/./src/utils.ts?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);\n\n//# sourceURL=webpack://MMTP/./node_modules/uuid/dist/esm-browser/regex.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ rng)\n/* harmony export */ });\n// Unique ID creation requires a high quality random # generator. In the browser we therefore\n// require the crypto API and do not support built-in fallback to lower quality random number\n// generators (like Math.random()).\nvar getRandomValues;\nvar rnds8 = new Uint8Array(16);\nfunction rng() {\n  // lazy load so that environments that need to polyfill have a chance to do so\n  if (!getRandomValues) {\n    // getRandomValues needs to be invoked in a context where \"this\" is a Crypto implementation. Also,\n    // find the complete implementation of crypto (msCrypto) on IE11.\n    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);\n\n    if (!getRandomValues) {\n      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');\n    }\n  }\n\n  return getRandomValues(rnds8);\n}\n\n//# sourceURL=webpack://MMTP/./node_modules/uuid/dist/esm-browser/rng.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/esm-browser/validate.js\");\n\n/**\n * Convert array of 16 byte values to UUID string format of the form:\n * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\n */\n\nvar byteToHex = [];\n\nfor (var i = 0; i < 256; ++i) {\n  byteToHex.push((i + 0x100).toString(16).substr(1));\n}\n\nfunction stringify(arr) {\n  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n  // Note: Be careful editing this code!  It's been tuned for performance\n  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434\n  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one\n  // of the following:\n  // - One or more input array values don't map to a hex octet (leading to\n  // \"undefined\" in the uuid)\n  // - Invalid input values for the RFC `version` or `variant` fields\n\n  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(uuid)) {\n    throw TypeError('Stringified UUID is invalid');\n  }\n\n  return uuid;\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);\n\n//# sourceURL=webpack://MMTP/./node_modules/uuid/dist/esm-browser/stringify.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ \"./node_modules/uuid/dist/esm-browser/rng.js\");\n/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/esm-browser/stringify.js\");\n\n\n\nfunction v4(options, buf, offset) {\n  options = options || {};\n  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n\n  rnds[6] = rnds[6] & 0x0f | 0x40;\n  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided\n\n  if (buf) {\n    offset = offset || 0;\n\n    for (var i = 0; i < 16; ++i) {\n      buf[offset + i] = rnds[i];\n    }\n\n    return buf;\n  }\n\n  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(rnds);\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);\n\n//# sourceURL=webpack://MMTP/./node_modules/uuid/dist/esm-browser/v4.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ \"./node_modules/uuid/dist/esm-browser/regex.js\");\n\n\nfunction validate(uuid) {\n  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].test(uuid);\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);\n\n//# sourceURL=webpack://MMTP/./node_modules/uuid/dist/esm-browser/validate.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});