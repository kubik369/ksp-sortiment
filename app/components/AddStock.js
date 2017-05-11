import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get, isInteger, toNumber, isFinite, toFinite, find} from 'lodash';
import {Grid, Row, Col, FormControl, Button, ButtonToolbar, ControlLabel,
  Alert, Panel, PageHeader} from 'react-bootstrap';
import axios from 'axios';
import {remove as removeDiacritics} from 'diacritics';

import {changeBarcode, changeSearchText, changePrice, changeQuantity,
  toggleImageUpload} from '../actions/newStock';
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

  renderProductButton = ({name, barcode}, i) => (
    <Button key={i} onClick={() => this.props.actions.changeBarcode(barcode)}>
      {name}
    </Button>
  )

  filterProducts = () => {
    const {newStock: {search}, products} = this.props;
    const strippedSearch = removeDiacritics(search).trim().toLowerCase();

    const filteredProducts = Object.values(products)
      .filter(({name}) => removeDiacritics(name).toLowerCase().includes(strippedSearch))
      .slice(0, 9)
      .map(this.renderProductButton);

    return (
      <ButtonToolbar>
        {filteredProducts}
      </ButtonToolbar>
    );
  }

  getProductBarcode = (search) => {
    const {products} = this.props;

    for (let product of Object.values(products)) {
      if (search.localeCompare(product.name) === 0
          || search.localeCompare(product.barcode) === 0
        ) {
        return product.barcode;
      }
    }
    return null;
  }

  addStock = (e) => {
    e.preventDefault();
    const {price, barcode, search, quantity, uploadImage} = this.props.newStock;
    const {userId, products, actions: {addNotification}} = this.props;

    if (!barcode || (!products[barcode] && !search)
      || !quantity || !isFinite(toFinite(price))
      || !isInteger(toNumber(quantity))
    ) {
      addNotification('Chýbajúce alebo chybné údaje!', 'warning');
      return;
    }

    const data = {
      userId,
      barcode,
      name: search,
      quantity,
      price: price,
      uploadImage,
    };

    if (uploadImage) {
      let file = e.target.image.files[0];
      let reader = new FileReader();

      reader.onloadend = () => {
        const image = reader.result;

        axios
          .post('/addstock', {...data, image})
          .then(() => {
            this.deleteForm();
            addNotification('Pridanie tovaru úspešné.', 'success');
          }).catch((err) => {
            console.error('Error during re-stock:', err);
            addNotification('Nebolo možné pridať tovar.', 'error');
          });
      };
      reader.readAsDataURL(file);
    } else {
      axios
        .post('/addstock', data)
        .then(() => {
          this.deleteForm();
          addNotification('Pridanie tovaru úspešné.', 'success');
        }).catch((err) => {
          console.error('Error during re-stock:', err);
          addNotification('Nebolo možné pridať tovar.', 'error');
        });
    }
  }

  deleteForm = () => {
    this.props.actions.changeSearchText('');
    this.props.actions.changePrice(0);
    this.props.actions.changeQuantity(1);
    this.props.actions.toggleImageUpload(false);

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

  renderProductSearch = () => {
    const {fetchingProducts, newStock, products,
      actions: {changeBarcode, changeSearchText},
    } = this.props;
    const chosenProductName = products[newStock.barcode]
      ? products[newStock.barcode].name
      : 'Nič';

    return (
      <div>
        <Row>
          <ControlLabel>Vybratý produkt</ControlLabel>
          <div>{chosenProductName}</div>
        </Row>
        <Row>
          <ControlLabel>Barcode</ControlLabel>
          <FormControl
            type={'text'}
            value={newStock.barcode}
            placeholder={'Barcode'}
            onChange={(e) => changeBarcode(e.target.value)}
          />
        </Row>
        <Row>
          <ControlLabel>Názov</ControlLabel>
          <FormControl
            type={'text'}
            value={newStock.search}
            placeholder={'Search products'}
            onChange={(e) => changeSearchText(e.target.value)}
          />
        </Row>
        <Row>
          <ControlLabel>Produkty</ControlLabel>
          {!fetchingProducts && this.filterProducts()}
          {fetchingProducts && <p>Loading Products</p>}
        </Row>
      </div>
    );
  }

  renderStockForm = () => {
    const {products, newStock} = this.props;
    const {changeQuantity, changePrice} = this.props.actions;

    const oldPrice = products[newStock.barcode] ? products[newStock.barcode].price : '0.00€';
    const newPrice = products[newStock.barcode]
      ? this.getNewPrice(products[newStock.barcode], newStock)
      : `${parseFloat(newStock.price).toFixed(2)}€`;

    return (
      <div>
        <ControlLabel>Počet:</ControlLabel>
        <FormControl
          type={'text'}
          value={newStock.quantity}
          placeholder={'Quantity'}
          onChange={({target: {value}}) =>
            changeQuantity(isInteger(toNumber(value)) ? toNumber(value) : value)
          }
        />
        <ControlLabel>Cena:</ControlLabel>
        <FormControl
          type={'text'}
          value={newStock.price}
          placeholder={'Price'}
          onChange={({target: {value}}) => changePrice(value)}
        />
        <div>
          <p><b>Pôvodná cena:</b> {oldPrice}</p>
          <p><b>Nová cena:</b>{newPrice}</p>
        </div>
      </div>
    );
  }

  renderImageUploadForm = () => {
    const {
      newStock: {uploadImage: showForm}, actions: {toggleImageUpload}
    } = this.props;

    return (
      <div>
        <label>
          Upload an image?
          <input
            type={'checkbox'}
            name={'uploadImage'}
            value={showForm}
            onChange={(e) => toggleImageUpload(e.target.checked)}
          />
        </label>
        {showForm &&
          <FormControl
            type={'file'}
            name={'image'}
            accept={'.jpg'}
            placeholder={'Product Image'}
          />
        }
      </div>
    );
  }

  render() {
    const {newStock, products} = this.props;

    return (
      <Grid fluid style={{marginTop: '20px'}}>
        <Row>
          <Col xs={12}>
            <Panel>
              <PageHeader>Pridať tovar</PageHeader>
              <form onSubmit={(e) => this.addStock(e)}>
                <Row>
                  <Col xs={6}>{this.renderProductSearch()}</Col>
                  <Col xs={3}>{this.renderStockForm()}</Col>
                  <Col xs={3}>{this.renderImageUploadForm()}</Col>
                </Row>
                <Row><div styleName={'line'} /></Row>
                <Row>
                  <div styleName={'addStockButton'}>
                    <Col xs={4} />
                    <Col xs={4}>
                      <FormControl
                        type={'submit'}
                        value={'Add stock'}
                        disabled={
                          !newStock.search
                            || (!newStock.barcode && !newStock.uploadImage)
                        }
                      />
                      {!products[newStock.barcode] && (
                        <Alert bsStyle={'warning'}>
                          Táto vec bude nová, prosím pridaj aj obrázok.
                        </Alert>
                      )}
                    </Col>
                    <Col xs={4} />
                  </div>
                </Row>
              </form>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  (state) => ({
    userId: get(state, [...PATH_LOGIN, 'userId'], 'No user selected'),
    products: get(state, [...PATH_SHOP, 'products', 'data']),
    fetchingProducts: get(state, [...PATH_SHOP, 'products', 'fetching']),
    newStock: get(state, [...PATH_NEW_STOCK]),
  }),
  (dispatch) => bindActionCreators(
    {
      loadProducts,
      changeBarcode,
      changeSearchText,
      changeQuantity,
      changePrice,
      toggleImageUpload,
      addNotification,
    },
    dispatch
  ),
  mergeProps
)(AddStock);
