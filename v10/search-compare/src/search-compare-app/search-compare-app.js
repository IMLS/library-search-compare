define(["../../node_modules/@polymer/polymer/polymer-element.js", "./imls-table.js"], function (_polymerElement, _imlsTable) {
  "use strict";

  function _templateObject_9d642760b07c11e89593092ec8c12b51() {
    var data = babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: block;\n        }\n      </style>\n      <h2>Hello [[prop1]]!</h2>\n    "]);

    _templateObject_9d642760b07c11e89593092ec8c12b51 = function _templateObject_9d642760b07c11e89593092ec8c12b51() {
      return data;
    };

    return data;
  }

  /**
   * @customElement
   * @polymer
   */
  var SearchCompareApp =
  /*#__PURE__*/
  function (_PolymerElement) {
    babelHelpers.inherits(SearchCompareApp, _PolymerElement);

    function SearchCompareApp() {
      babelHelpers.classCallCheck(this, SearchCompareApp);
      return babelHelpers.possibleConstructorReturn(this, (SearchCompareApp.__proto__ || Object.getPrototypeOf(SearchCompareApp)).apply(this, arguments));
    }

    babelHelpers.createClass(SearchCompareApp, null, [{
      key: "template",
      get: function get() {
        return (0, _polymerElement.html)(_templateObject_9d642760b07c11e89593092ec8c12b51());
      }
    }, {
      key: "properties",
      get: function get() {
        return {
          prop1: {
            type: String,
            value: 'search-compare-app'
          }
        };
      }
    }]);
    return SearchCompareApp;
  }(_polymerElement.PolymerElement);

  window.customElements.define('search-compare-app', SearchCompareApp);
});