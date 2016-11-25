import React, {Component} from 'react';
import {Container, Row, Col} from 'react-grid-system';

import SortimentC from '../containers/Sortiment';
import CheckoutC from '../containers/Checkout';
import LoginC from '../containers/Login';
import NewStockC from '../containers/NewStock';

export class App extends Component {
  render() {
    const {addingStock, loggedIn} = this.props;

    return (
      <Container>
        <Row>
          <h1>Tu raz bude ceeeellyyyy sortiment</h1>
        </Row>
        <Row>
          <Col lg={2}>
            <LoginC />
          </Col>
          {addingStock &&
            <Col lg={10}>
              <NewStockC />
            </Col>}
          {(loggedIn && !addingStock) &&
            <div>
              <Col lg={5}>
                <SortimentC />
              </Col>
              <Col lg={5}>
                <CheckoutC />
              </Col>
            </div>
          }
          {!loggedIn &&
            <Col lg={5}>
              <p>Sign in in order to start shopping</p>
            </Col>
          }
        </Row>
      </Container>
    );
  }
}
