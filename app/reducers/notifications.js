import {ADD_NOTIFICATION, CLEAR_NOTIFICATION} from '../constants/actionTypes';
import update from 'immutability-helper';

export const PATH_NOTIFICATIONS = ['notifications'];

export default function notification(state = {}, action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return update(state, {
        message: {$set: action.message},
        level: {$set: action.level},
      });

    case CLEAR_NOTIFICATION:
      return update(state, {
        message: {$set: ''},
        level: {$set: ''},
      });

    default:
      return state;
  }
}
