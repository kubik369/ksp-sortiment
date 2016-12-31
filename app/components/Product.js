import React, {Component} from 'react';
import {Container, Row, Col} from 'react-grid-system';

import './Product.css';

export class Product extends Component {
  render() {
    const {id, productInfo, quantity, addToCart} = this.props;
    const stockLeft = productInfo.stock - quantity;

    if (!productInfo.stock) {
      return null;
    }

    return (
      <div styleName={'product'}>
        <Container>
          <Row>
            <Col lg={12} sm={12}>
              <div styleName={'label'}>{productInfo.label}</div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} sm={12}>
              <img
                styleName={'image'}
                src={`/images/${productInfo.label}.jpg`}
                onClick={() => (quantity + 1 <= productInfo.stock) && addToCart(id)}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12} sm={12}>
              <div styleName={'price'}>{`${productInfo.price.toFixed(2)}€`}</div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} sm={12}>
              <div styleName={'stock'}>{`${stockLeft}ks`}</div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
