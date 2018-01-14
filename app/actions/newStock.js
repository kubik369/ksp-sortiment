import update from 'immutability-helper';

import {PATH_NEW_STOCK} from '../state/newStock';

export const changeBarcode = (barcode) => ({
  type: 'Change new stock barcode',
  path: PATH_NEW_STOCK,
  payload: {barcode},
  reducer: (state, {barcode}) => update(state, {
    barcode: {$set: barcode},
  }),
});

export const changeName = (name) => ({
  type: 'Change new stock name',
  path: PATH_NEW_STOCK,
  payload: {name},
  reducer: (state, {name}) => update(state, {
    name: {$set: name},
  }),
});

export const changePrice = (price) => ({
  type: 'Change new stock price',
  path: PATH_NEW_STOCK,
  payload: {price},
  reducer: (state, {price}) => update(state, {
    price: {$set: price},
  }),
});

export const changeQuantity = (quantity) => ({
  type: 'Change new stock quantity',
  path: PATH_NEW_STOCK,
  payload: {quantity},
  reducer: (state, {quantity}) => update(state, {
    quantity: {$set: quantity},
  }),
});
