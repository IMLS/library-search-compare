
const initialState = {
  myLibraries: []
}

export function searchCompareAppReducer(state=initialState, action) {
  switch(action.type) {
    case 'ADD_LIBRARY': 
      return Object.assign({}, state, { myLibraries: [...new Set([...state.myLibraries, action.id])] })
    case 'REMOVE_LIBRARY':
      return Object.assign({}, state, { myLibraries: state.myLibraries.filter(id => id !== action.id) })
    default: 
      return Object.assign({}, state)
  }
}
