import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import axios from 'axios';
import {Button, ButtonGroup, Glyphicon, Grid, Row, Col, Panel} from 'react-bootstrap';
import Spinner from 'react-spinner';

import {
  fetchUsers,
  changeBalance,
  fetchProducts,
  removeFromCart,
  changeNewStockId,
  changeNewStockSearch,
  changeNewStockQuantity,
  logOut,
  startProcessingPurchase,
  stopProcessingPurchase
} from '../actions/actions';
import {addNotification} from '../actions/notifications';
import {PATH_SHOP} from '../reducers/shop';

import './Checkout.css';

export class Checkout extends Component {

  componentWillMount = () => {
    this.props.fetchUsers();
    this.props.fetchProducts();
  }

  checkout = (useCredit) => {
    const {cart, username, fetchUsers, fetchProducts, logOut,
      addNotification, startProcessingPurchase, stopProcessingPurchase} = this.props;
    const purchaseMethod = useCredit ? 'credit' : 'cash';

    // empty cart
    if (Object.values(cart).reduce((total, item) => total + item) === 0) {
      return;
    }

    startProcessingPurchase(purchaseMethod);

    axios
      .post('/buy', {cart, username, useCredit})
      .then(() => {
        fetchUsers();
        fetchProducts();
        addNotification('Nákup úspešný :)', 'success');
        stopProcessingPurchase(purchaseMethod);
        logOut();
      })
      .catch((err) => {
        console.error('Error during checkout:', err);
        stopProcessingPurchase(purchaseMethod);
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

  renderCheckout = () => {
    const {processingPurchase, cart, products} = this.props;

    const total = Object.values(products)
      .reduce((total, product) => total + product.price * cart[product.id], 0);

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
            {/* Full width buttons, see http://www.w3schools.com/bootstrap/bootstrap_button_groups.asp
              'Justified Button Groups' example #2*/}
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
    )
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
    loggedIn: get(state, [...PATH_SHOP, 'login', 'loggedIn']),
    username: get(state, [...PATH_SHOP, 'login', 'username'], 'No user selected'),
    users: get(state, [...PATH_SHOP, 'users', 'data']),
    cart: get(state, [...PATH_SHOP, 'cart']),
    products: get(state, [...PATH_SHOP, 'products', 'data']),
    fetchingProducts: get(state, [...PATH_SHOP, 'products', 'fetching']),
    balance: get(state, [...PATH_SHOP, 'users', 'data', get(state, [...PATH_SHOP, 'login', 'username'], ''), 'balance'], 0),
    newStock: get(state, [...PATH_SHOP, 'newStock']),
    processingPurchase: get(state, [...PATH_SHOP, 'processingPurchase']),
  }),
  (dispatch) => bindActionCreators(
    {
      fetchUsers,
      changeBalance,
      fetchProducts,
      removeFromCart,
      changeNewStockId,
      changeNewStockSearch,
      changeNewStockQuantity,
      logOut,
      addNotification,
      startProcessingPurchase,
      stopProcessingPurchase,
    },
    dispatch
  )
)(Checkout);
