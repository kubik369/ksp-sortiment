import React, {Component} from 'react';
import axios from 'axios';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {
  Row, Col, FormControl, Button, ControlLabel, Panel,
} from 'react-bootstrap';
import Spinner from 'react-spinner';

import {changeBarcode} from '../actions/newStock';
import {addNotification} from '../actions/notifications';
import {PATH_SHOP} from '../state/shop';
import {PATH_NEW_STOCK} from '../state/newStock';

import {mergeProps} from '../utils';

class ProductImageUpload extends Component {

  componentWillMount = () => {
    this.state = {uploadingImage: false};
  }

  setUploadingImage = (state) => this.setState({uploadingImage: state})

  setBarcode = ({target: {value}}) => this.props.actions.changeBarcode(value)

  uploadImage = (e) => {
    e.preventDefault();
    const {
      newStock: {barcode}, products,
      actions: {addNotification},
    } = this.props;
    const file = e.target.image.files[0];

    if (!(barcode in products)) {
      addNotification('Zadali ste neexistujúci barcode', 'error');
      return;
    }
    // activate spinner on submit button
    this.setUploadingImage(true);

    const upload = new FormData();
    upload.append('image', file);
    upload.append('barcode', barcode);

    axios.post('/uploadProductImage', upload)
      .then(() => {
        addNotification('Obrázok bol úspešne uploadnutý :)', 'success');
        this.setUploadingImage(false);
      }).catch((err) => {
        console.error('Error during re-stock:', err);
        addNotification('Nebolo možné uploadnuť obrázok :(', 'error');
        this.setUploadingImage(false);
      });
  }

  renderSubmitButton = () => (
    <Button
      type={'submit'}
      bsStyle={'default'}
      disabled={!/^[0-9]+$/.test(this.props.newStock.barcode)}
      block
    >
      {this.state.uploadingImage ? <Spinner /> : 'Upload Image'}
    </Button>
  )

  renderBarcodeInput = () => (
    <div>
      <ControlLabel>Barcode</ControlLabel>
      <FormControl
        type={'text'}
        value={this.props.newStock.barcode}
        placeholder={'Barcode'}
        onChange={this.setBarcode}
      />
    </div>
  )

  renderImageInput = () => (
    <div>
      <ControlLabel>Obrázok produktu</ControlLabel>
      <FormControl
        type={'file'}
        name={'image'}
        accept={'.jpg'}
        placeholder={'Obrázok produktu'}
      />
    </div>
  )

  render = () => {
    return (
      <Panel header={<h1><b>Nahrať obrázok</b></h1>}>
        <Row>
          <form onSubmit={this.uploadImage}>
            <Col xs={4}>
              {this.renderBarcodeInput()}
            </Col>
            <Col xs={4}>
              {this.renderImageInput()}
            </Col>
            <Col xs={4}>
              {this.renderSubmitButton()}
            </Col>
          </form>
        </Row>
      </Panel>
    );
  }
}

export default connect(
  (state) => ({
    newStock: get(state, [...PATH_NEW_STOCK], {}),
    products: get(state, [...PATH_SHOP, 'products', 'data'], {}),
  }),
  (dispatch) => bindActionCreators(
    {changeBarcode, addNotification},
    dispatch
  ),
  mergeProps
)(ProductImageUpload);
