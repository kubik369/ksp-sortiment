import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {Grid, Row, Col, Panel} from 'react-bootstrap';

import {fetchProducts} from '../actions/actions';
import {PATH_SHOP} from '../reducers/shop';
import Product from './Product';
import Checkout from './Checkout';

class Sortiment extends Component {
  componentWillMount = () => {
    this.props.fetchProducts();
  }

  render() {
    const products = Object.keys(this.props.products.data).map(
      (key) => (this.props.products.data[key].stock > 0) && (
        <Col lg={4} sm={4} key={key}>
          <Product id={key} />
        </Col>
      )
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
          <Col lg={3} md={3} sm={3}>
            <Checkout />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  (state) => ({
    products: get(state, [...PATH_SHOP, 'products']),
  }),
  (dispatch) => bindActionCreators(
    {fetchProducts},
    dispatch
  )
)(Sortiment);
