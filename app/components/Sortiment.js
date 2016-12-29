import React, {Component} from 'react';
import {Grid, Row, Col, Panel} from 'react-bootstrap';

import ProductC from '../containers/Product';
import CheckoutC from '../containers/Checkout';

export class Sortiment extends Component {
  componentWillMount = () => {
    this.props.fetchProducts();
  }

  render() {
    const products = Object.keys(this.props.products.data).map(
      (key) => this.props.products.data[key].stock > 0 && <Col lg={4} sm={4} key={key}><ProductC id={key} /></Col>
    );

    return (
      <Grid fluid>
        <Row>
          <Col lg={9} md={9} sm={9}
            style={{
              maxHeight: '560px',
              overflowY: 'auto',
              marginTop: '20px',
              marginBottom: '20px',
            }}
            ><Panel>{products}</Panel></Col>
          <Col lg={3} md={3} sm={3}><CheckoutC /></Col>
        </Row>
      </Grid>
    );
  }
}
