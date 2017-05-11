import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {addToCart} from '../actions/shop';
import {PATH_SHOP} from '../reducers/shop';

import './Product.css';

class Product extends Component {
  render() {
    const {id, productInfo, quantity, addToCart} = this.props;
    const stockLeft = productInfo.stock - quantity;
    console.log(stockLeft, productInfo.stock, quantity);
    if (!productInfo.stock) {
      return null;
    }

    return (
      <div styleName={'product'}>
        <div styleName={'label'}>{productInfo.label}</div>
        <div styleName={'image-row'}>
          <img
            styleName={'image'}
            src={`/images/${productInfo.label}.jpg`}
            onClick={() => (quantity + 1 <= productInfo.stock) && addToCart(id)}
          />
        </div>
        <div styleName={'price-row'}>
          <span styleName={'price'}>{`${productInfo.price.toFixed(2)}€`}</span>
          <span styleName={'stock'}>{`${stockLeft}ks`}</span>
        </div>
      </div>
    );
  }
}

export default connect(
  (state, {id}) => ({
    quantity: get(state, [...PATH_SHOP, 'cart', id], 0),
    productInfo: get(state, [...PATH_SHOP, 'products', 'data', id]),
  }),
  (dispatch) => bindActionCreators({addToCart}, dispatch)
)(Product);
