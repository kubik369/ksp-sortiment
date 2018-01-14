import axios from 'axios';
import update from 'immutability-helper';

import {addNotification} from './notifications';
import {PATH_SHOP} from '../state/shop';

export const addToCart = (product) => ({
  type: 'Add product to cart',
  path: PATH_SHOP,
  payload: {product},
  reducer: (state, {product}) => update(state, {
    cart: {
      [product]: {$apply: (quantity) => (quantity || 0) + 1},
    },
  }),
});

export const removeFromCart = (product) => ({
  type: 'Remove product to cart',
  path: PATH_SHOP,
  payload: {product},
  reducer: (state, {product}) => update(state, {
    cart: {
      [product]: {$apply: (quantity) => quantity - 1},
    },
  }),
});

export const emptyCart = () => ({
  type: 'Empty the cart',
  path: PATH_SHOP,
  payload: {},
  reducer: (state) => update(state, {
    cart: {$set: {}},
  }),
});

export const loadingUsers = (loading) => ({
  type: 'Set loading users',
  path: PATH_SHOP,
  payload: {loading},
  reducer: (state, {loading}) => update(state, {
    users: {
      fetching: {$set: loading},
    },
  }),
});

export const storeUsers = (response) => ({
  type: 'Store users',
  path: PATH_SHOP,
  payload: {response},
  reducer: (state, {response: {data: {users}}}) => update(state, {
    users: {
      fetching: {$set: false},
      data: {$set: users},
    },
  }),
});

export const loadingProducts = (loading) => ({
  type: 'Set loading products',
  path: PATH_SHOP,
  payload: {loading},
  reducer: (state, {loading}) => update(state, {
    products: {
      fetching: {$set: loading},
    },
  }),
});

export const storeProducts = (response) => ({
  type: 'Store products',
  path: PATH_SHOP,
  payload: {response},
  reducer: (state, {response: {data: {products}}}) => update(state, {
    products: {
      fetching: {$set: false},
      data: {$set: products},
    },
  }),
});

export const setProcessingPurchase = (processing, method) => ({
  type: 'Processing purchase',
  path: PATH_SHOP,
  payload: {processing, method},
  reducer: (state, {processing, method}) => update(state, {
    processingPurchase: {
      [method]: {$set: processing},
    },
  }),
});

export const goToPage = (page) => ({
  type: 'Go to page',
  path: PATH_SHOP,
  payload: {page},
  reducer: (state, {page}) => update(state, {
    currentPage: {$set: page},
  }),
});

export const loadUsers = () => (dispatch, getState) => {
  dispatch(loadingUsers(true));
  return axios.get('/users')
    .then((res) => dispatch(storeUsers(res)))
    .catch((err) => {
      dispatch(loadingUsers(false));
      dispatch(addNotification(`Users could not be loaded: ${err}`, 'error'));
    });
};

export const loadProducts = () => (dispatch, getState) => {
  dispatch(loadingProducts(true));
  return axios.get('/products')
    .then((res) => dispatch(storeProducts(res)))
    .catch((err) => {
      dispatch(loadingProducts(false));
      dispatch(addNotification(`Users could not be loaded: ${err}`, 'error'));
    });
};
