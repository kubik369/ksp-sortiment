import axios from 'axios';

import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  GO_TO_STEP,
  FETCHING_USERS,
  RECEIVED_USERS,
  FETCH_PRODUCTS,
  FETCHING_PRODUCTS,
  RECEIVED_PRODUCTS,
  CHANGE_USERNAME,
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

export function changeUsername(username) {
  return {
    type: CHANGE_USERNAME,
    username: username.trim(),
  };
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
