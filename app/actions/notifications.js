import {ADD_NOTIFICATION, CLEAR_NOTIFICATION} from '../constants/actionTypes';

export const addNotification = (message, level) => ({
  type: ADD_NOTIFICATION,
  message,
  level,
});

export const clearNotification = () => ({
  type: CLEAR_NOTIFICATION,
});
