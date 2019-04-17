import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {Grid, Row, Col, Panel} from 'react-bootstrap';

import {addToCart, loadProducts} from '../actions/shop';
import {PATH_SHOP} from '../state/shop';
import {mergeProps} from '../utils';
import BarcodeInput from './BarcodeInput';
import Product from './Product';

class Sortiment extends Component {
  componentWillMount = () => {
    this.props.actions.loadProducts();
  }

  isBarcodeProduct = (barcode) => barcode in this.props.products

  renderBarcodeInput = () => (
    <div style={{width: '50%', marginLeft: 'auto', marginRight: 'auto'}}>
      <BarcodeInput
        isBarcodeValid={this.isBarcodeProduct}
        action={this.props.actions.addToCart}
        placeholder={'Barcode'}
      />
    </div>
  )

  render() {
    const products = Object.keys(this.props.products).map(
      (key) => (this.props.products[key].stock > 0) && (
        <Col xs={2} key={key} style={{padding: 0}}>
          <Product barcode={key} />
        </Col>
      )
    );

    return (
      <Grid fluid>
        <Row>
          <Col xs={12} style={{
            maxHeight: '560px',
            overflowY: 'auto',
            marginTop: '20px',
            marginBottom: '20px',
          }}>
            <Panel>
              <Panel.Heading>
                {this.renderBarcodeInput()}
              </Panel.Heading>
              <Panel.Body>
                {products}
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  (state) => ({
    products: get(state, [...PATH_SHOP, 'products', 'data']),
  }),
  (dispatch) => bindActionCreators(
    {loadProducts, addToCart},
    dispatch
  ),
  mergeProps
)(Sortiment);
