import React, {Component} from 'react';
import axios from 'axios';
import {Button, Glyphicon, Grid, Row, Col} from 'react-bootstrap';

import './Checkout.css';

export class Checkout extends Component {

  componentWillMount = () => {
    this.props.fetchUsers();
    this.props.fetchProducts();
  }

  checkout = () => {
    const {cart, username, fetchUsers, fetchProducts} = this.props;

    // empty cart
    if (Object.values(cart).reduce((total, item) => total + item) === 0) {
      return;
    }

    axios
      .post('/buy', {cart: cart, username: username})
      .then(() => {
        fetchUsers();
        fetchProducts();
        window.alert('Purchase successful'); // eslint-disable-line no-alert
      })
      .catch((err) => console.error('Error during checkout:', err));
  }

  render() {
    const {cart, products, loggedIn, removeFromCart} = this.props;

    if (!loggedIn) {
      return null;
    }

    const total = Object.values(products)
      .reduce((total, product) => total + product.price * cart[product.id], 0);

    return (
      <div styleName={'checkout'}>
        <Grid fluid style={{padding: 0}}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <h2>Checkout</h2>
            </Col>
          </Row>
          <Row>
            <Col lg={8} md={8} sm={8}>Total: {total.toFixed(2)}€</Col>
            <Col lg={4} md={4} sm={4}>
              <Button bsStyle={'primary'} onClick={() => this.checkout()}>Buy</Button>
            </Col>
          </Row>
          <h2>Košík</h2>
          <div styleName={'cart'}>
            {Object.keys(cart).map(
              (id) => (cart[id] > 0) &&
                (<div styleName={'cartItem'} key={id}>
                  <Row>
                    <Col lg={6} md={6} sm={6}>{products[id].label}</Col>
                    <Col lg={2} md={2} sm={2}>{cart[id]}</Col>
                    <Col lg={4} md={4} sm={4}>
                      <Button>
                        <Glyphicon glyph={'remove'} onClick={() => cart[id] > 0 && removeFromCart(id)} />
                      </Button>
                    </Col>
                  </Row>
                </div>)
            )}
          </div>
        </Grid>
      </div>
    );
  }
}
