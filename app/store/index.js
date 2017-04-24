import {
  createStore,
  compose,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import {pages} from '../constants/enums/pages';

const initialState = {
  shop: {
    login: {
      loggedIn: false,
      search: '',
      username: '',
    },
    currentPage: pages.welcome,
    balance: '',
    cart: {},
    newStock: {
      active: false,
      id: '',
      search: '',
      quantity: 1,
      price: 0,
      uploadImage: false,
    },
    registration: {
      username: '',
      balance: 0,
    },
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
  },
  notifications: {
    message: '',
    level: '',
  },
};

export const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
  )
);
