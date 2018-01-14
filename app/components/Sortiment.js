import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {Grid, Row, Col, Panel} from 'react-bootstrap';

import {loadProducts} from '../actions/shop';
import {PATH_SHOP} from '../state/shop';
import {mergeProps} from '../utils';
import Product from './Product';
import Checkout from './Checkout';

class Sortiment extends Component {
  componentWillMount = () => {
    this.props.actions.loadProducts();
  }

  render() {
    const products = Object.keys(this.props.products.data).map(
      (key) => (this.props.products.data[key].stock > 0) && (
        <Col xs={4} key={key}>
          <Product barcode={key} />
        </Col>
      )
    );

    return (
      <Grid fluid>
        <Row>
          <Col xs={9} style={{
            maxHeight: '560px', overflowY: 'auto', marginTop: '20px', marginBottom: '20px',
          }}>
            <Panel>{products}</Panel>
          </Col>
          <Col xs={3}>
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
    {loadProducts},
    dispatch
  ),
  mergeProps
)(Sortiment);
