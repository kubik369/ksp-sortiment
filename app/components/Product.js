import React, {Component} from 'react';
import {Container, Row, Col} from 'react-grid-system';

export class Product extends Component {
  render() {
    const {id, productInfo, quantity, addToCart, removeFromCart} = this.props;
    const stockLeft = productInfo.stock - quantity;

    if (!productInfo.stock) {
      return null;
    }

    return (
      <Container>
        <Row>
          <Col lg={8}>
            <img
              src={`/images/${productInfo.id}.jpg`}
              style={{maxWidth: '150px', cursor: 'pointer'}}
              onClick={() => (quantity + 1 <= productInfo.stock) && addToCart(id)}
            />
          </Col>
          <Col lg={4}>
            <p>{productInfo.label}</p>
            <p>{`${productInfo.price}€`}</p>
            {`${stockLeft} ks left`}
          </Col>
        </Row>
      </Container>
    );
  }
}
