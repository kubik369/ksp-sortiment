import {get} from 'lodash';

import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  GO_TO_PAGE,
  FETCHING_USERS,
  RECEIVED_USERS,
  FETCHING_PRODUCTS,
  RECEIVED_PRODUCTS,
  START_ADDING_NEW_STOCK,
  STOP_ADDING_NEW_STOCK,
  CHANGE_NEW_STOCK_ID,
  CHANGE_NEW_STOCK_SEARCH,
  CHANGE_NEW_STOCK_QUANTITY,
  CHANGE_NEW_STOCK_PRICE,
  CHANGE_NEW_STOCK_IMAGE_CHECKBOX,
  SEARCH_USERNAME,
  LOG_IN,
  LOG_OUT,
  CHANGE_BALANCE,
  REGISTRATION_CHANGE_USERNAME,
  REGISTRATION_CHANGE_BALANCE,
} from '../constants/actionTypes';

import {pages} from '../constants/enums/pages';

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

    case GO_TO_PAGE:
      return {
        ...state,
        currentPage: action.page,
      };

    case SEARCH_USERNAME:
      return {
        ...state,
        login: {
          ...state.login,
          search: action.username,
        },
      };

    case LOG_IN:
      return {
        ...state,
        login: {
          loggedIn: true,
          username: action.username,
        },
        currentPage: pages.store,
      };

    case LOG_OUT:
      return {
        ...state,
        login: {
          loggedIn: false,
          search: '',
          username: '',
        },
        currentPage: pages.welcome,
      };

    case REGISTRATION_CHANGE_USERNAME:
      return {
        ...state,
        registration: {
          ...state.registration,
          username: action.username,
        },
      };

    case REGISTRATION_CHANGE_BALANCE:
      return {
        ...state,
        registration: {
          ...state.registration,
          balance: action.balance,
        },
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
        },
      };

    case RECEIVED_USERS:
      return {
        ...state,
        users: {
          fetching: false,
          data: action.users,
        },
      };

    case FETCHING_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          fetching: true,
        },
      };

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
        },
      };

    case START_ADDING_NEW_STOCK:
      return {
        ...state,
        newStock: {
          ...state.newStock,
          active: true,
        },
      };

    case STOP_ADDING_NEW_STOCK:
      return {
        ...state,
        newStock: {
          ...state.newStock,
          active: false,
        },
      };

    case CHANGE_NEW_STOCK_ID:
      return {
        ...state,
        newStock: {
          ...state.newStock,
          id: action.id,
        },
      };

    case CHANGE_NEW_STOCK_SEARCH:
      return {
        ...state,
        newStock: {
          ...state.newStock,
          search: action.text,
        },
      };

    case CHANGE_NEW_STOCK_QUANTITY:
      return {
        ...state,
        newStock: {
          ...state.newStock,
          quantity: action.quantity,
        },
      };

    case CHANGE_NEW_STOCK_PRICE:
      return {
        ...state,
        newStock: {
          ...state.newStock,
          price: action.price,
        },
      };

    case CHANGE_NEW_STOCK_IMAGE_CHECKBOX:
      return {
        ...state,
        newStock: {
          ...state.newStock,
          uploadImage: action.checkbox,
        },
      };

    default:
      return state;
  }
}
