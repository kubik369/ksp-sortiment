import {INCREMENT_PRODUCT, DECREMENT_PRODUCT} from '../constants/actionTypes';

export function increment(product) {
  return {
    type: INCREMENT_PRODUCT,
    product: product,
  };
}

export function decrement(product) {
  return {
    type: DECREMENT_PRODUCT,
    product: product,
  };
}
