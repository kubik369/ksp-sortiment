import axios from 'axios';

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
  START_PROCESSING_PURCHASE,
  STOP_PROCESSING_PURCHASE,
  RESET_ADD_CREDIT,
} from '../constants/actionTypes';

export function addToCart(product) {
  return {
    type: ADD_TO_CART,
    product,
  };
}

export function removeFromCart(product) {
  return {
    type: REMOVE_FROM_CART,
    product,
  };
}

export function goToPage(page) {
  return {
    type: GO_TO_PAGE,
    page,
  };
}

export function searchUsername(username) {
  return {
    type: SEARCH_USERNAME,
    username: username.trim(),
  };
}

export function changeRegistrationUsername(username) {
  return {
    type: REGISTRATION_CHANGE_USERNAME,
    username: username.trim(),
  };
}

export function changeRegistrationBalance(balance) {
  return {
    type: REGISTRATION_CHANGE_BALANCE,
    balance,
  };
}

export function logIn(username) {
  return {
    type: LOG_IN,
    username: username.trim(),
  };
}

export function logOut() {
  return {
    type: LOG_OUT,
  };
}

export function changeBalance(balance) {
  return {
    type: CHANGE_BALANCE,
    balance,
  };
}

export function resetAddCredit() {
  return {
    type: RESET_ADD_CREDIT,
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
  };
}

export function receiveUsers(users) {
  return {
    type: RECEIVED_USERS,
    users: users.reduce((res, item) => ({...res, [item.username]: item}), {}),
  };
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
  };
}

export function receiveProducts(data) {
  const products = data.reduce((res, item) => ({...res, [item.id]: item}), {});
  const cart = Object.values(products).reduce(
    (cart, product) => ({...cart, [product.id]: 0}),
    {}
  );
  return {
    type: RECEIVED_PRODUCTS,
    products,
    cart,
  };
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
    id,
  };
}

export function changeNewStockSearch(search) {
  return {
    type: CHANGE_NEW_STOCK_SEARCH,
    search,
  };
}

export function changeNewStockQuantity(quantity) {
  return {
    type: CHANGE_NEW_STOCK_QUANTITY,
    quantity: quantity,
  };
}

export function changeNewStockPrice(price) {
  return {
    type: CHANGE_NEW_STOCK_PRICE,
    price,
  };
}

export function changeNewStockImageCheckbox(checkbox) {
  return {
    type: CHANGE_NEW_STOCK_IMAGE_CHECKBOX,
    checkbox,
  };
}

export function startProcessingPurchase(method) {
  return {
    type: START_PROCESSING_PURCHASE,
    method,
  };
}

export function stopProcessingPurchase(method) {
  return {
    type: STOP_PROCESSING_PURCHASE,
    method,
  };
}
