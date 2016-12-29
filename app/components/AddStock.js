import React, {Component} from 'react';
import {
  Grid,
  Row,
  Col,
  FormControl,
  Button,
  ButtonToolbar,
  ControlLabel,
  Alert,
} from 'react-bootstrap';
import axios from 'axios';

import './AddStock.css';

export class AddStock extends Component {

  filterProducts = () => {
    const {newStock, products} = this.props;

    return (
      <ButtonToolbar>
        {Object.values(products)
          .filter(
          (product) => new RegExp(`^${newStock.search}`).test(product.label)
          )
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
    const {search, quantity, price, uploadImage} = this.props.newStock;
    const {username} = this.props;

    if (uploadImage) {
      let file = e.target.image.files[0];
      let reader = new FileReader();

      reader.onloadend = () => {
        const image = reader.result;

        axios
          .post('/addstock', {username, label: search, quantity, price, uploadImage, image})
          .then(() => {
            this.deleteForm();
          }).catch((err) => {
            console.error('Error during re-stock:', err);
          });
      };
      reader.readAsDataURL(file);
    } else {
      axios
        .post('/addstock', {username, label: search, quantity, price, uploadImage})
        .then(() => {
          this.deleteForm();
        }).catch((err) => {
          console.error('Error during re-stock:', err);
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
    const price = parseFloat(newPrice) || 0;
    const stock = parseInt(newStock, 10) || 0;
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
          type={'number'}
          value={newStock.quantity}
          min={1}
          placeholder={'Quantity'}
          onChange={(e) => changeNewStockQuantity(e.target.value)}
          />
        <ControlLabel>Cena:</ControlLabel>
        <FormControl
          type={'number'}
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
    return (
      <Grid>
        <Row>
          <Col lg={12}>
            <h2>Add Product/Restock</h2>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <form onSubmit={(e) => this.addStock(e)}>
              <Row>
                <Col lg={6} md={6} sm={6}>
                  {this.renderProductSearch()}
                </Col>
                <Col lg={3} md={3} sm={3}>
                  {this.renderStockForm()}
                </Col>
                <Col lg={3} md={3} sm={3}>
                  {this.renderImageUploadForm()}
                </Col>
              </Row>
              <Row><div styleName={'line'} /></Row>
              <Row>
                <div styleName={'addStockButton'}>
                  <Col lg={4} md={4} sm={4} />
                  <Col lg={4} md={4} sm={4}>
                    <FormControl type={'submit'} value={'Add stock'} />
                    {!this.props.newStock.id && <Alert bsStyle={'warning'}>This item will be new!</Alert>}
                  </Col>
                  <Col lg={4} md={4} sm={4} />
                </div>
              </Row>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}
