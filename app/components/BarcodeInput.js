import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {
  FormControl, FormGroup, InputGroup, Button, Glyphicon,
} from 'react-bootstrap';

import {addNotification} from '../actions/notifications';
import {PATH_SHOP} from '../state/shop';
import {mergeProps} from '../utils';

export class BarcodeInput extends Component {

  componentWillMount() {
    this.state = {barcode: ''};
  }

  haveStock = (barcode) => {
    const {products, cart} = this.props;
    const cartAmount = get(cart, [barcode], 0);
    return barcode && cartAmount + 1 <= products[barcode].stock;
  }

  handleOnChange = (e) => {
    const {target: {value: barcode}} = e;
    const {action, isBarcodeValid, actions: {addNotification}} = this.props;

    if (isBarcodeValid(barcode)) {
      if (!this.haveStock(barcode)) {
        addNotification('Tovar už nie je. Nájdi kubika.', 'error');
        return;
      }
      action(barcode);
      this.setState({barcode: ''});
    } else {
      this.setState({barcode});
    }
  }

  render() {
    return (
      <FormGroup>
        <InputGroup>
          <FormControl
            type={'text'}
            value={this.state.barcode}
            onChange={this.handleOnChange}
            placeholder={this.props.placeholder}
            autoFocus
            style={{marginBottom: 0}}
          />
          <InputGroup.Button>
            <Button><Glyphicon glyph="remove" /></Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    );
  }
}

BarcodeInput.propTypes = {
  action: PropTypes.func,
  isBarcodeValid: PropTypes.func,
  placeholder: PropTypes.string,
};

export default connect(
  (state) => ({
    cart: get(state, [...PATH_SHOP, 'cart'], {}),
    products: get(state, [...PATH_SHOP, 'products', 'data']),
  }),
  (dispatch) => bindActionCreators({
    addNotification,
  }, dispatch),
  mergeProps
)(BarcodeInput);
