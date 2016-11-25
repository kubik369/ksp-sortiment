import axios from 'axios';

import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  GO_TO_STEP,
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
  SEARCH_USERNAME,
  LOG_IN,
  LOG_OUT,
  CHANGE_BALANCE,
} from '../constants/actionTypes';

export function addToCart(product) {
  return {
    type: ADD_TO_CART,
    product: product,
  };
}

export function removeFromCart(product) {
  return {
    type: REMOVE_FROM_CART,
    product: product,
  };
}

export function goToStep(step) {
  return {
    type: GO_TO_STEP,
    step: step,
  };
}

export function searchUsername(username) {
  return {
    type: SEARCH_USERNAME,
    username: username.trim(),
  };
}

export function logIn(username) {
  return {
    type: LOG_IN,
    username: username.trim(),
  }
}

export function logOut() {
  return {
    type: LOG_OUT,
  }
}

export function changeBalance(balance) {
  return {
    type: CHANGE_BALANCE,
    balance: balance,
  };
}

export function fetchUsers() {
  return (dispatch) => {
    dispatch(fetchingUsers);
    return axios.get('/users')
      .then((res) => dispatch(receiveUsers(res.data.users)));
  };
}

export function fetchingUsers() {
  return {
    type: FETCHING_USERS,
  }
}

export function receiveUsers(users) {
  return {
    type: RECEIVED_USERS,
    users: users.reduce((res, item) => ({...res, [item.username]: item}), {}),
  }
}

export function fetchProducts() {
  return (dispatch) => {
    dispatch(fetchingProducts);
    return axios.get('/products')
      .then((res) => dispatch(receiveProducts(res.data.products)));
  };
}

export function fetchingProducts() {
  return {
    type: FETCHING_PRODUCTS,
  }
}

export function receiveProducts(products) {
  return {
    type: RECEIVED_PRODUCTS,
    products: products.reduce((res, item) => ({...res, [item.id]: item}), {}),
  }
}

export function startAddingNewStock() {
  return {
    type: START_ADDING_NEW_STOCK,
  };
}

export function stopAddingNewStock() {
  return {
    type: STOP_ADDING_NEW_STOCK,
  };
}

export function changeNewStockId(id) {
  return {
    type: CHANGE_NEW_STOCK_ID,
    id: id,
  }
}

export function changeNewStockSearch(text) {
  return {
    type: CHANGE_NEW_STOCK_SEARCH,
    text: text,
  }
}

export function changeNewStockQuantity(quantity) {
  return {
    type: CHANGE_NEW_STOCK_QUANTITY,
    quantity: quantity,
  }
}

export function changeNewStockPrice(price) {
  return {
    type: CHANGE_NEW_STOCK_PRICE,
    price: price,
  }
}