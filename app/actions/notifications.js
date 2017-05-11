import update from 'immutability-helper';

import {PATH_NOTIFICATIONS} from '../state/notifications';


export const addNotification = (message, level) => ({
  type: 'Add notification',
  path: PATH_NOTIFICATIONS,
  payload: {message, level},
  reducer: (state, {message, level}) => update(state, {
    message: {$set: message},
    level: {$set: level},
  }),
});

export const clearNotification = () => ({
  type: 'Clear notification',
  path: PATH_NOTIFICATIONS,
  payload: {},
  reducer: (state) => update(state, {
    message: {$set: ''},
    level: {$set: ''},
  }),
});
