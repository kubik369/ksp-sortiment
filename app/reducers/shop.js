import {get} from 'lodash';
import update from 'immutability-helper';

import * as AT from '../constants/actionTypes';

import {pages} from '../constants/enums/pages';

export const PATH_SHOP = ['shop'];

export default function shopReducer(state = {}, action) {
  switch (action.type) {
    case AT.ADD_TO_CART:
      return update(state, {
        cart: {
          [action.product]: {$set: get(state, `cart[${action.product}]`, 0) + 1},
        },
      });

    case AT.REMOVE_FROM_CART:
      return update(state, {
        cart: {
          [action.product]: {$set: get(state, `cart[${action.product}]`, 0) - 1},
        },
      });

    case AT.GO_TO_PAGE:
      return update(state, {
        currentPage: {$set: action.page},
      });

    case AT.SEARCH_USERNAME:
      return update(state, {
        login: {
          search: {$set: action.username},
        },
      });

    case AT.LOG_IN:
      return update(state, {
        login: {
          loggedIn: {$set: true},
          username: {$set: action.username},
        },
        registration: {
          username: {$set: ''},
          balance: {$set: 0},
        },
        currentPage: {$set: pages.store},
      });

    case AT.LOG_OUT:
      return update(state, {
        login: {
          loggedIn: {$set: false},
          search: {$set: ''},
          username: {$set: ''},
        },
        currentPage: {$set: pages.welcome},
      });

    case AT.REGISTRATION_CHANGE_USERNAME:
      return update(state, {
        registration: {
          username: {$set: action.username},
        },
      });

    case AT.REGISTRATION_CHANGE_BALANCE:
      return update(state, {
        registration: {
          balance: {$set: action.balance},
        },
      });

    case AT.CHANGE_BALANCE:
      return update(state, {
        balance: {$set: action.balance},
      });

    case AT.RESET_ADD_CREDIT:
      return update(state, {
        balance: {$set: 0},
      });

    case AT.FETCHING_USERS:
      return update(state, {
        users: {
          fetching: {$set: true},
        },
      });

    case AT.RECEIVED_USERS:
      return update(state, {
        users: {
          fetching: {$set: false},
          data: {$set: action.users},
        },
      });

    case AT.FETCHING_PRODUCTS:
      return update(state, {
        products: {
          fetching: {$set: true},
        },
      });

    case AT.RECEIVED_PRODUCTS:
      return update(state, {
        cart: {$merge: action.cart},
        products: {
          fetching: {$set: false},
          data: {$set: action.products},
        },
      });

    case AT.CHANGE_NEW_STOCK_ID:
      return update(state, {
        newStock: {
          id: {$set: action.id},
        },
      });

    case AT.CHANGE_NEW_STOCK_SEARCH:
      return update(state, {
        newStock: {
          search: {$set: action.search},
        },
      });

    case AT.CHANGE_NEW_STOCK_QUANTITY:
      return update(state, {
        newStock: {
          quantity: {$set: action.quantity},
        },
      });

    case AT.CHANGE_NEW_STOCK_PRICE:
      return update(state, {
        newStock: {
          price: {$set: action.price},
        },
      });

    case AT.CHANGE_NEW_STOCK_IMAGE_CHECKBOX:
      return update(state, {
        newStock: {
          uploadImage: {$set: action.checkbox},
        },
      });

    case AT.START_PROCESSING_PURCHASE:
      return update(state, {
        processingPurchase: {
          [action.method === 'cash' ? 'cash' : 'credit']: {$set: true},
        },
      });

    case AT.STOP_PROCESSING_PURCHASE:
      return update(state, {
        processingPurchase: {
          [action.method === 'cash' ? 'cash' : 'credit']: {$set: false},
        },
      });

    default:
      return state;
  }
}
