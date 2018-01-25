import {set} from 'object-path-immutable';
// defines a single 'segment' of the application state
// along with it's PATH in applciation state

// each *State.js file should define PATH, initialState and setInitialState functions

// path is an array handled by getIn / setIn (or lodash's get/set)
export const PATH_LOGIN = ['login'];

export const initialState = {
  loggedIn: false,
  search: '',
  username: '',
};

export const setInitialLoginState = (state) =>
  set(state, PATH_LOGIN, initialState);
