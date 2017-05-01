import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get, isNumber, isInteger, toNumber, isFinite, toFinite} from 'lodash';
import {Grid, Row, Col, FormControl, Button, ButtonToolbar, ControlLabel,
  Alert, Panel, PageHeader} from 'react-bootstrap';
import axios from 'axios';
import {remove as removeDiacritics} from 'diacritics';

import {fetchProducts, changeNewStockId, changeNewStockSearch, changeNewStockQuantity,
  changeNewStockPrice, changeNewStockImageCheckbox} from '../actions/actions';
import {addNotification} from '../actions/notifications';
import {PATH_SHOP} from '../reducers/shop';
import {mergeProps} from '../utils';

import './AddStock.css';

class AddStock extends Component {

  componentWillMount() {
    this.props.actions.fetchProducts();
  }

  renderProductButton = ({label}, i) => (
    <Button key={i} onClick={() => this.productSearchText(label)}>
      {label}
    </Button>
  )

  filterProducts = () => {
    const {newStock: {search}, products} = this.props;
    const strippedSearch = removeDiacritics(search).trim().toLowerCase();

    const filteredProducts = Object.values(products)
      .filter(({label}) => removeDiacritics(label).toLowerCase().includes(strippedSearch))
      .slice(0, 9)
      .map(this.renderProductButton);

    return (
      <ButtonToolbar>
        {filteredProducts}
      </ButtonToolbar>
    );
  }

  productSearchText = (text) => {
    const {changeNewStockSearch, changeNewStockId} = this.props.actions;
    const id = this.getProductId(text);

    changeNewStockSearch(text);
    changeNewStockId(id || '');
  }

  getProductId = (label) => {
    const {products} = this.props;

    for (let product of Object.values(products)) {
      if (label === product.label) {
        return product.id;
      }
    }
    return null;
  }

  addStock = (e) => {
    e.preventDefault();
    const {price, search, quantity, uploadImage} = this.props.newStock;
    const {username, actions: {addNotification}} = this.props;

    if (!search.trim() || !quantity || !isFinite(toFinite(price)) ||
     !isInteger(toNumber(quantity))) {
      addNotification('Chýbajúce alebo chybné údaje!', 'warning');
      return;
    }

    const data = {
      username,
      label: search.trim(),
      quantity: quantity,
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
    this.productSearchText('');
    this.props.actions.changeNewStockPrice(0);
    this.props.actions.changeNewStockQuantity(1);
    this.props.actions.changeNewStockImageCheckbox(false);

    this.props.actions.fetchProducts();
  }

  getNewPrice = ({price: oldPrice, stock: oldStock}, {price: newPrice, quantity: newStock}) => {
    if (!isNumber(newPrice) || !isInteger(newStock)) {
      return 0;
    }
    const result = ((oldPrice * oldStock) + (newPrice * newStock)) / (oldStock + newStock);
    return (Math.ceil(result * 20) / 20).toFixed(2);
  }

  renderProductSearch = () => {
    const {fetchingProducts, newStock} = this.props;
    return (
      <div>
        <ControlLabel>Vyber produkt</ControlLabel>
        <FormControl
          type={'text'}
          value={newStock.search}
          placeholder={'Search products'}
          onChange={(e) => this.productSearchText(e.target.value)}
        />
        {!fetchingProducts && this.filterProducts()}
        {fetchingProducts && <p>Loading Products</p>}
      </div>
    );
  }

  renderStockForm = () => {
    const {products, newStock} = this.props;
    const {changeNewStockQuantity, changeNewStockPrice} = this.props.actions;

    const oldPrice = newStock.id ? products[newStock.id].price : '0.00€';
    const newPrice = (newStock.id !== '')
      ? this.getNewPrice(products[newStock.id], newStock)
      : `${parseFloat(newStock.price).toFixed(2)}€`;

    return (
      <div>
        <ControlLabel>Počet:</ControlLabel>
        <FormControl
          type={'text'}
          value={newStock.quantity}
          placeholder={'Quantity'}
          onChange={({target: {value}}) =>
            changeNewStockQuantity(isInteger(toNumber(value)) ? toNumber(value) : value)
          }
        />
        <ControlLabel>Cena:</ControlLabel>
        <FormControl
          type={'text'}
          value={newStock.price}
          placeholder={'Price'}
          onChange={({target: {value}}) => {
            const number = toNumber(value);
            if (isFinite(number) && number.toString().length === value.length) {
              changeNewStockPrice(number);
            } else {
              changeNewStockPrice(value);
            }
          }}
        />
        <div>
          <p><b>Pôvodná cena:</b> {oldPrice}</p>
          <p><b>Nová cena:</b>{newPrice}</p>
        </div>
      </div>
    );
  }

  renderImageUploadForm = () => {
    const {newStock: {uploadImage: showForm}, actions: {changeNewStockImageCheckbox}} = this.props;

    return (
      <div>
        <label>
          Upload an image?
          <input
            type={'checkbox'}
            name={'uploadImage'}
            value={showForm}
            onChange={(e) => changeNewStockImageCheckbox(e.target.checked)}
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
    const {newStock} = this.props;

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
                        disabled={!newStock.search || (!newStock.id && !newStock.uploadImage)}
                      />
                      {!newStock.id && (
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
    username: get(state, [...PATH_SHOP, 'login', 'username'], 'No user selected'),
    products: get(state, [...PATH_SHOP, 'products', 'data']),
    fetchingProducts: get(state, [...PATH_SHOP, 'products', 'fetching']),
    newStock: get(state, [...PATH_SHOP, 'newStock']),
  }),
  (dispatch) => bindActionCreators(
    {
      fetchProducts,
      changeNewStockId,
      changeNewStockSearch,
      changeNewStockQuantity,
      changeNewStockPrice,
      changeNewStockImageCheckbox,
      addNotification,
    },
    dispatch
  ),
  mergeProps
)(AddStock);
