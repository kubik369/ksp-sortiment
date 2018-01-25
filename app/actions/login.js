import Promise from 'bluebird';
import update from 'immutability-helper';
import {get} from 'lodash';

import {goToPage, emptyCart} from './shop';
import {pages} from '../constants/enums/pages';
import {addNotification} from './notifications';
import {PATH_LOGIN} from '../state/login';
import {PATH_SHOP} from '../state/shop';

export const searchUsername = (username) => ({
  type: 'Set search for login',
  path: PATH_LOGIN,
  payload: {username},
  reducer: (state, {username}) => update(state, {
    search: {$set: username},
  }),
});

const loginUser = (userId) => ({
  type: 'Login',
  path: PATH_LOGIN,
  payload: {userId},
  reducer: (state, {userId}) => update(state, {
    loggedIn: {$set: true},
    userId: {$set: userId},
    search: {$set: ''},
  }),
});

const logoutUser = () => ({
  type: 'Logout',
  path: PATH_LOGIN,
  payload: {},
  reducer: (state) => update(state, {
    loggedIn: {$set: false},
    userId: {$set: ''},
  }),
});

export const login = (userId) => (dispatch, getState) => {
  const users = get(getState(), [...PATH_SHOP, 'users', 'data'], {});

  if (userId in users) {
    Promise.resolve(dispatch(loginUser(userId)))
      .then(() => dispatch(goToPage(pages.store)));
  } else {
    dispatch(addNotification('Error during login, user missing', 'error'));
  }
};

export const logout = () => (dispatch) => {
  Promise.resolve(dispatch(logoutUser()))
    .then(() => dispatch(emptyCart()))
    .then(() => dispatch(goToPage(pages.welcome)));
};
