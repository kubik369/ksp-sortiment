import update from 'immutability-helper';

import {initialState, PATH_REGISTRATION} from '../state/registration';

export const changeUsername = (username) => ({
  type: 'Registration: change username',
  path: PATH_REGISTRATION,
  payload: {username},
  reducer: (state, {username}) => update(state, {
    username: {$set: username},
  }),
});

export const changeBalance = (balance) => ({
  type: 'Registration: change balance',
  path: PATH_REGISTRATION,
  payload: {balance},
  reducer: (state, {balance}) => update(state, {
    balance: {$set: balance},
  }),
});

export const clearForm = () => ({
  type: 'Registration: change balance',
  path: PATH_REGISTRATION,
  payload: {},
  reducer: (state) => update(state, {$set: initialState}),
});
