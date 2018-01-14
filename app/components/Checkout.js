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

  checkout = (useCredit) => {
    const {cart, userId, loadUsers, loadProducts, logout, addNotification,
      processingPurchase} = this.props;
    const purchaseMethod = useCredit ? 'credit' : 'cash';

    // empty cart
    if (Object.values(cart).reduce((total, item) => total + item) === 0
      || processingPurchase.credit || processingPurchase.cash) {
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

  renderCart = () => {
    const {cart, products, removeFromCart} = this.props;
    return Object.keys(cart).map(
      (id) => (cart[id] > 0) &&
        (<div styleName={'cartItem'} key={id}>
          <Row>
            <Row>
              <Col xs={12}>{products[id].name}</Col>
            </Row>
            <Row>
              <Col xs={6}>{`${cart[id]} ks`}</Col>
              <Col xs={6}>
                <Button onClick={() => cart[id] > 0 && removeFromCart(id)}>
                  <Glyphicon glyph={'remove'} />
                </Button>
              </Col>
            </Row>
          </Row>
        </div>)
    );
  }

  renderCheckout = () => {
    const {processingPurchase, cart, products} = this.props;

    const total = Object.values(products)
      .reduce((total, {barcode, price}) => (
        total + price * (cart[barcode] || 0)
      ), 0);

    return (
      <Panel style={{padding: 0}}>
        <Row>
          <Col xs={12}>
            <h2>Checkout</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>Total: {total.toFixed(2)}€</Col>
        </Row>
        <Row>
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
      </Panel>
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
            marginTop: '20px',
          }}>
          {this.renderCheckout()}
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
      [...PATH_SHOP, 'users', 'data', get(state, [...PATH_LOGIN, 'username']), 'balance'],
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
