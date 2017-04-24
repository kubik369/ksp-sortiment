import {combineReducers} from 'redux';
import shopReducer from './shop';
import notificationReducer from './notifications';

const rootReducer = combineReducers({
  shop: shopReducer,
  notifications: notificationReducer,
});

export default rootReducer;
