import React, {Component} from 'react';
import axios from 'axios';
import {Button, ButtonGroup, Glyphicon, Grid, Row, Col, Panel} from 'react-bootstrap';

import './Checkout.css';

export class Checkout extends Component {

  componentWillMount = () => {
    this.props.fetchUsers();
    this.props.fetchProducts();
  }

  checkout = (useCredit) => {
    const {cart, username, fetchUsers, fetchProducts, logOut} = this.props;

    // empty cart
    if (Object.values(cart).reduce((total, item) => total + item) === 0) {
      return;
    }

    axios
      .post('/buy', {cart, username, useCredit})
      .then(() => {
        fetchUsers();
        fetchProducts();
        window.alert('Purchase successful'); // eslint-disable-line no-alert
        logOut();
      })
      .catch((err) => console.error('Error during checkout:', err));
  }

  renderCart = () => {
    const {cart, products, removeFromCart} = this.props;
    return Object.keys(cart).map(
      (id) => (cart[id] > 0) &&
        (<div styleName={'cartItem'} key={id}>
          <Row>
            <Row>
              <Col lg={12} md={12} sm={12}>{products[id].label}</Col>
            </Row>
            <Row>
              <Col lg={6} md={6} sm={6}>{`${cart[id]} ks`}</Col>
              <Col lg={6} md={6} sm={6}>
                <Button>
                  <Glyphicon glyph={'remove'} onClick={() => cart[id] > 0 && removeFromCart(id)} />
                </Button>
              </Col>
            </Row>
          </Row>
        </div>)
    );
  }

  render() {
    const {cart, products, loggedIn} = this.props;

    if (!loggedIn) {
      return null;
    }

    const total = Object.values(products)
      .reduce((total, product) => total + product.price * cart[product.id], 0);

    return (
      <div styleName={'checkout'}>
        <Grid
          fluid
          style={{
            padding: '0',
            maxHeight: '600px',
            marginTop: '20px',
          }}>
          <Panel style={{padding: 0}}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <h2>Checkout</h2>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>Total: {total.toFixed(2)}€</Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                {/*
                    Following code is required to show the buttons on full width
                    see http://www.w3schools.com/bootstrap/bootstrap_button_groups.asp
                    section 'Justified Button Groups' example #2
                */}
                <ButtonGroup justified>
                  <ButtonGroup>
                    <Button bsStyle={'primary'} onClick={() => this.checkout(true)}>Kredit</Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button bsStyle={'primary'} onClick={() => this.checkout()}>Cash</Button>
                  </ButtonGroup>
                </ButtonGroup>
              </Col>
            </Row>
          </Panel>
          <Panel style={{padding: 0}}>
            <div styleName={'cart'}>
              <Grid fluid>
                <Row><h2>Košík</h2></Row>
                {this.renderCart()}
              </Grid>
            </div>
          </Panel>
        </Grid>
      </div>
    );
  }
}
