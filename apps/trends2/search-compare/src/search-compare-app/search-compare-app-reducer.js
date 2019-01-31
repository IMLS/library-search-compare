define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.searchCompareAppReducer = searchCompareAppReducer;
  var initialState = {
    myLibraries: [],
    searchMode: 'list'
  };

  function searchCompareAppReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case 'ADD_LIBRARY':
        return Object.assign({}, state, {
          myLibraries: babelHelpers.toConsumableArray(state.myLibraries).concat([action.id])
        });

      case 'REMOVE_LIBRARY':
        return Object.assign({}, state, {
          myLibraries: state.myLibraries.filter(function (id) {
            return id !== action.id;
          })
        });

      case 'TOGGLE_SEARCH_MODE':
        return Object.assign({}, state, {
          searchMode: state.searchMode === 'list' ? 'table' : 'list'
        });

      default:
        return Object.assign({}, state);
    }
  }
});