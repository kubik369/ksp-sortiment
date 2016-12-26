import React, {Component} from 'react';
import {Container, Row, Col} from 'react-grid-system';

import SortimentC from '../containers/Sortiment';
import CheckoutC from '../containers/Checkout';
import LoginC from '../containers/Login';
import NewStockC from '../containers/NewStock';
import AddCreditC from '../containers/AddCredit';

import './App.css';

export class App extends Component {
  render() {
    const {addingStock, loggedIn} = this.props;

    return (
      <Container>
        <Row>
          <h1 styleName="title">Tu raz bude ceeeellyyyy sortiment</h1>
        </Row>
        <Row id={'profile-info'}>
          <Col lg={2}>
            <LoginC />
          </Col>
          {loggedIn &&
            <Col lg={4}>
              <AddCreditC />
            </Col>
          }
        </Row>
        <Row>
          {addingStock &&
            <Col lg={12}>
              <NewStockC />
            </Col>}
          {(loggedIn && !addingStock) &&
            <div>
              <Col lg={9}>
                <SortimentC />
              </Col>
              <Col lg={3}>
                <CheckoutC />
              </Col>
            </div>
          }
          {!loggedIn &&
            <Col lg={12}>
              <p>Sign in in order to start shopping</p>
            </Col>
          }
        </Row>
      </Container>
    );
  }
}
