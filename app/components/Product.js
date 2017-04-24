import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {Grid, Row, Col} from 'react-bootstrap';

import {addToCart} from '../actions/actions';
import {PATH_SHOP} from '../reducers/shop';

import './Product.css';

class Product extends Component {
  render() {
    const {id, productInfo, quantity, addToCart} = this.props;
    const stockLeft = productInfo.stock - quantity;

    if (!productInfo.stock) {
      return null;
    }

    return (
      <div styleName={'product'}>
        <Grid fluid>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div styleName={'label'}>{productInfo.label}</div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <img
                styleName={'image'}
                src={`/images/${productInfo.label}.jpg`}
                onClick={() => (quantity + 1 <= productInfo.stock) && addToCart(id)}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div styleName={'price'}>{`${productInfo.price.toFixed(2)}€`}</div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div styleName={'stock'}>{`${stockLeft}ks`}</div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default connect(
  (state, props) => ({
    quantity: get(state, [...PATH_SHOP, 'cart', props.id]),
    productInfo: get(state, [...PATH_SHOP, 'products', 'data', props.id]),
  }),
  (dispatch) => bindActionCreators({addToCart}, dispatch)
)(Product);
