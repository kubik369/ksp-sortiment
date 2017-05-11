import {forwardReducerTo, compose} from './utils';
import {setInitialShopState} from './state/shop';
import {setInitialNotificationsState} from './state/notifications';
import {setInitialRegistrationState} from './state/registration';
import {setInitialLoginState} from './state/login';
import {setInitialNewStockState} from './state/newStock';

export const getInitialState = () => compose(
  setInitialShopState,
  setInitialNotificationsState,
  setInitialRegistrationState,
  setInitialLoginState,
  setInitialNewStockState,
)({});

export const rootReducer = (state = getInitialState(), action) => {
  if (action.type === 'CLEAR') {
    state = getInitialState();
  }
  if (!action.reducer) {
    return;
  }
  return forwardReducerTo(action.reducer, action.path)(state, action.payload);
};
