import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {addToCart} from '../actions/shop';
import {PATH_SHOP} from '../state/shop';
import {mergeProps} from '../utils';

import './Product.css';

class Product extends Component {
  replaceMissingImage = ({target}) => {
    target.onerror = null;
    target.src = 'images/404.jpg';
  }

  render() {
    const {barcode, productInfo, quantity, actions: {addToCart}} = this.props;
    const stockLeft = productInfo.stock - quantity;

    if (!productInfo.stock) {
      return null;
    }

    return (
      <div styleName={'product'}>
        <div
          styleName={'label'}
          style={{fontSize: productInfo.name.length > 15 ? '0.75em' : '1em'}}
        >
          {productInfo.name}
        </div>
        <div styleName={'image-row'}>
          <img
            styleName={'image'}
            src={`/images/${barcode}.jpg`}
            alt={'Image not found'}
            onError={this.replaceMissingImage}
            onClick={() => (quantity + 1 <= productInfo.stock) && addToCart(barcode)}
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
  (state, {barcode}) => ({
    quantity: get(state, [...PATH_SHOP, 'cart', barcode], 0),
    productInfo: get(state, [...PATH_SHOP, 'products', 'data', barcode]),
  }),
  (dispatch) => bindActionCreators({addToCart}, dispatch),
  mergeProps
)(Product);
