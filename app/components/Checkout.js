import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import axios from 'axios';
import {Button, ButtonGroup, Glyphicon, Grid, Row, Col, Panel} from 'react-bootstrap';
import Spinner from 'react-spinner';

import {removeFromCart, loadUsers, loadProducts, setProcessingPurchase} from '../actions/shop';
import {logout} from '../actions/login';
import {addNotification} from '../actions/notifications';
import {PATH_LOGIN} from '../state/login';
import {PATH_SHOP} from '../state/shop';

import './Checkout.css';

class Checkout extends Component {

  componentWillMount = () => {
    this.props.loadUsers();
    this.props.loadProducts();
  }

  isTransactionInvalid = () => {
    const {cart, processingPurchase} = this.props;
    const cartTotalItems = Object.values(cart)
      .reduce((total, item) => total + item);

    return (
      cartTotalItems === 0
      || processingPurchase.credit
      || processingPurchase.cash
    );
  }

  willOverdraft = () => {
    const {cart, balance, products} = this.props;
    let cartPrice = 0;
    for (const barcode in cart) {
      if (products.hasOwnProperty(barcode)) {
        cartPrice += products[barcode].price * cart[barcode];
      }
    }
    return balance - cartPrice < 0;
  }

  checkout = (useCredit) => {
    const {
      cart, userId, loadUsers, loadProducts, logout, addNotification,
      setProcessingPurchase,
    } = this.props;
    const purchaseMethod = useCredit ? 'credit' : 'cash';

    // empty cart
    if (this.isTransactionInvalid()) {
      addNotification('Neplatná/chybná zamietnutá.', 'error');
      return;
    }
    if (purchaseMethod === 'credit' && this.willOverdraft()) {
      addNotification('Nemáš dosť kreditu na tento nákup.', 'error');
      return;
    }

    setProcessingPurchase(true, purchaseMethod);

    axios
      .post('/buy', {cart, userId, useCredit})
      .then(() => {
        loadUsers();
        loadProducts();
        addNotification('Nákup úspešný :)', 'success');
        setProcessingPurchase(false, purchaseMethod);
        logout();
      })
      .catch((err) => {
        console.error('Error during checkout:', err);
        setProcessingPurchase(false, purchaseMethod);
        addNotification('Chýba počas nákupu!', 'error');
      });
  }

  renderCartItem = (barcode) => {
    const {cart, products, removeFromCart} = this.props;

    return (cart[barcode] > 0) && (
      <div styleName={'cartItem'} className="container-fluid" key={barcode}>
        <Row>
          <Row>
            <Col xs={5}>
              <b><i>{products[barcode].name}</i></b>
            </Col>
            <Col xs={3}>
              <Row>
                <Row>
                  {`${cart[barcode]} ks`}
                </Row>
                <Row>
                  {`${(cart[barcode] * products[barcode].price).toFixed(2)} €`}
                </Row>
              </Row>
            </Col>
            <Col xs={4}>
              <Button onClick={() => cart[barcode] > 0 && removeFromCart(barcode)}>
                <Glyphicon glyph={'remove'} />
              </Button>
            </Col>
          </Row>
        </Row>
      </div>
    );
  }

  renderCart = () => {
    const {cart, products} = this.props;
    const total = Object.values(products)
      .reduce((total, {barcode, price}) => (
        total + price * (cart[barcode] || 0)
      ), 0);
    const cartItems = Object.keys(cart).map(this.renderCartItem);

    return (
      <Panel style={{padding: 0}} styleName="cart">
        <Panel.Heading>
          <b>Košík</b> - Total: {total.toFixed(2)}€
        </Panel.Heading>
        <Panel.Body styleName="cartContents">
          {cartItems}
        </Panel.Body>
      </Panel>
    );
  }

  renderCheckout = () => {
    const {processingPurchase} = this.props;

    return (
      <Row styleName="checkoutButtons">
        <Col xs={12}>
          <ButtonGroup justified>
            <ButtonGroup>
              <Button bsStyle={'primary'} onClick={() => this.checkout(true)}>
                {processingPurchase.credit ? <Spinner /> : 'Kredit'}
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button bsStyle={'primary'} onClick={() => this.checkout()}>
                {processingPurchase.cash ? <Spinner /> : 'Cash'}
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </Col>
      </Row>
    );
  }

  render() {
    if (!this.props.loggedIn) {
      return null;
    }

    return (
      <div styleName={'checkout'}>
        <Grid
          fluid
          style={{
            padding: '0',
            maxHeight: '600px',
          }}>
          {this.renderCart()}
          {this.renderCheckout()}
        </Grid>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    loggedIn: get(state, [...PATH_LOGIN, 'loggedIn']),
    userId: get(state, [...PATH_LOGIN, 'userId'], -1),
    users: get(state, [...PATH_SHOP, 'users', 'data']),
    cart: get(state, [...PATH_SHOP, 'cart']),
    products: get(state, [...PATH_SHOP, 'products', 'data']),
    fetchingProducts: get(state, [...PATH_SHOP, 'products', 'fetching']),
    balance: get(
      state,
      [...PATH_SHOP, 'users', 'data', get(state, [...PATH_LOGIN, 'userId']), 'balance'],
      0
    ),
    processingPurchase: get(state, [...PATH_SHOP, 'processingPurchase']),
  }),
  (dispatch) => bindActionCreators(
    {
      loadUsers,
      loadProducts,
      removeFromCart,
      logout,
      addNotification,
      setProcessingPurchase,
    },
    dispatch
  )
)(Checkout);
