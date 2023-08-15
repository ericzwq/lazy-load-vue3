function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) : typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.LazyLoad = {}, global.Vue));
})(this, function (exports, vue) {
  'use strict';

  var defaultKey = 'default';
  var elLazyKeySetMap = new Map();
  var lazyKeyVmSetMap = new Map();
  var lazyKeyElSetMap = new Map();
  var baseConfig = {
    error: '',
    loading: '',
    errorClassList: [],
    loadingClassList: [],
    loadedClassList: [],
    onError: undefined,
    onLoad: undefined
  };
  var config = Object.assign({
    timeout: 200,
    component: false,
    debounce: false,
    afterListen: undefined
  }, baseConfig);
  var directiveConfig = Object.assign({
    src: '',
    lazyKey: defaultKey
  }, baseConfig);

  var mainHandler = function mainHandler(handleType, set, sort, top, right, bottom, left) {
    var _document$documentEle = document.documentElement,
        clientWidth = _document$documentEle.clientWidth,
        clientHeight = _document$documentEle.clientHeight;
    var checkFn = top !== undefined ? function (el) {
      return inParentView(el, top, right, bottom, left);
    } : function (el) {
      return inViewPort(el, clientHeight, clientWidth);
    };
    return handleType === 0
    /* component */
    ? handleUpdate(set, checkFn, function (e) {
      return e.$el;
    }, updateComponentVm, sort) : handleUpdate(set, checkFn, function (e) {
      return e;
    }, updateDirectiveEl, sort);
  };

  var listener = throttle(mainHandler);
  window.addEventListener('scroll', listener);

  function inViewPort(el, clientHeight, clientWidth) {
    var _el$getBoundingClient = el.getBoundingClientRect(),
        left = _el$getBoundingClient.left,
        right = _el$getBoundingClient.right,
        top = _el$getBoundingClient.top,
        bottom = _el$getBoundingClient.bottom;

    if (top <= clientHeight && bottom > 0 && left <= clientWidth && right > 0) return 0
    /* in */
    ;
    if (top > clientHeight) return 2
    /* below */
    ;
    if (bottom < 0) return 3
    /* higher */
    ;
    if (top <= clientHeight && bottom > 0) return 4
    /* horizontalHide */
    ;
    if (left === 0 && top === 0) return 5
    /* noView */
    ;
    return 1
    /* notIn */
    ;
  }

  function inParentView(el, pTop, pRight, pBottom, pLeft) {
    var _el$getBoundingClient2 = el.getBoundingClientRect(),
        left = _el$getBoundingClient2.left,
        right = _el$getBoundingClient2.right,
        top = _el$getBoundingClient2.top,
        bottom = _el$getBoundingClient2.bottom;

    if (top <= pBottom && bottom >= pTop && left <= pRight && right >= pLeft) return 0
    /* in */
    ;
    if (top > pBottom) return 2
    /* below */
    ;
    if (bottom < pTop) return 3
    /* higher */
    ;
    if (top <= pBottom && bottom >= pTop) return 4
    /* horizontalHide */
    ;
    if (left === 0 && top === 0) return 5
    /* noView */
    ;
    return 1
    /* notIn */
    ;
  }

  function handleUpdate(targetSet, checkFn, getEl, updateFn, sort) {
    var targets = Array.from(targetSet);

    if (sort) {
      targets.sort(function (a, b) {
        var pos = getEl(a).compareDocumentPosition(getEl(b));

        if (!(pos & Node.DOCUMENT_POSITION_DISCONNECTED)) {
          return 1 - (pos & Node.DOCUMENT_POSITION_FOLLOWING);
        }

        return getEl(a).compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED ? -1 : 1;
      });
      targetSet.clear();

      var _iterator = _createForOfIteratorHelper(targets),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var target = _step.value;
          targetSet.add(target);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      var i = 0,
          mountedTarget;

      while ((mountedTarget = targets[i++]) && getEl(mountedTarget).compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED) {
        void 0;
      }

      if (!mountedTarget) {
        targetSet.clear();
        return new Set();
      }

      var unMountedTargets = targets.splice(0, i - 1);

      if (targets.length > 1 && !(getEl(mountedTarget).compareDocumentPosition(getEl(targets[1])) & Node.DOCUMENT_POSITION_FOLLOWING)) {
        // List rendering may be in reverse order.
        targets = targets.reverse();
        targetSet.clear();

        var _iterator2 = _createForOfIteratorHelper(targets),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _target = _step2.value;
            targetSet.add(_target);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      } else {
        var _iterator3 = _createForOfIteratorHelper(unMountedTargets),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _target2 = _step3.value;
            targetSet.delete(_target2);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }

    var inViewIndex = binarySearch(targets);
    if (inViewIndex === -1) return targetSet;
    updateFn(targets[inViewIndex], targetSet);

    for (var _i = inViewIndex - 1; _i > -1; _i--) {
      if (checkFn(getEl(targets[_i])) === 0
      /* in */
      ) {
        updateFn(targets[_i], targetSet);
      } else {
        break;
      }
    }

    for (var _i2 = inViewIndex + 1, l = targets.length; _i2 < l; _i2++) {
      if (checkFn(getEl(targets[_i2])) === 0
      /* in */
      ) {
        updateFn(targets[_i2], targetSet);
      } else {
        break;
      }
    }

    return targetSet;

    function binarySearch(list) {
      var l = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : list.length - 1;
      if (l > r) return -1;
      var index = Math.floor((l + r) / 2);
      var viewStatus = checkFn(getEl(list[index]));

      if (viewStatus === 0
      /* in */
      ) {
        return index;
      } else if (viewStatus === 2
      /* below */
      ) {
        return binarySearch(list, l, index - 1);
      } else if (viewStatus === 3
      /* higher */
      ) {
        return binarySearch(list, index + 1, r);
      } else if ([4
      /* horizontalHide */
      , 5
      /* noView */
      ].includes(viewStatus)) {
        return -1;
      } else {
        var leftSearchedIndex = binarySearch(list, l, index - 1);
        if (leftSearchedIndex > -1) return leftSearchedIndex;
        return binarySearch(list, index + 1, r);
      }
    }
  }

  function updateDirectiveEl(el, targetElSet) {
    var _el$lazy = el.lazy,
        src = _el$lazy.src,
        loadingClassList = _el$lazy.loadingClassList,
        errorClassList = _el$lazy.errorClassList,
        error = _el$lazy.error,
        loadedClassList = _el$lazy.loadedClassList,
        onError = _el$lazy.onError,
        onLoad = _el$lazy.onLoad;
    el.__isLoaded = true;
    el.setAttribute('src', src);
    el.addEventListener('error', function () {
      var _el$classList, _el$classList2, _el$classList3;

      (_el$classList = el.classList).remove.apply(_el$classList, _toConsumableArray(loadingClassList));

      (_el$classList2 = el.classList).remove.apply(_el$classList2, _toConsumableArray(loadedClassList));

      (_el$classList3 = el.classList).add.apply(_el$classList3, _toConsumableArray(errorClassList));

      if (error) el.setAttribute('src', error);
      onError === null || onError === void 0 ? void 0 : onError(el, el.lazy);
    }, {
      once: true
    });
    el.addEventListener('load', function () {
      var _el$classList4, _el$classList5, _el$classList6;

      (_el$classList4 = el.classList).remove.apply(_el$classList4, _toConsumableArray(loadingClassList));

      (_el$classList5 = el.classList).remove.apply(_el$classList5, _toConsumableArray(errorClassList));

      (_el$classList6 = el.classList).add.apply(_el$classList6, _toConsumableArray(loadedClassList));

      onLoad === null || onLoad === void 0 ? void 0 : onLoad(el, el.lazy);
    }, {
      once: true
    });
    targetElSet === null || targetElSet === void 0 ? void 0 : targetElSet.delete(el);
  }

  function updateComponentVm(vm, targetVmSet) {
    vm.isLoaded = true;
    targetVmSet === null || targetVmSet === void 0 ? void 0 : targetVmSet.delete(vm);
  }

  var lazyKeyComponentUpdateInfoMap = new Map();

  function addComponentRecord(vm, isMounted) {
    var _vm$$props$lazyKey;

    var lazyKey = (_vm$$props$lazyKey = vm.$props.lazyKey) !== null && _vm$$props$lazyKey !== void 0 ? _vm$$props$lazyKey : defaultKey;
    var componentUpdateInfo;

    if (lazyKeyComponentUpdateInfoMap.has(lazyKey)) {
      componentUpdateInfo = lazyKeyComponentUpdateInfoMap.get(lazyKey);
    } else {
      componentUpdateInfo = {
        tempSet: new Set(),
        timer: -1,
        sort: false
      };
      lazyKeyComponentUpdateInfoMap.set(lazyKey, componentUpdateInfo);
    }

    var vmSet = lazyKeyVmSetMap.get(lazyKey) || new Set();
    vmSet.delete(vm);
    !vm.isLoaded && componentUpdateInfo.tempSet.add(vm);
    clearTimeout(componentUpdateInfo.timer);
    isMounted && (componentUpdateInfo.sort = true);
    componentUpdateInfo.timer = setTimeout(function () {
      var targetSet = mainHandler(0
      /* component */
      , componentUpdateInfo.tempSet, componentUpdateInfo.sort);

      var _iterator4 = _createForOfIteratorHelper(targetSet),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var target = _step4.value;
          vmSet.add(target);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      componentUpdateInfo.sort = false;
      componentUpdateInfo.tempSet = new Set();
      lazyKeyVmSetMap.set(lazyKey, vmSet);
    }, 10);
    !isMounted && addListener(vm.$el.parentElement, lazyKey);
  }

  var lazyKeyDirectiveUpdateInfoMap = new Map();

  function addDirectiveRecord(el, lazyKey, isMounted) {
    var _lazyKey;

    lazyKey = (_lazyKey = lazyKey) !== null && _lazyKey !== void 0 ? _lazyKey : defaultKey;
    var directiveUpdateInfo;

    if (lazyKeyDirectiveUpdateInfoMap.has(lazyKey)) {
      directiveUpdateInfo = lazyKeyDirectiveUpdateInfoMap.get(lazyKey);
    } else {
      directiveUpdateInfo = {
        tempSet: new Set(),
        timer: -1,
        sort: false
      };
      lazyKeyDirectiveUpdateInfoMap.set(lazyKey, directiveUpdateInfo);
    }

    var elSet = lazyKeyElSetMap.get(lazyKey) || new Set();
    elSet.delete(el);
    !el.__isLoaded && directiveUpdateInfo.tempSet.add(el);
    isMounted && (directiveUpdateInfo.sort = true);
    clearTimeout(directiveUpdateInfo.timer);
    directiveUpdateInfo.timer = setTimeout(function () {
      var targetSet = mainHandler(1
      /* directive */
      , directiveUpdateInfo.tempSet, directiveUpdateInfo.sort);

      var _iterator5 = _createForOfIteratorHelper(targetSet),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var target = _step5.value;
          elSet.add(target);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      directiveUpdateInfo.sort = false;
      directiveUpdateInfo.tempSet = new Set();
      lazyKeyElSetMap.set(lazyKey, elSet);
    }, 10);
    !isMounted && addListener(el.parentElement, lazyKey);
  }

  function addListener(parent, lazyKey) {
    while (parent) {
      var lazyKeySet = elLazyKeySetMap.get(parent) || new Set();

      if (!lazyKeySet.has(lazyKey)) {
        elLazyKeySetMap.set(parent, lazyKeySet.add(lazyKey));
        parent.addEventListener('scroll', listener);
      } else break;

      parent = parent.parentElement;
    }
  }

  function throttle(fn) {
    var flag = false,
        timer;

    var handler = function handler(event, sort) {
      if (event && ![window, document].includes(event.target)) {
        var target = event.target;
        var targetVmSets = findSet(target, lazyKeyVmSetMap);
        var targetElSets = findSet(target, lazyKeyElSetMap);

        var _target$getBoundingCl = target.getBoundingClientRect(),
            left = _target$getBoundingCl.left,
            right = _target$getBoundingCl.right,
            top = _target$getBoundingCl.top,
            bottom = _target$getBoundingCl.bottom;

        var _iterator6 = _createForOfIteratorHelper(targetVmSets),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var targetVmSet = _step6.value;
            fn(0
            /* component */
            , targetVmSet, sort, top, right, bottom, left);
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }

        var _iterator7 = _createForOfIteratorHelper(targetElSets),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var targetElSet = _step7.value;
            fn(1
            /* directive */
            , targetElSet, sort, top, right, bottom, left);
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      } else {
        var _iterator8 = _createForOfIteratorHelper(lazyKeyVmSetMap),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var _step8$value = _slicedToArray(_step8.value, 2),
                vmSet = _step8$value[1];

            fn(0
            /* component */
            , vmSet, sort);
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }

        var _iterator9 = _createForOfIteratorHelper(lazyKeyElSetMap),
            _step9;

        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var _step9$value = _slicedToArray(_step9.value, 2),
                elSet = _step9$value[1];

            fn(1
            /* directive */
            , elSet, sort);
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
      }

      flag = false;
      config.afterListen && config.afterListen(event, lazyKeyElSetMap, lazyKeyVmSetMap);
    };

    return function (event, sort) {
      if (config.debounce) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          return handler(event, sort);
        }, config.timeout + 50); // debounce
      }

      if (flag) return;
      flag = true;
      setTimeout(function () {
        return handler(event, sort);
      }, config.timeout); // throttle
    };
  }

  function findSet(target, map) {
    var lazyKeySet = elLazyKeySetMap.get(target);
    var res = [];

    var _iterator10 = _createForOfIteratorHelper(lazyKeySet),
        _step10;

    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        var lazyKey = _step10.value;
        if (map.has(lazyKey)) res.push(map.get(lazyKey));
      }
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
    }

    return res;
  }

  var LazyComponent = vue.defineComponent({
    render: function render() {
      var _this = this;

      var isMounted = this.$.isMounted;
      vue.nextTick().then(function () {
        return addComponentRecord(_this, isMounted);
      });

      if (!this.isLoaded) {
        return this.$slots.loading ? vue.h('div', this.$slots.loading()) : vue.h('div');
      } else {
        return this.$slots.default ? vue.h(this.$slots.default) : vue.h('div');
      }
    },
    props: ['lazyKey'],
    setup: function setup() {
      return {
        isLoaded: vue.ref(false)
      };
    }
  });
  var LazyDirective = {
    beforeMount: function beforeMount(el, _ref) {
      var value = _ref.value;
      var lazyKey;

      if (typeof value === 'string') {
        el.lazy = Object.assign(_objectSpread({}, directiveConfig), {
          src: value
        });
      } else {
        var _el$classList7;

        var loading = value.loading,
            _value$loadingClassLi = value.loadingClassList,
            loadingClassList = _value$loadingClassLi === void 0 ? [] : _value$loadingClassLi;
        if (loading) el.setAttribute('src', loading);

        (_el$classList7 = el.classList).add.apply(_el$classList7, _toConsumableArray(loadingClassList));

        el.lazy = Object.assign(_objectSpread({}, directiveConfig), value);
        lazyKey = value.lazyKey;
      }

      vue.nextTick().then(function () {
        return addDirectiveRecord(el, lazyKey, false);
      });
    },
    updated: function updated(el, _ref2) {
      var value = _ref2.value;
      addDirectiveRecord(el, typeof value !== 'string' ? value.lazyKey : undefined, true);
    }
  };
  var index = {
    install: function install(app) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var v;
      Object.keys(baseConfig).forEach(function (k) {
        return (v = options[k]) !== undefined && (baseConfig[k] = v);
      });
      Object.keys(config).forEach(function (k) {
        return (v = options[k]) !== undefined && (config[k] = v);
      });
      Object.assign(directiveConfig, baseConfig);
      if (config.component) app.component('lazy-component', LazyComponent);
      app.directive('lazy', LazyDirective);
    }
  };
  exports.config = config;
  exports["default"] = index;
  exports.listener = listener;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
