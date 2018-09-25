
const initialState = {
  myLibraries: [],
  searchMode: 'list'
}

export function searchCompareAppReducer(state=initialState, action) {
  switch(action.type) {
    case 'ADD_LIBRARY': 
      return Object.assign({}, state, { myLibraries: [...state.myLibraries, action.id] })
    case 'REMOVE_LIBRARY':
      return Object.assign({}, state, { myLibraries: state.myLibraries.filter(id => id !== action.id) })
    case 'TOGGLE_SEARCH_MODE':
      return Object.assign({}, state, {searchMode: (state.searchMode === 'list') ? 'table' : 'list'})
    default: 
      return Object.assign({}, state)
  }
}
