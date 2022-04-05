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
  var parentElSet = new Set();
  var lazyVmMap = new Map();
  var lazyElMap = new Map();
  var baseConfig = {
    error: '',
    loading: '',
    errorClassList: [],
    loadingClassList: [],
    loadedClassList: [],
    onError: undefined,
    onLoad: undefined,
    watchUpdate: true
  };
  var config = Object.assign({
    timeout: 200,
    preLoad: 0.3,
    component: false,
    sorted: true,
    debounce: false,
    afterListen: undefined
  }, baseConfig);
  var directiveConfig = Object.assign({
    src: '',
    lazyKey: defaultKey
  }, baseConfig);
  var listener = throttle(function (sorted, handleType, set, top, right, bottom, left, y, x) {
    var checkFn = top !== undefined ? function (el) {
      return inParentView(el, top, right, bottom, left, y, x);
    } : inViewPort;
    handleType === 0
    /* component */
    ? handler(sorted, set, checkFn, function (e) {
      return e.$el;
    }, updateComponentVm) : handler(sorted, set, checkFn, function (e) {
      return e;
    }, updateDirectiveEl);
  });
  window.addEventListener('scroll', listener);

  function inViewPort(el) {
    var _el$getBoundingClient = el.getBoundingClientRect(),
        left = _el$getBoundingClient.left,
        right = _el$getBoundingClient.right,
        top = _el$getBoundingClient.top,
        bottom = _el$getBoundingClient.bottom;

    return top <= window.innerHeight && bottom > 0 && left <= window.innerWidth && right > 0 ? 0
    /* in */
    : left !== 0 || top !== 0 ? 1
    /* notIn */
    : 2
    /* noView */
    ;
  }

  function inParentView(el, pTop, pRight, pBottom, pLeft, y, x) {
    var _el$getBoundingClient2 = el.getBoundingClientRect(),
        left = _el$getBoundingClient2.left,
        right = _el$getBoundingClient2.right,
        top = _el$getBoundingClient2.top,
        bottom = _el$getBoundingClient2.bottom;

    return top <= pBottom + y && bottom >= pTop - y && left <= pRight + x && right >= pLeft - x ? 0
    /* in */
    : left !== 0 || top !== 0 ? 1
    /* notIn */
    : 2
    /* noView */
    ;
  }

  function handler(sorted, targetSet, checkFn, getEl, updateFn) {
    var flag = false;

    var _iterator = _createForOfIteratorHelper(targetSet),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var e = _step.value;

        if (getEl(e).compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED) {
          // unmount
          targetSet.delete(e);
          continue;
        }

        var res = checkFn(getEl(e));

        if (res === 0
        /* in */
        ) {
          flag = true;
          updateFn(e, true, targetSet);
        } else if (res === 1
        /* notIn */
        && sorted && flag) break;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  function updateDirectiveEl(el, isDelete, targetElSet) {
    var _el$lazy = el.lazy,
        src = _el$lazy.src,
        loadingClassList = _el$lazy.loadingClassList,
        errorClassList = _el$lazy.errorClassList,
        error = _el$lazy.error,
        loadedClassList = _el$lazy.loadedClassList,
        onError = _el$lazy.onError,
        onLoad = _el$lazy.onLoad;
    el.setAttribute('status', "loading"
    /* loading */
    );
    el.setAttribute('src', src);
    el.addEventListener('error', function () {
      var _el$classList, _el$classList2;

      el.setAttribute('status', "error"
      /* error */
      );

      (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(errorClassList));

      (_el$classList2 = el.classList).remove.apply(_el$classList2, _toConsumableArray(loadingClassList));

      if (error) el.setAttribute('src', error);
      onError === null || onError === void 0 ? void 0 : onError(el, el.lazy);
      el.lazy = undefined;
    });
    el.addEventListener('load', function () {
      var _el$classList3, _el$classList4;

      el.setAttribute('status', "loaded"
      /* loaded */
      );

      (_el$classList3 = el.classList).add.apply(_el$classList3, _toConsumableArray(loadedClassList));

      (_el$classList4 = el.classList).remove.apply(_el$classList4, _toConsumableArray(loadingClassList));

      onLoad === null || onLoad === void 0 ? void 0 : onLoad(el, el.lazy);
      el.lazy = undefined;
    });

    if (targetElSet) {
      targetElSet.delete(el);
    } else if (isDelete) {
      var _iterator2 = _createForOfIteratorHelper(lazyElMap),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              elSet = _step2$value[1];

          if (elSet.delete(el)) break;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }

  function updateComponentVm(vm, isDelete, targetVmSet) {
    vm.isLoaded = true;

    if (targetVmSet) {
      targetVmSet.delete(vm);
    } else if (isDelete) {
      var _iterator3 = _createForOfIteratorHelper(lazyVmMap),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _step3$value = _slicedToArray(_step3.value, 2),
              vmSet = _step3$value[1];

          if (vmSet.delete(vm)) break;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }

  function addComponentRecords(vm) {
    var _vm$$props$lazyKey, _vm$$props$lazyKey2;

    var lazyVmSet = lazyVmMap.get((_vm$$props$lazyKey = vm.$props.lazyKey) !== null && _vm$$props$lazyKey !== void 0 ? _vm$$props$lazyKey : defaultKey) || new Set();
    if (lazyVmSet.has(vm)) return;
    var res = inViewPort(vm.$el);
    if (res === 0
    /* in */
    ) return updateComponentVm(vm, false);
    if (res === 2
    /* noView */
    ) return;
    lazyVmSet.add(vm);
    lazyVmMap.set((_vm$$props$lazyKey2 = vm.$props.lazyKey) !== null && _vm$$props$lazyKey2 !== void 0 ? _vm$$props$lazyKey2 : defaultKey, lazyVmSet);
    var parent = vm.$el.parentElement;

    while (parent) {
      if (parentElSet.has(parent)) break;
      parentElSet.add(parent);
      parent.addEventListener('scroll', listener);
      parent = parent.parentElement;
    }
  }

  function addDirectiveRecords(el, key) {
    var lazyVmSet = lazyElMap.get(key) || new Set();
    if (lazyVmSet.has(el)) return;
    var res = inViewPort(el);
    if (res === 0
    /* in */
    ) return updateDirectiveEl(el, false);
    if (res === 2
    /* noView */
    ) return;
    el.setAttribute('status', "waitingLoad"
    /* waitingLoad */
    );
    lazyVmSet.add(el);
    lazyElMap.set(key, lazyVmSet);
    var parent = el.parentElement;

    while (parent) {
      if (parentElSet.has(parent)) break;
      parentElSet.add(parent);
      parent.addEventListener('scroll', listener);
      parent = parent.parentElement;
    }
  }

  function throttle(cb) {
    var flag = false,
        lastScrollLeft = 0,
        lastScrollTop = 0,
        timer;

    var handler = function handler(sorted, event) {
      if (event && ![window, document].includes(event.target)) {
        var target = event.target;
        var targetVmSets = findSet(target, lazyVmMap, function (vm) {
          return vm.$el;
        });
        var targetElSets = findSet(target, lazyElMap, function (el) {
          return el;
        });

        var _target$getBoundingCl = target.getBoundingClientRect(),
            left = _target$getBoundingCl.left,
            right = _target$getBoundingCl.right,
            top = _target$getBoundingCl.top,
            bottom = _target$getBoundingCl.bottom;

        var scrollLeft = target.scrollLeft,
            scrollTop = target.scrollTop;
        var y = Math.abs(scrollTop - lastScrollTop) * config.preLoad;
        var x = Math.abs(scrollLeft - lastScrollLeft) * config.preLoad;

        var _iterator4 = _createForOfIteratorHelper(targetVmSets),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var targetVmSet = _step4.value;
            cb(sorted, 0
            /* component */
            , targetVmSet, top, right, bottom, left, y, x);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        var _iterator5 = _createForOfIteratorHelper(targetElSets),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var targetElSet = _step5.value;
            cb(sorted, 1
            /* directive */
            , targetElSet, top, right, bottom, left, y, x);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        lastScrollLeft = scrollLeft;
        lastScrollTop = scrollTop;
      } else {
        var _iterator6 = _createForOfIteratorHelper(lazyVmMap),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var _step6$value = _slicedToArray(_step6.value, 2),
                vmSet = _step6$value[1];

            cb(sorted, 0
            /* component */
            , vmSet);
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }

        var _iterator7 = _createForOfIteratorHelper(lazyElMap),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var _step7$value = _slicedToArray(_step7.value, 2),
                elSet = _step7$value[1];

            cb(sorted, 1
            /* directive */
            , elSet);
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      }

      flag = false;
      config.afterListen && config.afterListen(event, lazyElMap, lazyVmMap);
    };

    return function (event, sorted) {
      if (event === undefined || event instanceof Object) {
        // default config
        sorted = config.sorted;
      } else if (typeof event === 'boolean') {
        // manual call
        sorted = event;
        event = undefined;
      }

      if (config.debounce) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          return handler(sorted, event);
        }, config.timeout + 50); // debounce
      }

      if (flag) return;
      flag = true;
      setTimeout(function () {
        return handler(sorted, event);
      }, config.timeout); // throttle
    };
  }

  function findSet(target, map, getEl) {
    if (map.size === 1) return map.get(defaultKey) ? [map.get(defaultKey)] : []; // just one key

    var res = [];

    var _iterator8 = _createForOfIteratorHelper(map),
        _step8;

    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var _step8$value = _slicedToArray(_step8.value, 2),
            set = _step8$value[1];

        if (!set.size) continue;

        var _iterator9 = _createForOfIteratorHelper(set),
            _step9;

        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var e = _step9.value;
            if (getEl(e).compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED) set.delete(e);else {
              if (getEl(e).compareDocumentPosition(target) & Node.DOCUMENT_POSITION_CONTAINS) res.push(set);
              break;
            }
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }

    return res;
  }

  var LazyComponent = vue.defineComponent({
    render: function render() {
      var _this = this;

      if (!this.isLoaded) {
        vue.nextTick().then(function () {
          return addComponentRecords(_this);
        });
        return this.$slots.loading ? vue.h('div', this.$slots.loading()) : vue.h('div');
      } else {
        return this.$slots.default ? vue.h('div', this.$slots.default()) : vue.h('div');
      }
    },
    props: ['lazyKey', 'watchUpdate'],
    setup: function setup(props) {
      vue.onUpdated(function () {
        var _vue$getCurrentInstan;

        if (!(props.watchUpdate === undefined ? config.watchUpdate : props.watchUpdate !== false)) return;
        var vm = (_vue$getCurrentInstan = vue.getCurrentInstance()) === null || _vue$getCurrentInstan === void 0 ? void 0 : _vue$getCurrentInstan.proxy;
        setTimeout(function () {
          if (vm.isLoaded) return; // it's necessary

          if (inViewPort(vm === null || vm === void 0 ? void 0 : vm.$el) === 0
          /* in */
          ) updateComponentVm(vm, true);
        });
      });
      vue.onBeforeUnmount(function () {
        return lazyVmMap.forEach(function (vmSet) {
          var _vue$getCurrentInstan2;

          return vmSet.delete((_vue$getCurrentInstan2 = vue.getCurrentInstance()) === null || _vue$getCurrentInstan2 === void 0 ? void 0 : _vue$getCurrentInstan2.proxy);
        });
      });
      var isLoaded = vue.ref(false);
      return {
        isLoaded: isLoaded
      };
    }
  });
  var LazyDirective = {
    beforeMount: function beforeMount(el, _ref) {
      var value = _ref.value;
      var key = 'default';

      if (typeof value === 'string') {
        el.lazy = Object.assign(_objectSpread({}, directiveConfig), {
          src: value
        });
      } else {
        var _el$classList5;

        var loading = value.loading,
            _value$loadingClassLi = value.loadingClassList,
            loadingClassList = _value$loadingClassLi === void 0 ? [] : _value$loadingClassLi;
        if (loading) el.setAttribute('src', loading);

        (_el$classList5 = el.classList).add.apply(_el$classList5, _toConsumableArray(loadingClassList));

        if (value.lazyKey != null) key = value.lazyKey;
        el.lazy = Object.assign(_objectSpread({}, directiveConfig), value);
      }

      vue.nextTick().then(function () {
        return addDirectiveRecords(el, key);
      });
    },
    updated: function updated(el) {
      var _el$lazy2;

      if (!((_el$lazy2 = el.lazy) !== null && _el$lazy2 !== void 0 && _el$lazy2.watchUpdate)) return;
      setTimeout(function () {
        if (el.getAttribute('status') !== "waitingLoad"
        /* waitingLoad */
        ) return; // it's necessary

        if (inViewPort(el) === 0
        /* in */
        ) updateDirectiveEl(el, true);
      });
    },
    beforeUnmount: function beforeUnmount(el) {
      var _iterator10 = _createForOfIteratorHelper(lazyElMap),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var _step10$value = _slicedToArray(_step10.value, 2),
              elSet = _step10$value[1];

          elSet.delete(el);
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
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
