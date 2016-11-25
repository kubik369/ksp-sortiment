import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
} from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers/reducers';

const initialState = {
  login: {
    loggedIn: false,
    search: '',
    username: '',
  },
  balance: '',
  cart: {},
  newStock: {
    active: false,
    id: '',
    search: '',
    quantity: 1,
    price: 0,
  },
  users: {
    fetching: false,
    data: {},
  },
  products: {
    fetching: false,
    data: {},
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
