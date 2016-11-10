import {INCREMENT_PRODUCT, DECREMENT_PRODUCT} from '../constants/actionTypes';

export default function rootReducer(state = {}, action) {
  switch (action.type) {
    case INCREMENT_PRODUCT:
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.product]: state.cart[action.product]+ 1,
        },
      };
    case DECREMENT_PRODUCT:
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.product]: state.cart[action.product] - 1,
        },
      };
    default:
      return state;
  }
}
