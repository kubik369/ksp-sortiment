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

export const changeSearchText = (search) => ({
  type: 'Change new stock search text',
  path: PATH_NEW_STOCK,
  payload: {search},
  reducer: (state, {search}) => update(state, {
    search: {$set: search},
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

export const toggleImageUpload = (checkbox) => ({
  type: 'Change new stock image upload checkbox',
  path: PATH_NEW_STOCK,
  payload: {checkbox},
  reducer: (state, {checkbox}) => update(state, {
    uploadImage: {$set: checkbox},
  }),
});
