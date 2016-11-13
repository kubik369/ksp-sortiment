import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
} from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers/reducers';
import {processSteps} from '../constants/enums/steps';

const initialState = {
  username: '',
  balance: '',
  currentStep: processSteps.welcome,
  cart: {},
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
