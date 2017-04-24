import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get, isNumber, toNumber} from 'lodash';
import {
  Grid, Row, Col, FormControl, Button, ButtonToolbar,
  ControlLabel, Alert, Panel, PageHeader,
} from 'react-bootstrap';
import axios from 'axios';
import {remove as removeDiacritics} from 'diacritics';

import {
  fetchProducts,
  changeNewStockId,
  changeNewStockSearch,
  changeNewStockQuantity,
  changeNewStockPrice,
  changeNewStockImageCheckbox,
} from '../actions/actions';
import {addNotification} from '../actions/notifications';
import {PATH_SHOP} from '../reducers/shop';

import './AddStock.css';

class AddStock extends Component {

  componentWillMount() {
    this.props.fetchProducts();
  }

  filterProducts = () => {
    const {newStock, products} = this.props;

    return (
      <ButtonToolbar>
        {Object.values(products)
          .filter((product) => (
            new RegExp(`^${removeDiacritics(newStock.search).trim().toLowerCase()}`)
              .test(removeDiacritics(product.label).toLowerCase())
          ))
          .slice(0, 9)
          .map((product, i) =>
            (<Button
              key={i}
              onClick={() => this.productSearchText(product.label)}
              >{product.label}</Button>)
        )}
      </ButtonToolbar>
    );
  }

  productSearchText = (text) => {
    const {changeNewStockSearch, changeNewStockId} = this.props;
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
    const {search, quantity, uploadImage} = this.props.newStock;
    const {username, addNotification} = this.props;

    const price = this.props.newStock.price.replace(/,/, '.') || null;

    if (!search.trim() || !quantity || !isNumber(toNumber(price))) {
      addNotification('Chýbajúce alebo chybné údaje!', 'warning');
      return;
    }

    if (uploadImage) {
      let file = e.target.image.files[0];
      let reader = new FileReader();

      reader.onloadend = () => {
        const image = reader.result;

        axios
          .post('/addstock', {
            username,
            label: search.trim(),
            quantity: quantity.trim(),
            price: price.trim(),
            uploadImage,
            image,
          })
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
        .post('/addstock', {username, label: search, quantity, price, uploadImage})
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
    this.props.changeNewStockPrice(0);
    this.props.changeNewStockQuantity(1);
    this.props.changeNewStockImageCheckbox(false);

    this.props.fetchProducts();
  }

  getNewPrice = (oldPrice, oldStock, newPrice, newStock) => {
    if (!newPrice || !newStock) {
      return 'N/A';
    }
    const price = toNumber(newPrice.replace(/,/, '.')) || 0;
    const stock = toNumber(newStock.replace(/,/, '.')) || 0;
    const result = ((oldPrice * oldStock) + (price * stock)) / (oldStock + stock);
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
    const {
      products,
      newStock,
      changeNewStockQuantity,
      changeNewStockPrice,
    } = this.props;

    const oldPrice = newStock.id ? products[newStock.id].price : '0.00€';
    const newPrice =
      (newStock.id !== '')
        ? this.getNewPrice(
            products[newStock.id].price,
            products[newStock.id].stock,
            newStock.price,
            newStock.quantity
          )
        : `${parseFloat(newStock.price).toFixed(2)}€`;

    return (
      <div>
        <ControlLabel>Počet:</ControlLabel>
        <FormControl
          type={'text'}
          value={newStock.quantity}
          placeholder={'Quantity'}
          onChange={(e) => changeNewStockQuantity(e.target.value)}
          />
        <ControlLabel>Cena:</ControlLabel>
        <FormControl
          type={'text'}
          value={newStock.price}
          min={0}
          step={0.01}
          placeholder={'Price'}
          onChange={(e) => changeNewStockPrice(e.target.value)}
          />
        <div>
          <p><b>Pôvodná cena:</b> {oldPrice}</p>
          <p><b>Nová cena:</b>{newPrice}</p>
        </div>
      </div>
    );
  }

  renderImageUploadForm = () => {
    const {newStock: {uploadImage: showForm}, changeNewStockImageCheckbox} = this.props;

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
                  <Col xs={6}>
                    {this.renderProductSearch()}
                  </Col>
                  <Col xs={3}>
                    {this.renderStockForm()}
                  </Col>
                  <Col xs={3}>
                    {this.renderImageUploadForm()}
                  </Col>
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
                    <Col lg={4} md={4} sm={4} />
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
  )
)(AddStock);
