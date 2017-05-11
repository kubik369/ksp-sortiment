import {set} from 'object-path-immutable';
import {pages} from '../constants/enums/pages';
// defines a single 'segment' of the application state
// along with it's PATH in applciation state

// each *State.js file should define PATH, initialState and setInitialState functions

// path is an array handled by getIn / setIn (or lodash's get/set)
export const PATH_SHOP = ['shop'];

export const initialState = {
  currentPage: pages.welcome,
  addCredit: '',
  cart: {},
  users: {
    fetching: false,
    data: {},
  },
  products: {
    fetching: false,
    data: {},
  },
  processingPurchase: {
    credit: false,
    cash: false,
  },
};

export const setInitialShopState = (state) =>
  set(state, PATH_SHOP, initialState);
