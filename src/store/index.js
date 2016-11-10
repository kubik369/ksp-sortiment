import {createStore} from 'redux';

import rootReducer from '../reducers/reducers';

const initialState = {
  buyer: '',
  cart: {
    horalka: 0,
    sojovyRez: 0,
  },
  products: {
    horalka: {
      label: 'Horalka',
      price: '0.30e',
      image: 'http://sedita.sk/media/images/1397468672-y6aze2-7.png',
    },
    sojovyRez: {
      label: 'Sójový rez',
      price: '0.25e',
      image: null,
    }
  },
};

export const store = createStore(rootReducer, initialState);