import {get, set} from 'lodash';

import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  GO_TO_STEP,
  FETCHING_USERS,
  RECEIVED_USERS,
  FETCHING_PRODUCTS,
  RECEIVED_PRODUCTS,
  CHANGE_USERNAME,
  CHANGE_BALANCE,
} from '../constants/actionTypes';

export default function rootReducer(state = {}, action) {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.product]: get(state, `cart[${action.product}]`, 0) + 1,
        },
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.product]: get(state, `cart[${action.product}]`, 0) - 1,
        },
      };

    case GO_TO_STEP:
      return {
        ...state,
        currentStep: action.step,
      };

    case CHANGE_USERNAME:
      return {
        ...state,
        username: action.username,
      };

    case CHANGE_BALANCE:
      return {
        ...state,
        balance: action.balance,
      };

    case FETCHING_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          fetching: true,
        }
      };
      return state;

    case RECEIVED_USERS:
      return {
        ...state,
        users: {
          fetching: false,
          data: action.users,
        }
      };

    case FETCHING_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          fetching: true,
        }
      };
      return state;

    case RECEIVED_PRODUCTS:
      return {
        ...state,
        cart: {
          ...state.cart,
          ...Object.values(action.products).reduce(
            (cart, product) => ({...cart, [product.id]: 0}),
            {}
          ),
        },
        products: {
          fetching: false,
          data: action.products,
        }
      };

    default:
      return state;
  }
}
