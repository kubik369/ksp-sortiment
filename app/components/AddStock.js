import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get, isInteger, toNumber, isFinite, toFinite} from 'lodash';
import {Grid, Row, Col, FormControl, ControlLabel,
  Panel, InputGroup, FormGroup, Button} from 'react-bootstrap';
import axios from 'axios';

import ProductImageUploadForm from './ProductImageUploadForm';

import {
  changeBarcode, changePrice, changeQuantity, changeName,
} from '../actions/newStock';
import {loadProducts} from '../actions/shop';
import {addNotification} from '../actions/notifications';
import {PATH_SHOP} from '../state/shop';
import {PATH_LOGIN} from '../state/login';
import {PATH_NEW_STOCK} from '../state/newStock';
import {mergeProps} from '../utils';

import './AddStock.css';

class AddStock extends Component {

  componentWillMount() {
    this.props.actions.loadProducts();
  }

  amountAndPriceFormValid = () => {
    const {newStock: {quantity, price}} = this.props;
    const isQuantityInteger = /^[1-9][0-9]*$/.test(quantity);
    const isPriceFloat = /^[0-9]*\.?[0-9]{1,2}$/.test(price);

    return isQuantityInteger && isPriceFloat;
  }

  isFormValid = () => {
    const {newStock: {barcode, name}, products} = this.props;

    return (
      barcode.length > 0 && this.amountAndPriceFormValid() && (
        // existing product
        (barcode in products && name.length === 0)
        // new product
        || (name.length > 0 && /^[0-9]+$/.test(barcode))
      )
    );
  }

  isRenameValid = () => {
    const {price, barcode, name, quantity} = this.props.newStock;
    const {products} = this.props;

    return barcode in products && name.length &&
      name !== products[barcode].name && price === 0 && quantity === 0;
  }

  addStock = (e) => {
    e.preventDefault();
    const {price, barcode, name, quantity} = this.props.newStock;
    const {userId, products, actions: {addNotification}} = this.props;

    if (!this.isFormValid()) {
      addNotification('Chýbajúce alebo chybné údaje!', 'warning');
      return;
    }

    const data = {userId, barcode, quantity, price};

    if (!(barcode in products)) {
      data.name = name;
    }

    axios
      .post('/addStock', data)
      .then(() => {
        this.deleteForm();
        addNotification('Pridanie tovaru úspešné.', 'success');
      }).catch((err) => {
        console.error('Error during re-stock:', err);
        addNotification('Nebolo možné pridať tovar.', 'error');
      });
  }

  renameProduct = (e) => {
    e.preventDefault();
    const {
      newStock: {barcode, name}, userId,
      actions: {addNotification},
    } = this.props;

    if (!this.isRenameValid()) {
      addNotification('Chýbajúce alebo chybné údaje!', 'warning');
      return;
    }

    const data = {barcode, name, userId};

    axios
      .post('/renameProduct', data)
      .then(() => {
        this.deleteForm();
        addNotification('Premenovanie tovaru úspešné.', 'success');
      }).catch((err) => {
        console.error('Error during product renaming:', err);
        addNotification('Nebolo možné premenovať tovar.', 'error');
      });
  }

  deleteForm = () => {
    this.props.actions.changeBarcode('');
    this.props.actions.changeName('');
    this.props.actions.changePrice(0);
    this.props.actions.changeQuantity(0);

    this.props.actions.loadProducts();
  }

  getNewPrice = (
    {price: oldPrice, stock: oldStock},
    {price: newPrice, quantity: newStock}
  ) => {
    if (!isFinite(parseFloat(newPrice)) || !isInteger(newStock)) {
      return oldPrice;
    }
    const result = ((oldPrice * oldStock) +
      (toFinite(newPrice) * newStock)) / (oldStock + newStock);
    return (Math.ceil(result * 20) / 20).toFixed(2);
  }

  renderBarcodeAndNameInput = () => (
    <Row>
      <Col xs={12}>
        <ControlLabel>Barcode</ControlLabel>
        <FormControl
          type={'text'}
          value={this.props.newStock.barcode}
          placeholder={'Barcode'}
          onChange={
            ({target: {value}}) => this.props.actions.changeBarcode(value)
          }
        />
      </Col>
      <Col xs={12}>
        <ControlLabel>Názov</ControlLabel>
        <FormControl
          type={'text'}
          value={this.props.newStock.name}
          placeholder={'Názov'}
          onChange={
            ({target: {value}}) => this.props.actions.changeName(value)
          }
        />
      </Col>
    </Row>
  )

  renderAddStockForm = () => {
    const {newStock: {barcode, price}, products} = this.props;

    const oldPrice = barcode in products ? products[barcode].price : '0.00€';
    const newPrice = barcode in products
      ? this.getNewPrice(products[barcode], this.props.newStock)
      : `${parseFloat(price).toFixed(2)}€`;

    return (
      <Panel header={<h1><b>Doplniť tovar</b></h1>}>
        <Row>
          <form onSubmit={this.addStock}>
            <Col xs={3}>
              {this.renderBarcodeAndNameInput()}
            </Col>
            <Col xs={5}>
              {this.renderAmountAndPriceForm()}
            </Col>
            <Col xs={4}>
              <p><b>Pôvodná cena: </b>{oldPrice}</p>
              <p><b>Nová cena: </b>{newPrice}</p>
              <FormControl
                type={'submit'}
                value={'Add stock'}
                disabled={!this.isFormValid()}
              />
            </Col>
          </form>
        </Row>
        <Row>
          <Col xs={3}>
            <form onSubmit={this.renameProduct}>
              <FormControl
                type={'submit'}
                value={'Premenovať'}
                disabled={!this.isRenameValid()}
              />
            </form>
          </Col>
          <Col xs={9} />
        </Row>
      </Panel>
    );
  }

  addQuantity = (amount) => {
    this.props.actions.changeQuantity(this.props.newStock.quantity + amount);
  }

  addPrice = (money) => {
    this.props.actions.changePrice(
      (parseFloat(this.props.newStock.price) + money).toFixed(2)
    );
  }

  renderAmountAndPriceForm = () => {
    const {newStock: {quantity, price}} = this.props;
    const {changeQuantity, changePrice} = this.props.actions;

    return (
      <div styleName={'amountPriceForm'}>
        <ControlLabel>Počet:</ControlLabel>
        <FormGroup>
          <InputGroup>
            <InputGroup.Button>
              <Button onClick={() => this.addQuantity(-10)}>-10</Button>
              <Button onClick={() => this.addQuantity(-1)}>-1</Button>
            </InputGroup.Button>
            <FormControl
              type={'number'}
              min={0}
              value={quantity}
              placeholder={'Quantity'}
              onChange={({target: {value}}) =>
                changeQuantity(
                  isInteger(toNumber(value)) ? toNumber(value) : value
                )
              }
            />
            <InputGroup.Button>
              <Button onClick={() => this.addQuantity(1)}>+1</Button>
              <Button onClick={() => this.addQuantity(10)}>+10</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>

        <ControlLabel>Cena:</ControlLabel>
        <FormGroup>
          <InputGroup>
            <InputGroup.Button>
              <Button onClick={() => this.addPrice(-0.1)}>-10c</Button>
              <Button onClick={() => this.addPrice(-0.01)}>-1c</Button>
            </InputGroup.Button>
            <FormControl
              type={'number'}
              step={0.01}
              min={0}
              value={price}
              placeholder={'Price'}
              onChange={
                ({target: {value}}) => changePrice(value.replace(',', '.'))
              }
            />
            <InputGroup.Button>
              <Button onClick={() => this.addPrice(0.01)}>+1c</Button>
              <Button onClick={() => this.addPrice(0.1)}>+10c</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </div>
    );
  }

  render() {
    return (
      <Grid fluid style={{marginTop: '20px'}}>
        <Row>
          <Col xs={12}>
            {this.renderAddStockForm()}
          </Col>
          <Col xs={12}>
            <ProductImageUploadForm />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  (state) => ({
    userId: get(state, [...PATH_LOGIN, 'userId'], 'No user selected'),
    products: get(state, [...PATH_SHOP, 'products', 'data'], {}),
    fetchingProducts: get(state, [...PATH_SHOP, 'products', 'fetching'], false),
    newStock: get(state, [...PATH_NEW_STOCK], {}),
  }),
  (dispatch) => bindActionCreators(
    {
      loadProducts,
      changeBarcode,
      changeName,
      changeQuantity,
      changePrice,
      addNotification,
    },
    dispatch
  ),
  mergeProps
)(AddStock);
