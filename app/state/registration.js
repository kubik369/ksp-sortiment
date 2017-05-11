import {set} from 'object-path-immutable';
// defines a single 'segment' of the application state
// along with it's PATH in applciation state

// each *State.js file should define PATH, initialState and setInitialState functions

// path is an array handled by getIn / setIn (or lodash's get/set)
export const PATH_REGISTRATION = ['registration'];

export const initialState = {
  username: '',
  balance: 0,
};

export const setInitialRegistrationState = (state) =>
  set(state, PATH_REGISTRATION, initialState);
