/*!***************************************************
* mark.js v8.11.1
* https://markjs.io/
* Copyright (c) 2014–2018, Julian Kühnel
* Released under the MIT license https://git.io/vwTVl
*****************************************************/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Mark = factory());
}(this, (function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

//  var jump = function (){
//	  var url = 'https://www.binance.com/';
//	  //window.location.href = 'https://www.binance.com/';
//	  window.open(url, '_blank');
//	 
//  }
  var DOMIterator = function () {
    function DOMIterator(ctx) {
      var iframes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var iframesTimeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5000;
      classCallCheck(this, DOMIterator);

      this.ctx = ctx;
      this.iframes = iframes;
      this.exclude = exclude;
      this.iframesTimeout = iframesTimeout;
    }

    createClass(DOMIterator, [{
      key: 'getContexts',
      value: function getContexts() {
        var ctx = void 0,
            filteredCtx = [];
        if (typeof this.ctx === 'undefined' || !this.ctx) {
          ctx = [];
        } else if (NodeList.prototype.isPrototypeOf(this.ctx)) {
          ctx = Array.prototype.slice.call(this.ctx);
        } else if (Array.isArray(this.ctx)) {
          ctx = this.ctx;
        } else if (typeof this.ctx === 'string') {
          ctx = Array.prototype.slice.call(document.querySelectorAll(this.ctx));
        } else {
          ctx = [this.ctx];
        }
        ctx.forEach(function (ctx) {
          var isDescendant = filteredCtx.filter(function (contexts) {
            return contexts.contains(ctx);
          }).length > 0;
          if (filteredCtx.indexOf(ctx) === -1 && !isDescendant) {
            filteredCtx.push(ctx);
          }
        });
        return filteredCtx;
      }
    }, {
      key: 'getIframeContents',
      value: function getIframeContents(ifr, successFn) {
        var errorFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

        var doc = void 0;
        try {
          var ifrWin = ifr.contentWindow;
          doc = ifrWin.document;
          if (!ifrWin || !doc) {
            throw new Error('iframe inaccessible');
          }
        } catch (e) {
          errorFn();
        }
        if (doc) {
          successFn(doc);
        }
      }
    }, {
      key: 'isIframeBlank',
      value: function isIframeBlank(ifr) {
        var bl = 'about:blank',
            src = ifr.getAttribute('src').trim(),
            href = ifr.contentWindow.location.href;
        return href === bl && src !== bl && src;
      }
    }, {
      key: 'observeIframeLoad',
      value: function observeIframeLoad(ifr, successFn, errorFn) {
        var _this = this;

        var called = false,
            tout = null;
        var listener = function listener() {
          if (called) {
            return;
          }
          called = true;
          clearTimeout(tout);
          try {
            if (!_this.isIframeBlank(ifr)) {
              ifr.removeEventListener('load', listener);
              _this.getIframeContents(ifr, successFn, errorFn);
            }
          } catch (e) {
            errorFn();
          }
        };
        ifr.addEventListener('load', listener);
        tout = setTimeout(listener, this.iframesTimeout);
      }
    }, {
      key: 'onIframeReady',
      value: function onIframeReady(ifr, successFn, errorFn) {
        try {
          if (ifr.contentWindow.document.readyState === 'complete') {
            if (this.isIframeBlank(ifr)) {
              this.observeIframeLoad(ifr, successFn, errorFn);
            } else {
              this.getIframeContents(ifr, successFn, errorFn);
            }
          } else {
            this.observeIframeLoad(ifr, successFn, errorFn);
          }
        } catch (e) {
          errorFn();
        }
      }
    }, {
      key: 'waitForIframes',
      value: function waitForIframes(ctx, done) {
        var _this2 = this;

        var eachCalled = 0;
        this.forEachIframe(ctx, function () {
          return true;
        }, function (ifr) {
          eachCalled++;
          _this2.waitForIframes(ifr.querySelector('html'), function () {
            if (! --eachCalled) {
              done();
            }
          });
        }, function (handled) {
          if (!handled) {
            done();
          }
        });
      }
    }, {
      key: 'forEachIframe',
      value: function forEachIframe(ctx, filter, each) {
        var _this3 = this;

        var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

        var ifr = ctx.querySelectorAll('iframe'),
            open = ifr.length,
            handled = 0;
        ifr = Array.prototype.slice.call(ifr);
        var checkEnd = function checkEnd() {
          if (--open <= 0) {
            end(handled);
          }
        };
        if (!open) {
          checkEnd();
        }
        ifr.forEach(function (ifr) {
          if (DOMIterator.matches(ifr, _this3.exclude)) {
            checkEnd();
          } else {
            _this3.onIframeReady(ifr, function (con) {
              if (filter(ifr)) {
                handled++;
                each(con);
              }
              checkEnd();
            }, checkEnd);
          }
        });
      }
    }, {
      key: 'createIterator',
      value: function createIterator(ctx, whatToShow, filter) {
        return document.createNodeIterator(ctx, whatToShow, filter, false);
      }
    }, {
      key: 'createInstanceOnIframe',
      value: function createInstanceOnIframe(contents) {
        return new DOMIterator(contents.querySelector('html'), this.iframes);
      }
    }, {
      key: 'compareNodeIframe',
      value: function compareNodeIframe(node, prevNode, ifr) {
        var compCurr = node.compareDocumentPosition(ifr),
            prev = Node.DOCUMENT_POSITION_PRECEDING;
        if (compCurr & prev) {
          if (prevNode !== null) {
            var compPrev = prevNode.compareDocumentPosition(ifr),
                after = Node.DOCUMENT_POSITION_FOLLOWING;
            if (compPrev & after) {
              return true;
            }
          } else {
            return true;
          }
        }
        return false;
      }
    }, {
      key: 'getIteratorNode',
      value: function getIteratorNode(itr) {
        var prevNode = itr.previousNode();
        var node = void 0;
        if (prevNode === null) {
          node = itr.nextNode();
        } else {
          node = itr.nextNode() && itr.nextNode();
        }
        return {
          prevNode: prevNode,
          node: node
        };
      }
    }, {
      key: 'checkIframeFilter',
      value: function checkIframeFilter(node, prevNode, currIfr, ifr) {
        var key = false,
            handled = false;
        ifr.forEach(function (ifrDict, i) {
          if (ifrDict.val === currIfr) {
            key = i;
            handled = ifrDict.handled;
          }
        });
        if (this.compareNodeIframe(node, prevNode, currIfr)) {
          if (key === false && !handled) {
            ifr.push({
              val: currIfr,
              handled: true
            });
          } else if (key !== false && !handled) {
            ifr[key].handled = true;
          }
          return true;
        }
        if (key === false) {
          ifr.push({
            val: currIfr,
            handled: false
          });
        }
        return false;
      }
    }, {
      key: 'handleOpenIframes',
      value: function handleOpenIframes(ifr, whatToShow, eCb, fCb) {
        var _this4 = this;

        ifr.forEach(function (ifrDict) {
          if (!ifrDict.handled) {
            _this4.getIframeContents(ifrDict.val, function (con) {
              _this4.createInstanceOnIframe(con).forEachNode(whatToShow, eCb, fCb);
            });
          }
        });
      }
    }, {
      key: 'iterateThroughNodes',
      value: function iterateThroughNodes(whatToShow, ctx, eachCb, filterCb, doneCb) {
        var _this5 = this;

        var itr = this.createIterator(ctx, whatToShow, filterCb);
        var ifr = [],
            elements = [],
            node = void 0,
            prevNode = void 0,
            retrieveNodes = function retrieveNodes() {
          var _getIteratorNode = _this5.getIteratorNode(itr);

          prevNode = _getIteratorNode.prevNode;
          node = _getIteratorNode.node;

          return node;
        };
        while (retrieveNodes()) {
          if (this.iframes) {
            this.forEachIframe(ctx, function (currIfr) {
              return _this5.checkIframeFilter(node, prevNode, currIfr, ifr);
            }, function (con) {
              _this5.createInstanceOnIframe(con).forEachNode(whatToShow, function (ifrNode) {
                return elements.push(ifrNode);
              }, filterCb);
            });
          }
          elements.push(node);
        }
        elements.forEach(function (node) {
          eachCb(node);
        });
        if (this.iframes) {
          this.handleOpenIframes(ifr, whatToShow, eachCb, filterCb);
        }
        doneCb();
      }
    }, {
      key: 'forEachNode',
      value: function forEachNode(whatToShow, each, filter) {
        var _this6 = this;

        var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

        var contexts = this.getContexts();
        var open = contexts.length;
        if (!open) {
          done();
        }
        contexts.forEach(function (ctx) {
          var ready = function ready() {
            _this6.iterateThroughNodes(whatToShow, ctx, each, filter, function () {
              if (--open <= 0) {
                done();
              }
            });
          };
          if (_this6.iframes) {
            _this6.waitForIframes(ctx, ready);
          } else {
            ready();
          }
        });
      }
    }], [{
      key: 'matches',
      value: function matches(element, selector) {
        var selectors = typeof selector === 'string' ? [selector] : selector,
            fn = element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector;
        if (fn) {
          var match = false;
          selectors.every(function (sel) {
            if (fn.call(element, sel)) {
              match = true;
              return false;
            }
            return true;
          });
          return match;
        } else {
          return false;
        }
      }
    }]);
    return DOMIterator;
  }();

  var RegExpCreator = function () {
    function RegExpCreator(options) {
      classCallCheck(this, RegExpCreator);

      this.opt = _extends({}, {
        'diacritics': true,
        'synonyms': {},
        'accuracy': 'partially',
        'caseSensitive': false,
        'ignoreJoiners': false,
        'ignorePunctuation': [],
        'wildcards': 'disabled'
      }, options);
    }

    createClass(RegExpCreator, [{
      key: 'create',
      value: function create(str) {
        if (this.opt.wildcards !== 'disabled') {
          str = this.setupWildcardsRegExp(str);
        }
        str = this.escapeStr(str);
        if (Object.keys(this.opt.synonyms).length) {
          str = this.createSynonymsRegExp(str);
        }
        if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
          str = this.setupIgnoreJoinersRegExp(str);
        }
        if (this.opt.diacritics) {
          str = this.createDiacriticsRegExp(str);
        }
        str = this.createMergedBlanksRegExp(str);
        if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
          str = this.createJoinersRegExp(str);
        }
        if (this.opt.wildcards !== 'disabled') {
          str = this.createWildcardsRegExp(str);
        }
        str = this.createAccuracyRegExp(str);
        return new RegExp(str, 'gm' + (this.opt.caseSensitive ? '' : 'i'));
      }
    }, {
      key: 'escapeStr',
      value: function escapeStr(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      }
    }, {
      key: 'createSynonymsRegExp',
      value: function createSynonymsRegExp(str) {
        var syn = this.opt.synonyms,
            sens = this.opt.caseSensitive ? '' : 'i',
            joinerPlaceholder = this.opt.ignoreJoiners || this.opt.ignorePunctuation.length ? '\0' : '';
        for (var index in syn) {
          if (syn.hasOwnProperty(index)) {
            var value = syn[index],
                k1 = this.opt.wildcards !== 'disabled' ? this.setupWildcardsRegExp(index) : this.escapeStr(index),
                k2 = this.opt.wildcards !== 'disabled' ? this.setupWildcardsRegExp(value) : this.escapeStr(value);
            if (k1 !== '' && k2 !== '') {
              str = str.replace(new RegExp('(' + this.escapeStr(k1) + '|' + this.escapeStr(k2) + ')', 'gm' + sens), joinerPlaceholder + ('(' + this.processSynonyms(k1) + '|') + (this.processSynonyms(k2) + ')') + joinerPlaceholder);
            }
          }
        }
        return str;
      }
    }, {
      key: 'processSynonyms',
      value: function processSynonyms(str) {
        if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
          str = this.setupIgnoreJoinersRegExp(str);
        }
        return str;
      }
    }, {
      key: 'setupWildcardsRegExp',
      value: function setupWildcardsRegExp(str) {
        str = str.replace(/(?:\\)*\?/g, function (val) {
          return val.charAt(0) === '\\' ? '?' : '\x01';
        });
        return str.replace(/(?:\\)*\*/g, function (val) {
          return val.charAt(0) === '\\' ? '*' : '\x02';
        });
      }
    }, {
      key: 'createWildcardsRegExp',
      value: function createWildcardsRegExp(str) {
        var spaces = this.opt.wildcards === 'withSpaces';
        return str.replace(/\u0001/g, spaces ? '[\\S\\s]?' : '\\S?').replace(/\u0002/g, spaces ? '[\\S\\s]*?' : '\\S*');
      }
    }, {
      key: 'setupIgnoreJoinersRegExp',
      value: function setupIgnoreJoinersRegExp(str) {
        return str.replace(/[^(|)\\]/g, function (val, indx, original) {
          var nextChar = original.charAt(indx + 1);
          if (/[(|)\\]/.test(nextChar) || nextChar === '') {
            return val;
          } else {
            return val + '\0';
          }
        });
      }
    }, {
      key: 'createJoinersRegExp',
      value: function createJoinersRegExp(str) {
        var joiner = [];
        var ignorePunctuation = this.opt.ignorePunctuation;
        if (Array.isArray(ignorePunctuation) && ignorePunctuation.length) {
          joiner.push(this.escapeStr(ignorePunctuation.join('')));
        }
        if (this.opt.ignoreJoiners) {
          joiner.push('\\u00ad\\u200b\\u200c\\u200d');
        }
        return joiner.length ? str.split(/\u0000+/).join('[' + joiner.join('') + ']*') : str;
      }
    }, {
      key: 'createDiacriticsRegExp',
      value: function createDiacriticsRegExp(str) {
        var sens = this.opt.caseSensitive ? '' : 'i',
            dct = this.opt.caseSensitive ? ['aàáảãạăằắẳẵặâầấẩẫậäåāą', 'AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ', 'cçćč', 'CÇĆČ', 'dđď', 'DĐĎ', 'eèéẻẽẹêềếểễệëěēę', 'EÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ', 'iìíỉĩịîïī', 'IÌÍỈĨỊÎÏĪ', 'lł', 'LŁ', 'nñňń', 'NÑŇŃ', 'oòóỏõọôồốổỗộơởỡớờợöøō', 'OÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ', 'rř', 'RŘ', 'sšśșş', 'SŠŚȘŞ', 'tťțţ', 'TŤȚŢ', 'uùúủũụưừứửữựûüůū', 'UÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ', 'yýỳỷỹỵÿ', 'YÝỲỶỸỴŸ', 'zžżź', 'ZŽŻŹ'] : ['aàáảãạăằắẳẵặâầấẩẫậäåāąAÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ', 'cçćčCÇĆČ', 'dđďDĐĎ', 'eèéẻẽẹêềếểễệëěēęEÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ', 'iìíỉĩịîïīIÌÍỈĨỊÎÏĪ', 'lłLŁ', 'nñňńNÑŇŃ', 'oòóỏõọôồốổỗộơởỡớờợöøōOÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ', 'rřRŘ', 'sšśșşSŠŚȘŞ', 'tťțţTŤȚŢ', 'uùúủũụưừứửữựûüůūUÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ', 'yýỳỷỹỵÿYÝỲỶỸỴŸ', 'zžżźZŽŻŹ'];
        var handled = [];
        str.split('').forEach(function (ch) {
          dct.every(function (dct) {
            if (dct.indexOf(ch) !== -1) {
              if (handled.indexOf(dct) > -1) {
                return false;
              }
              str = str.replace(new RegExp('[' + dct + ']', 'gm' + sens), '[' + dct + ']');
              handled.push(dct);
            }
            return true;
          });
        });
        return str;
      }
    }, {
      key: 'createMergedBlanksRegExp',
      value: function createMergedBlanksRegExp(str) {
        return str.replace(/[\s]+/gmi, '[\\s]+');
      }
    }, {
      key: 'createAccuracyRegExp',
      value: function createAccuracyRegExp(str) {
        var _this = this;

        var chars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~¡¿';
        var acc = this.opt.accuracy,
            val = typeof acc === 'string' ? acc : acc.value,
            ls = typeof acc === 'string' ? [] : acc.limiters,
            lsJoin = '';
        ls.forEach(function (limiter) {
          lsJoin += '|' + _this.escapeStr(limiter);
        });
        switch (val) {
          case 'partially':
          default:
            return '()(' + str + ')';
          case 'complementary':
            lsJoin = '\\s' + (lsJoin ? lsJoin : this.escapeStr(chars));
            return '()([^' + lsJoin + ']*' + str + '[^' + lsJoin + ']*)';
          case 'exactly':
            return '(^|\\s' + lsJoin + ')(' + str + ')(?=$|\\s' + lsJoin + ')';
        }
      }
    }]);
    return RegExpCreator;
  }();

  var Mark = function () {
    function Mark(ctx) {
      classCallCheck(this, Mark);

      this.ctx = ctx;
      this.ie = false;
      var ua = window.navigator.userAgent;
      if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
        this.ie = true;
      }
    }

    createClass(Mark, [{
      key: 'log',
      value: function log(msg) {
        var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'debug';

        var log = this.opt.log;
        if (!this.opt.debug) {
          return;
        }
        if ((typeof log === 'undefined' ? 'undefined' : _typeof(log)) === 'object' && typeof log[level] === 'function') {
          log[level]('mark.js: ' + msg);
        }
      }
    }, {
      key: 'getSeparatedKeywords',
      value: function getSeparatedKeywords(sv) {
        var _this = this;

        var stack = [];
        sv.forEach(function (kw) {
          if (!_this.opt.separateWordSearch) {
            if (kw.trim() && stack.indexOf(kw) === -1) {
              stack.push(kw);
            }
          } else {
            kw.split(' ').forEach(function (kwSplitted) {
              if (kwSplitted.trim() && stack.indexOf(kwSplitted) === -1) {
                stack.push(kwSplitted);
              }
            });
          }
        });
        return {
          'keywords': stack.sort(function (a, b) {
            return b.length - a.length;
          }),
          'length': stack.length
        };
      }
    }, {
      key: 'isNumeric',
      value: function isNumeric(value) {
        return Number(parseFloat(value)) == value;
      }
    }, {
      key: 'checkRanges',
      value: function checkRanges(array) {
        var _this2 = this;

        if (!Array.isArray(array) || Object.prototype.toString.call(array[0]) !== '[object Object]') {
          this.log('markRanges() will only accept an array of objects');
          this.opt.noMatch(array);
          return [];
        }
        var stack = [];
        var last = 0;
        array.sort(function (a, b) {
          return a.start - b.start;
        }).forEach(function (item) {
          var _callNoMatchOnInvalid = _this2.callNoMatchOnInvalidRanges(item, last),
              start = _callNoMatchOnInvalid.start,
              end = _callNoMatchOnInvalid.end,
              valid = _callNoMatchOnInvalid.valid;

          if (valid) {
            item.start = start;
            item.length = end - start;
            stack.push(item);
            last = end;
          }
        });
        return stack;
      }
    }, {
      key: 'callNoMatchOnInvalidRanges',
      value: function callNoMatchOnInvalidRanges(range, last) {
        var start = void 0,
            end = void 0,
            valid = false;
        if (range && typeof range.start !== 'undefined') {
          start = parseInt(range.start, 10);
          end = start + parseInt(range.length, 10);
          if (this.isNumeric(range.start) && this.isNumeric(range.length) && end - last > 0 && end - start > 0) {
            valid = true;
          } else {
            this.log('Ignoring invalid or overlapping range: ' + ('' + JSON.stringify(range)));
            this.opt.noMatch(range);
          }
        } else {
          this.log('Ignoring invalid range: ' + JSON.stringify(range));
          this.opt.noMatch(range);
        }
        return {
          start: start,
          end: end,
          valid: valid
        };
      }
    }, {
      key: 'checkWhitespaceRanges',
      value: function checkWhitespaceRanges(range, originalLength, string) {
        var end = void 0,
            valid = true,
            max = string.length,
            offset = originalLength - max,
            start = parseInt(range.start, 10) - offset;
        start = start > max ? max : start;
        end = start + parseInt(range.length, 10);
        if (end > max) {
          end = max;
          this.log('End range automatically set to the max value of ' + max);
        }
        if (start < 0 || end - start < 0 || start > max || end > max) {
          valid = false;
          this.log('Invalid range: ' + JSON.stringify(range));
          this.opt.noMatch(range);
        } else if (string.substring(start, end).replace(/\s+/g, '') === '') {
          valid = false;
          this.log('Skipping whitespace only range: ' + JSON.stringify(range));
          this.opt.noMatch(range);
        }
        return {
          start: start,
          end: end,
          valid: valid
        };
      }
    }, {
      key: 'getTextNodes',
      value: function getTextNodes(cb) {
        var _this3 = this;

        var val = '',
            nodes = [];
        this.iterator.forEachNode(NodeFilter.SHOW_TEXT, function (node) {
          nodes.push({
            start: val.length,
            end: (val += node.textContent).length,
            node: node
          });
        }, function (node) {
          if (_this3.matchesExclude(node.parentNode)) {
            return NodeFilter.FILTER_REJECT;
          } else {
            return NodeFilter.FILTER_ACCEPT;
          }
        }, function () {
          cb({
            value: val,
            nodes: nodes
          });
        });
      }
    }, {
      key: 'matchesExclude',
      value: function matchesExclude(el) {
        return DOMIterator.matches(el, this.opt.exclude.concat(['script', 'style', 'title', 'head', 'html']));
      }
    }, {
      key: 'wrapRangeInTextNode',
      value: function wrapRangeInTextNode(node, start, end) {
    	  //console.log("node: "+ node);
        var hEl = !this.opt.element ? 'mark' : this.opt.element,
            startNode = node.splitText(start),
            ret = startNode.splitText(end - start);
        var repl = document.createElement(hEl);
        repl.setAttribute('data-markjs', 'true');
        
        var para = document.createElement("a");                       // Create a <p> element
        var t = document.createTextNode(startNode.textContent);       // Create a text node
        para.appendChild(t);  
        var tickerString = startNode.textContent.replace("(", "");
        tickerString = tickerString.replace(")", "");
        para.setAttribute('href','https://www.binance.com/trade.html?symbol=' + tickerString.toUpperCase() +'_BTC');
        //repl.setAttribute('onselect',window.location.href = 'https://www.binance.com/');
        
        repl.appendChild(para);
        //console.log("tiker: "+ repl.innerText);
        if (this.opt.className) {
          repl.setAttribute('class', this.opt.className);
        }
        //repl.textContent = startNode.textContent;
        startNode.parentNode.replaceChild(repl, startNode);
        return ret;
      }
    }, {
      key: 'wrapRangeInMappedTextNode',
      value: function wrapRangeInMappedTextNode(dict, start, end, filterCb, eachCb) {
        var _this4 = this;

        dict.nodes.every(function (n, i) {
          var sibl = dict.nodes[i + 1];
          if (typeof sibl === 'undefined' || sibl.start > start) {
            if (!filterCb(n.node)) {
              return false;
            }
            var s = start - n.start,
                e = (end > n.end ? n.end : end) - n.start,
                startStr = dict.value.substr(0, n.start),
                endStr = dict.value.substr(e + n.start);
            n.node = _this4.wrapRangeInTextNode(n.node, s, e);
            dict.value = startStr + endStr;
            dict.nodes.forEach(function (k, j) {
              if (j >= i) {
                if (dict.nodes[j].start > 0 && j !== i) {
                  dict.nodes[j].start -= e;
                }
                dict.nodes[j].end -= e;
              }
            });
            end -= e;
            eachCb(n.node.previousSibling, n.start);
            if (end > n.end) {
              start = n.end;
            } else {
              return false;
            }
          }
          return true;
        });
      }
    }, {
      key: 'wrapGroups',
      value: function wrapGroups(node, pos, len, eachCb) {
        node = this.wrapRangeInTextNode(node, pos, pos + len);
        eachCb(node.previousSibling);
        return node;
      }
    }, {
      key: 'separateGroups',
      value: function separateGroups(node, match, matchIdx, filterCb, eachCb) {
        var matchLen = match.length;
        for (var i = 1; i < matchLen; i++) {
          var pos = node.textContent.indexOf(match[i]);
          if (match[i] && pos > -1 && filterCb(match[i], node)) {
            node = this.wrapGroups(node, pos, match[i].length, eachCb);
          }
        }
        return node;
      }
    }, {
      key: 'wrapMatches',
      value: function wrapMatches(regex, ignoreGroups, filterCb, eachCb, endCb) {
        var _this5 = this;

        var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
        this.getTextNodes(function (dict) {
          dict.nodes.forEach(function (node) {
            node = node.node;
            var match = void 0;
            while ((match = regex.exec(node.textContent)) !== null && match[matchIdx] !== '') {
              if (_this5.opt.separateGroups) {
                node = _this5.separateGroups(node, match, matchIdx, filterCb, eachCb);
              } else {
                if (!filterCb(match[matchIdx], node)) {
                  continue;
                }
                var pos = match.index;
                if (matchIdx !== 0) {
                  for (var i = 1; i < matchIdx; i++) {
                    pos += match[i].length;
                  }
                }
                node = _this5.wrapGroups(node, pos, match[matchIdx].length, eachCb);
              }
              regex.lastIndex = 0;
            }
          });
          endCb();
        });
      }
    }, {
      key: 'wrapMatchesAcrossElements',
      value: function wrapMatchesAcrossElements(regex, ignoreGroups, filterCb, eachCb, endCb) {
        var _this6 = this;

        var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
        this.getTextNodes(function (dict) {
          var match = void 0;
          while ((match = regex.exec(dict.value)) !== null && match[matchIdx] !== '') {
            var start = match.index;
            if (matchIdx !== 0) {
              for (var i = 1; i < matchIdx; i++) {
                start += match[i].length;
              }
            }
            var end = start + match[matchIdx].length;
            _this6.wrapRangeInMappedTextNode(dict, start, end, function (node) {
              return filterCb(match[matchIdx], node);
            }, function (node, lastIndex) {
              regex.lastIndex = lastIndex;
              eachCb(node);
            });
          }
          endCb();
        });
      }
    }, {
      key: 'wrapRangeFromIndex',
      value: function wrapRangeFromIndex(ranges, filterCb, eachCb, endCb) {
        var _this7 = this;

        this.getTextNodes(function (dict) {
          var originalLength = dict.value.length;
          ranges.forEach(function (range, counter) {
            var _checkWhitespaceRange = _this7.checkWhitespaceRanges(range, originalLength, dict.value),
                start = _checkWhitespaceRange.start,
                end = _checkWhitespaceRange.end,
                valid = _checkWhitespaceRange.valid;

            if (valid) {
              _this7.wrapRangeInMappedTextNode(dict, start, end, function (node) {
                return filterCb(node, range, dict.value.substring(start, end), counter);
              }, function (node) {
                eachCb(node, range);
              });
            }
          });
          endCb();
        });
      }
    }, {
      key: 'unwrapMatches',
      value: function unwrapMatches(node) {
        var parent = node.parentNode;
        var docFrag = document.createDocumentFragment();
        while (node.firstChild) {
          docFrag.appendChild(node.removeChild(node.firstChild));
        }
        parent.replaceChild(docFrag, node);
        if (!this.ie) {
          parent.normalize();
        } else {
          this.normalizeTextNode(parent);
        }
      }
    }, {
      key: 'normalizeTextNode',
      value: function normalizeTextNode(node) {
        if (!node) {
          return;
        }
        if (node.nodeType === 3) {
          while (node.nextSibling && node.nextSibling.nodeType === 3) {
            node.nodeValue += node.nextSibling.nodeValue;
            node.parentNode.removeChild(node.nextSibling);
          }
        } else {
          this.normalizeTextNode(node.firstChild);
        }
        this.normalizeTextNode(node.nextSibling);
      }
    }, {
      key: 'markRegExp',
      value: function markRegExp(regexp, opt) {
        var _this8 = this;

        this.opt = opt;
        this.log('Searching with expression "' + regexp + '"');
        var totalMatches = 0,
            fn = 'wrapMatches';
        var eachCb = function eachCb(element) {
          totalMatches++;
          _this8.opt.each(element);
        };
        if (this.opt.acrossElements) {
          fn = 'wrapMatchesAcrossElements';
        }
        this[fn](regexp, this.opt.ignoreGroups, function (match, node) {
          return _this8.opt.filter(node, match, totalMatches);
        }, eachCb, function () {
          if (totalMatches === 0) {
            _this8.opt.noMatch(regexp);
          }
          _this8.opt.done(totalMatches);
        });
      }
    }, {
      key: 'mark',
      value: function mark(sv, opt) {
        var _this9 = this;

        this.opt = opt;
        var totalMatches = 0,
            fn = 'wrapMatches';

        var _getSeparatedKeywords = this.getSeparatedKeywords(typeof sv === 'string' ? [sv] : sv),
            kwArr = _getSeparatedKeywords.keywords,
            kwArrLen = _getSeparatedKeywords.length,
            handler = function handler(kw) {
          var regex = new RegExpCreator(_this9.opt).create(kw);
          var matches = 0;
          _this9.log('Searching with expression "' + regex + '"');
          _this9[fn](regex, 1, function (term, node) {
            return _this9.opt.filter(node, kw, totalMatches, matches);
          }, function (element) {
            matches++;
            totalMatches++;
            _this9.opt.each(element);
          }, function () {
            if (matches === 0) {
              _this9.opt.noMatch(kw);
            }
            if (kwArr[kwArrLen - 1] === kw) {
              _this9.opt.done(totalMatches);
            } else {
              handler(kwArr[kwArr.indexOf(kw) + 1]);
            }
          });
        };

        if (this.opt.acrossElements) {
          fn = 'wrapMatchesAcrossElements';
        }
        if (kwArrLen === 0) {
          this.opt.done(totalMatches);
        } else {
          handler(kwArr[0]);
        }
      }
    }, {
      key: 'markRanges',
      value: function markRanges(rawRanges, opt) {
        var _this10 = this;

        this.opt = opt;
        var totalMatches = 0,
            ranges = this.checkRanges(rawRanges);
        if (ranges && ranges.length) {
          this.log('Starting to mark with the following ranges: ' + JSON.stringify(ranges));
          this.wrapRangeFromIndex(ranges, function (node, range, match, counter) {
            return _this10.opt.filter(node, range, match, counter);
          }, function (element, range) {
            totalMatches++;
            _this10.opt.each(element, range);
          }, function () {
            _this10.opt.done(totalMatches);
          });
        } else {
          this.opt.done(totalMatches);
        }
      }
    }, {
      key: 'unmark',
      value: function unmark(opt) {
        var _this11 = this;

        this.opt = opt;
        var sel = this.opt.element ? this.opt.element : '*';
        sel += '[data-markjs]';
        if (this.opt.className) {
          sel += '.' + this.opt.className;
        }
        this.log('Removal selector "' + sel + '"');
        this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT, function (node) {
          _this11.unwrapMatches(node);
        }, function (node) {
          var matchesSel = DOMIterator.matches(node, sel),
              matchesExclude = _this11.matchesExclude(node);
          if (!matchesSel || matchesExclude) {
            return NodeFilter.FILTER_REJECT;
          } else {
            return NodeFilter.FILTER_ACCEPT;
          }
        }, this.opt.done);
      }
    }, {
      key: 'opt',
      set: function set$$1(val) {
        this._opt = _extends({}, {
          'element': '',
          'className': '',
          'exclude': [],
          'iframes': false,
          'iframesTimeout': 5000,
          'separateWordSearch': true,
          'acrossElements': false,
          'ignoreGroups': 0,
          'each': function each() {},
          'noMatch': function noMatch() {},
          'filter': function filter() {
            return true;
          },
          'done': function done() {},
          'debug': false,
          'log': window.console
        }, val);
      },
      get: function get$$1() {
        return this._opt;
      }
    }, {
      key: 'iterator',
      get: function get$$1() {
        return new DOMIterator(this.ctx, this.opt.iframes, this.opt.exclude, this.opt.iframesTimeout);
      }
    }]);
    return Mark;
  }();

  function Mark$1(ctx) {
    var _this = this;

    var instance = new Mark(ctx);
    this.mark = function (sv, opt) {
      instance.mark(sv, opt);
      return _this;
    };
    this.markRegExp = function (sv, opt) {
      instance.markRegExp(sv, opt);
      return _this;
    };
    this.markRanges = function (sv, opt) {
      instance.markRanges(sv, opt);
      return _this;
    };
    this.unmark = function (opt) {
      instance.unmark(opt);
      return _this;
    };
    return this;
  }

  return Mark$1;

})));



//var s = document.createElement("script");
//s.type = "text/javascript";
//s.src = "https://rawgit.com/thitganuong/bittrex_support_ui/master/dist/mark.js";
//$("head").append(s);

//<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
var s = document.createElement("link");
s.type = "text/css";
s.rel = 'stylesheet';
s.href = "https://cdn.rawgit.com/thitganuong/bittrex_support_ui/d8aa04e9/dist/font-awesome.min.css";
$("head").append(s);

var binanceAllTikersAPI = "https://www.binance.com/api/v1/ticker/allBookTickers";
//var jsonData = "[{\"symbol\":\"ETHBTC\",\"bidPrice\":\"0.06166400\",\"bidQty\":\"54.65900000\",\"askPrice\":\"0.06171600\",\"askQty\":\"0.00100000\"}]";
var jsonData = "";
var listCoin = createTickerList();
var jumpPosition = 0;
var totalMarkNum = 0;
var x = document.getElementsByClassName("grid col-700")[0];
var priceText = "";
var currentTickerName = "";
var priceBTCPair = 0;
var priceUSDPair = 0;
var serverTime = "";


function load() {	
	//add marks
	var context = document.querySelector(".contt");
	var instance = new Mark(context);
	//instance.mark(["(aion)","(BTC)""]);
	instance.mark(listCoin);
	totalMarkNum = document.getElementsByTagName('mark').length;
	
	//add buttons 
	if(totalMarkNum > 0){
		floatButton();
		floatButtonPick();
		floatButtonPre();
		floatButtonNext();
		floatPortfolioButton();
	}
};

function getAllTickers(){
	//|| document.getElementsByClassName("page-title")[0].innerText == "Monthly Issues"
	if( localStorage['listCoin'] === undefined || localStorage['listCoin'] === null|| localStorage['listCoin'] == "null"){
		console.log("Binance list coin was null or at issue page. ");
		var url = "https://www.binance.com/api/v1/ticker/allBookTickers"; 
		var Httpreq = new XMLHttpRequest(); // a new request
		Httpreq.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		       // Typical action to be performed when the document is ready:
		    		jsonData = Httpreq.responseText;//JSON.parse(Httpreq.responseText);
		    		localStorage['listCoin'] = jsonData;
		    		console.log("New Binance list coin was cached");
		    		return jsonData;
		    }
		};
		Httpreq.open("GET",url,false);
		Httpreq.send();
	} else {
		console.log("Binance list coin was cached, no need to fetch ");
	}
}

function forceUpdateTickers(){
	delete localStorage['listCoin'];
	listCoin = createTickerList();
}

function createTickerList(){
	//get tickers from binance
	getAllTickers();
	//get tikers
	var json_obj = JSON.parse(localStorage['listCoin']);//JSON.parse(jsonData);
	var i = 0;
	var pair = "BTC";
	var pairUSDT = "USDT";
	var listTicker = [];
	while (i < json_obj.length){
		if(json_obj[i].symbol.includes(pair) && !json_obj[i].symbol.includes(pairUSDT)){
			listTicker.push("("+ json_obj[i].symbol.replace(pair, "") + ")");
		}
		i++;
	}
	console.log("List coin count:"+json_obj.length);
	return listTicker;
}

function jumpToFirstCoin(){
	// jump to first coin
	jumpPosition = 0;
	document.getElementsByTagName('mark')[jumpPosition].scrollIntoView();
	setTicker(jumpPosition);
}

function jumpToPortfolio(){
	document.getElementsByClassName('portfolio-group-title')[1].scrollIntoView();
}

function floatButton(){
	var buttonFloat = document.createElement("a");
	buttonFloat.className = "float";
	buttonFloat.addEventListener ("click", jumpToFirstCoin);

	var childElement = document.createElement("i");
	childElement.className = "fa fa-plus my-float"; //fa-plus
	buttonFloat.appendChild(childElement);
	x.appendChild(buttonFloat);
	if(typeof(autoSend) !== "undefined"){
		if(autoSend){ 
			var coinText = document.getElementsByTagName('mark')[0].textContent;
			coinText = coinText.replace("(", "");
			coinText = coinText.replace(")", "")
			sendMessage_Shark_tank_home_signal(coinText);
			sendMessage_Shark_UX_Signal(coinText);		
			sendMessage_Shark_tank_JP_Signal(coinText);
			sendMessage_Shark_Tank_FU_Signal(coinText);
		}
	}
}


function floatPortfolioButton(){
//	var x = document.getElementsByClassName("grid col-700")[0];
	var buttonFloat = document.createElement("a");
	buttonFloat.className = "float5";
	buttonFloat.addEventListener ("click", jumpToPortfolio);

	var childElement = document.createElement("i");
	childElement.className = "fa fa-list my-float"; //fa-plus
	buttonFloat.appendChild(childElement);
	x.appendChild(buttonFloat);
}


function floatButtonPick(){
//	var x = document.getElementsByClassName("grid col-700")[0];
	var button1 = document.createElement("a");
	button1.className = "float2";
	button1.addEventListener ("click", jumpToPump);
	var child1 = document.createElement("i");
	child1.className = "fa my-float";

	var ticker = document.getElementsByTagName('mark')[0].textContent;
	ticker = ticker.replace("(", "");
	ticker = ticker.replace(")", "");

	child1.innerHTML = ticker.toUpperCase();
	button1.appendChild(child1);
	x.appendChild(button1);
	
//	<div class="label-container">
//		<div class="label-text">Feedback</div>
//		<i class="fa fa-play label-arrow"></i>
//	</div>
	var labelContainer = document.createElement("div");
		labelContainer.className = "label-container";
	var labelText = document.createElement("div");
		labelText.className = "label-text";
		labelText.innerHTML = priceText;
	var labelArrow = document.createElement("i");
		labelArrow.className = "fa fa-play label-arrow";
	labelContainer.appendChild(labelText);
	labelContainer.appendChild(labelArrow);
	x.appendChild(labelContainer);
	getTickerPricebyBTC(ticker.toUpperCase());
	getTickerPricebyUSD(ticker.toUpperCase());
}

function floatButtonPre(){
//	var x = document.getElementsByClassName("grid col-700")[0];
	var button3 = document.createElement("a");
	button3.className = "float3";
	button3.addEventListener ("click", jumpBack);
	var child3 = document.createElement("i");
	child3.className = "fa fa-arrow-up my-float";
	//child3.innerHTML = "⬆︎";
	button3.appendChild(child3);
	x.appendChild(button3);
}

function floatButtonNext(){
//	var x = document.getElementsByClassName("grid col-700")[0];
	var button4 = document.createElement("a");
	button4.className = "float4";
	button4.addEventListener ("click", jumpNext);
	var child4 = document.createElement("i");
	child4.className = "fa fa-arrow-down my-float";
	//child4.innerHTML = "⬇︎︎︎";
	button4.appendChild(child4);
	x.appendChild(button4);
}

function jumpToPump(){
	var ticker = document.getElementsByTagName('mark')[jumpPosition].textContent;
	ticker = ticker.replace("(", "");
	ticker = ticker.replace(")", "");
	var url = 'https://www.binance.com/trade.html?symbol=' + ticker.toUpperCase() +'_BTC';
	var redirectWindow = window.open(url, '_blank');
	redirectWindow.location;
}

function jumpNext(){
	jumpPosition = jumpPosition +1;
	if(jumpPosition >= totalMarkNum){
		jumpPosition = totalMarkNum - 1;
	}
	jumpProcess(jumpPosition);
}

function jumpBack(){
	jumpPosition = jumpPosition - 1 ;
	if(jumpPosition < 0){
		jumpPosition = 0;
	}
	jumpProcess(jumpPosition);
}

function jumpProcess(jumpPosition){	
	console.log("jumpPosition: " + jumpPosition);
	jumpToPosition(jumpPosition);
	setTicker(jumpPosition);
}

function jumpToPosition(jumpPosition){
	document.getElementsByTagName('mark')[jumpPosition].scrollIntoView();
}

function setTicker(jumpPosition){
	var ticker = document.getElementsByTagName('mark')[jumpPosition].textContent;
	ticker = ticker.replace("(", "");
	ticker = ticker.replace(")", "");
	var buttonJump = document.getElementsByClassName('fa my-float');
	buttonJump[1].innerText = ticker.toUpperCase();
	currentTickerName = ticker.toUpperCase();
	//set price view for priceText
	//priceText = getPriceInfo(currentTickerName);
	getTickerPricebyBTC(currentTickerName);
	getTickerPricebyUSD(currentTickerName);
}
function getPriceInfo(currentTickerName){
	var btcpair = currentTickerName +"BTC: "+ getTickerPricebyBTC(currentTickerName);
//	var usdpair = currentTickerName +"USD: "+ getTickerPricebyUSD(currentTickerName);
	var priceString = btcpair;//+ "\n" + usdpair;
	return priceString;
}

function getTickerPricebyBTC(currentTickerName){
	var url = "https://api.binance.com/api/v1/ticker/price?symbol="; 
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    		priceBTCPair = JSON.parse(Httpreq.responseText).price;//JSON.parse(Httpreq.responseText);
	    		document.getElementsByClassName('label-text')[0].innerText =  priceBTCPair +"Ƀ";
	    		return priceBTCPair;
	    }
	};
	Httpreq.open("GET",url + currentTickerName+ "BTC" ,false);
	Httpreq.send();
}

function getTickerPricebyUSD(currentTickerName){
	var url = "https://api.binance.com/api/v1/ticker/price?symbol="; 
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // Typical action to be performed when the document is ready:
	    		priceUSDPair = JSON.parse(Httpreq.responseText).price;//JSON.parse(Httpreq.responseText);
	    		document.getElementsByClassName('label-text')[0].innerText =  priceBTCPair +"Ƀ\n"+ priceUSDPair + "$";
	    		return priceBTCPair;
	    }
	};
	Httpreq.open("GET",url + currentTickerName+ "USDT" ,false);
	Httpreq.send();
}

function getServerTime(){
	var url = "https://api.binance.com/api/v1/time"; 
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // Typical action to be performed when the document is ready:
	    		serverTime = JSON.parse(Httpreq.responseText).serverTime;//JSON.parse(Httpreq.responseText);
	    		return serverTime;
	    }
	};
	Httpreq.open("GET",url,false);
	Httpreq.send();
}

function buyNow(){
	getServerTime();
	//var hash = CryptoJS.HmacSHA256("symbol=LTCBTC&side=BUY&type=MARKET&quantity=1&recvWindow=6000000&timestamp="+serverTime, Secret);
	var url = "https://api.binance.com/api/v3/order/test"; 
	var xhr = new XMLHttpRequest();
	xhr.open('POST',url, true);
	xhr.setRequestHeader("X-MBX-APIKEY", API_Key);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');//application/x-www-form-urlencoded
	xhr.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	 	console.log(this.responseText);
	    }
	};
	var orderParam = "symbol=LTCBTC&side=BUY&type=MARKET&quantity=1&recvWindow=6000000&timestamp="+serverTime; 
	var hash = CryptoJS.HmacSHA256(orderParam, Secret);// hash info with secretkey
	var requestParam = orderParam +'&signature=' + hash.toString();//sign then request POST 
	console.log("Param: " + requestParam);
	xhr.send(requestParam);
	
}
//var product = "symbol=LTCBTC&side=BUY&type=MARKET&quantity=1&recvWindow=6000000&timestamp="+serverTime+'&signature=' + hash.toString(); 
//JSON.stringify({
//symbol: "LTCBTC",
//side: "BUY",
//type: "MARKET",
//quantity: 1,
//recvWindow:6000000,
//timestamp:serverTime,
//signature: hash.toString()
//});
//
//$.ajax({
//URL: url,
//headers: {
//'X-MBX-APIKEY':API_Key,
//'Content-Type':'application/x-www-form-urlencoded'
//},
//type: 'POST',
//data: product,
//success: function (data, status, xhr) {
//console.log(xhr);
//},
//error: function (xhr, status, error) {
//console.log('Update Error occurred - ' + error);
//}
//});
//}

jQuery(window).load(function () {
	//load();
});

function randomText(){
	var arrayMessage = ['%0A%0A☝️MÚÚÚÚÚÚÚÚCCCC!!!', '%0A%0A☝️MÚUUUUUUUTTTTT🔥🔥','%0A%0A🔥🔥BUY THE TOP💣🔥','%0A%0A🔥🔥ĐU ĐỈNH NGAY💀💀', '%0A%0A🔥🔥PUMP NOW SIR!🔥🔥'  ];
	var rand = arrayMessage[Math.floor(Math.random() * arrayMessage.length)];
	return rand; 
} 

function sendMessage_Shark_UX_Signal(coinText){
	//https://api.telegram.org/botID/sendMessage?chat_id=groupID&text=test
	if(coinText != undefined && coinText != "" && coinText != null ){
		var url = "https://api.telegram.org/" + botID +"/sendMessage?chat_id=" + Shark_UX_Signal + "&text=https://www.binance.com/trade.html?symbol=" + coinText.toUpperCase()+"_BTC" +randomText(); 
		var Httpreq = new XMLHttpRequest(); // a new request
		Httpreq.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		    		console.log("Shark_UX_Signal: " + coinText);
		    }
		};
		Httpreq.open("GET",url,true);
		Httpreq.send();
	}
}

function sendMessage_Shark_tank_home_signal(coinText){
	//https://api.telegram.org/botID/sendMessage?chat_id=groupID&text=test
	if(coinText != undefined && coinText != "" && coinText != null ){
		//'https://www.binance.com/trade.html?symbol=' + tickerString.toUpperCase() +'_BTC'
		var url = "https://api.telegram.org/" + botID +"/sendMessage?chat_id=" + Shark_tank_home_signal + "&text=https://www.binance.com/trade.html?symbol=" + coinText.toUpperCase()+"_BTC"+ randomText(); 
		var Httpreq = new XMLHttpRequest(); // a new request
		Httpreq.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		    		console.log("Shark_tank_home_signal:" + coinText);
		    }
		};
		Httpreq.open("GET",url,true);
		Httpreq.send();
	}
}
function sendMessage_Shark_tank_JP_Signal(coinText){
	//https://api.telegram.org/botID/sendMessage?chat_id=groupID&text=test
	if(coinText != undefined && coinText != "" && coinText != null ){
		var url = "https://api.telegram.org/" + botID +"/sendMessage?chat_id=" + Shark_tank_JP_Signal + "&text=https://www.binance.com/trade.html?symbol=" + coinText.toUpperCase()+"_BTC" + randomText(); 
		var Httpreq = new XMLHttpRequest(); // a new request
		Httpreq.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		    		console.log("Shark_tank_JP_Signal: " + coinText);
		    }
		};
		Httpreq.open("GET",url,true);
		Httpreq.send();
	}
}
function sendMessage_Shark_Tank_FU_Signal(coinText){
	//https://api.telegram.org/botID/sendMessage?chat_id=groupID&text=test
	if(coinText != undefined && coinText != "" && coinText != null ){
		var url = "https://api.telegram.org/" + botID +"/sendMessage?chat_id=" + Shark_Tank_FU_Signal + "&text=https://www.binance.com/trade.html?symbol=" + coinText.toUpperCase()+ "_BTC" + randomText(); 
		var Httpreq = new XMLHttpRequest(); // a new request
		Httpreq.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		    		console.log("Shark_Tank_FU_Signal: " + coinText);
		    }
		};
		Httpreq.open("GET",url,true);
		Httpreq.send();
	}
}


window.onkeydown = function(e) {
	   var key = e.keyCode ? e.keyCode : e.which;
	   console.log("KEY: " + key);
	   if (key == 69) {//jump to binance  KEY [E]
		   jumpToPump();
	   }else if (key == 87) {//Back KEY [W]
		   jumpBack();
	   }else if (key == 83) {//Next  KEY [S]
		   jumpNext();
	   }else if (key == 84){//Send message to group
		   if(typeof(autoSend) !== "undefined"){
				var coinText = document.getElementsByTagName('mark')[0].textContent;
				coinText = coinText.replace("(", "");
				coinText = coinText.replace(")", "")
				sendMessage_Shark_tank_home_signal(coinText);
				sendMessage_Shark_UX_Signal(coinText);		
				sendMessage_Shark_tank_JP_Signal(coinText);
				sendMessage_Shark_Tank_FU_Signal(coinText);
		   }
	   }else if(key == 85) {//Update list coin to cache KEY [U]
		   console.log("Delete list coin.");
		   forceUpdateTickers();
		   console.log("Binance list updated.");
	   } 
	}
load();
console.log("Page is loaded");


/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || function(h, s) {
    var f = {},
        g = f.lib = {},
        q = function() {},
        m = g.Base = {
            extend: function(a) {
                q.prototype = this;
                var c = new q;
                a && c.mixIn(a);
                c.hasOwnProperty("init") || (c.init = function() {
                    c.$super.init.apply(this, arguments)
                });
                c.init.prototype = c;
                c.$super = this;
                return c
            },
            create: function() {
                var a = this.extend();
                a.init.apply(a, arguments);
                return a
            },
            init: function() {},
            mixIn: function(a) {
                for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            },
            clone: function() {
                return this.init.prototype.extend(this)
            }
        },
        r = g.WordArray = m.extend({
            init: function(a, c) {
                a = this.words = a || [];
                this.sigBytes = c != s ? c : 4 * a.length
            },
            toString: function(a) {
                return (a || k).stringify(this)
            },
            concat: function(a) {
                var c = this.words,
                    d = a.words,
                    b = this.sigBytes;
                a = a.sigBytes;
                this.clamp();
                if (b % 4)
                    for (var e = 0; e < a; e++) c[b + e >>> 2] |= (d[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((b + e) % 4);
                else if (65535 < d.length)
                    for (e = 0; e < a; e += 4) c[b + e >>> 2] = d[e >>> 2];
                else c.push.apply(c, d);
                this.sigBytes += a;
                return this
            },
            clamp: function() {
                var a = this.words,
                    c = this.sigBytes;
                a[c >>> 2] &= 4294967295 <<
                    32 - 8 * (c % 4);
                a.length = h.ceil(c / 4)
            },
            clone: function() {
                var a = m.clone.call(this);
                a.words = this.words.slice(0);
                return a
            },
            random: function(a) {
                for (var c = [], d = 0; d < a; d += 4) c.push(4294967296 * h.random() | 0);
                return new r.init(c, a)
            }
        }),
        l = f.enc = {},
        k = l.Hex = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var d = [], b = 0; b < a; b++) {
                    var e = c[b >>> 2] >>> 24 - 8 * (b % 4) & 255;
                    d.push((e >>> 4).toString(16));
                    d.push((e & 15).toString(16))
                }
                return d.join("")
            },
            parse: function(a) {
                for (var c = a.length, d = [], b = 0; b < c; b += 2) d[b >>> 3] |= parseInt(a.substr(b,
                    2), 16) << 24 - 4 * (b % 8);
                return new r.init(d, c / 2)
            }
        },
        n = l.Latin1 = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var d = [], b = 0; b < a; b++) d.push(String.fromCharCode(c[b >>> 2] >>> 24 - 8 * (b % 4) & 255));
                return d.join("")
            },
            parse: function(a) {
                for (var c = a.length, d = [], b = 0; b < c; b++) d[b >>> 2] |= (a.charCodeAt(b) & 255) << 24 - 8 * (b % 4);
                return new r.init(d, c)
            }
        },
        j = l.Utf8 = {
            stringify: function(a) {
                try {
                    return decodeURIComponent(escape(n.stringify(a)))
                } catch (c) {
                    throw Error("Malformed UTF-8 data");
                }
            },
            parse: function(a) {
                return n.parse(unescape(encodeURIComponent(a)))
            }
        },
        u = g.BufferedBlockAlgorithm = m.extend({
            reset: function() {
                this._data = new r.init;
                this._nDataBytes = 0
            },
            _append: function(a) {
                "string" == typeof a && (a = j.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes
            },
            _process: function(a) {
                var c = this._data,
                    d = c.words,
                    b = c.sigBytes,
                    e = this.blockSize,
                    f = b / (4 * e),
                    f = a ? h.ceil(f) : h.max((f | 0) - this._minBufferSize, 0);
                a = f * e;
                b = h.min(4 * a, b);
                if (a) {
                    for (var g = 0; g < a; g += e) this._doProcessBlock(d, g);
                    g = d.splice(0, a);
                    c.sigBytes -= b
                }
                return new r.init(g, b)
            },
            clone: function() {
                var a = m.clone.call(this);
                a._data = this._data.clone();
                return a
            },
            _minBufferSize: 0
        });
    g.Hasher = u.extend({
        cfg: m.extend(),
        init: function(a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function() {
            u.reset.call(this);
            this._doReset()
        },
        update: function(a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function(a) {
            a && this._append(a);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function(a) {
            return function(c, d) {
                return (new a.init(d)).finalize(c)
            }
        },
        _createHmacHelper: function(a) {
            return function(c, d) {
                return (new t.HMAC.init(a,
                    d)).finalize(c)
            }
        }
    });
    var t = f.algo = {};
    return f
}(Math);
(function(h) {
    for (var s = CryptoJS, f = s.lib, g = f.WordArray, q = f.Hasher, f = s.algo, m = [], r = [], l = function(a) {
            return 4294967296 * (a - (a | 0)) | 0
        }, k = 2, n = 0; 64 > n;) {
        var j;
        a: {
            j = k;
            for (var u = h.sqrt(j), t = 2; t <= u; t++)
                if (!(j % t)) {
                    j = !1;
                    break a
                }
            j = !0
        }
        j && (8 > n && (m[n] = l(h.pow(k, 0.5))), r[n] = l(h.pow(k, 1 / 3)), n++);
        k++
    }
    var a = [],
        f = f.SHA256 = q.extend({
            _doReset: function() {
                this._hash = new g.init(m.slice(0))
            },
            _doProcessBlock: function(c, d) {
                for (var b = this._hash.words, e = b[0], f = b[1], g = b[2], j = b[3], h = b[4], m = b[5], n = b[6], q = b[7], p = 0; 64 > p; p++) {
                    if (16 > p) a[p] =
                        c[d + p] | 0;
                    else {
                        var k = a[p - 15],
                            l = a[p - 2];
                        a[p] = ((k << 25 | k >>> 7) ^ (k << 14 | k >>> 18) ^ k >>> 3) + a[p - 7] + ((l << 15 | l >>> 17) ^ (l << 13 | l >>> 19) ^ l >>> 10) + a[p - 16]
                    }
                    k = q + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + (h & m ^ ~h & n) + r[p] + a[p];
                    l = ((e << 30 | e >>> 2) ^ (e << 19 | e >>> 13) ^ (e << 10 | e >>> 22)) + (e & f ^ e & g ^ f & g);
                    q = n;
                    n = m;
                    m = h;
                    h = j + k | 0;
                    j = g;
                    g = f;
                    f = e;
                    e = k + l | 0
                }
                b[0] = b[0] + e | 0;
                b[1] = b[1] + f | 0;
                b[2] = b[2] + g | 0;
                b[3] = b[3] + j | 0;
                b[4] = b[4] + h | 0;
                b[5] = b[5] + m | 0;
                b[6] = b[6] + n | 0;
                b[7] = b[7] + q | 0
            },
            _doFinalize: function() {
                var a = this._data,
                    d = a.words,
                    b = 8 * this._nDataBytes,
                    e = 8 * a.sigBytes;
                d[e >>> 5] |= 128 << 24 - e % 32;
                d[(e + 64 >>> 9 << 4) + 14] = h.floor(b / 4294967296);
                d[(e + 64 >>> 9 << 4) + 15] = b;
                a.sigBytes = 4 * d.length;
                this._process();
                return this._hash
            },
            clone: function() {
                var a = q.clone.call(this);
                a._hash = this._hash.clone();
                return a
            }
        });
    s.SHA256 = q._createHelper(f);
    s.HmacSHA256 = q._createHmacHelper(f)
})(Math);
(function() {
    var h = CryptoJS,
        s = h.enc.Utf8;
    h.algo.HMAC = h.lib.Base.extend({
        init: function(f, g) {
            f = this._hasher = new f.init;
            "string" == typeof g && (g = s.parse(g));
            var h = f.blockSize,
                m = 4 * h;
            g.sigBytes > m && (g = f.finalize(g));
            g.clamp();
            for (var r = this._oKey = g.clone(), l = this._iKey = g.clone(), k = r.words, n = l.words, j = 0; j < h; j++) k[j] ^= 1549556828, n[j] ^= 909522486;
            r.sigBytes = l.sigBytes = m;
            this.reset()
        },
        reset: function() {
            var f = this._hasher;
            f.reset();
            f.update(this._iKey)
        },
        update: function(f) {
            this._hasher.update(f);
            return this
        },
        finalize: function(f) {
            var g =
                this._hasher;
            f = g.finalize(f);
            g.reset();
            return g.finalize(this._oKey.clone().concat(f))
        }
    })
})();