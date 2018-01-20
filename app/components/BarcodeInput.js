import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  FormControl, FormGroup, InputGroup, Button, Glyphicon,
} from 'react-bootstrap';

export class BarcodeInput extends Component {

  componentWillMount() {
    this.state = {barcode: ''};
  }

  handleOnChange = (e) => {
    const {target: {value: barcode}} = e;
    const {action, isBarcodeValid} = this.props;

    if (isBarcodeValid(barcode)) {
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

export default BarcodeInput;
