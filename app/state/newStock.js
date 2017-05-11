import {set} from 'object-path-immutable';
// defines a single 'segment' of the application state
// along with it's PATH in applciation state

// each *State.js file should define PATH, initialState and setInitialState functions

// path is an array handled by getIn / setIn (or lodash's get/set)
export const PATH_NEW_STOCK = ['newStock'];

export const initialState = {
  active: false,
  barcode: '',
  search: '',
  quantity: 1,
  price: 0,
  uploadImage: false,
};

export const setInitialNewStockState = (state) =>
  set(state, PATH_NEW_STOCK, initialState);
