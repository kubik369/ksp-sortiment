import React, {Component} from 'react';
import axios from 'axios';

export class NewStock extends Component {

  filterProducts = () => {
    const {newStock, products} = this.props;

    return Object.values(products)
      .filter((product) => new RegExp(`^${newStock.search}`).test(product.label))
      .slice(0, 9)
      .map(
        (product, i) =>
          (<li
            key={i}
            onClick={() => this.productSearchText(product.label)}
          >{product.label}</li>)
      );
  }

  productSearchText = (text) => {
    const {changeNewStockSearch, changeNewStockId} = this.props;
    const id = this.getProductId(text);

    changeNewStockSearch(text);
    changeNewStockId(id ? id : '');
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
    const {id, quantity, price} = this.props.newStock;
    const reader = new FileReader();
    const file = e.target.image.files[0];

    reader.onload = (upload) => {
      axios
        .post(
          '/addstock', {id: id, quantity: quantity, price: price, image: upload.target.result}
        ).then(() => {
          console.log(`Restocked ${quantity} of ${products[id].label} with price ${price}`);
          this.productSearchText('');
        }).catch((err) => {
          console.log('Error during re-stock:', err);
        });
    };

    reader.readAsDataURL(file);
  }

  getNewPrice = (oldPrice, oldStock, newPrice, newStock) => {
    newPrice = parseFloat(newPrice);
    newStock = parseInt(newPrice, 10);
    const price = ((oldPrice * oldStock) + (newPrice * newStock)) / (oldStock + newStock);
    return (Math.ceil(price * 20) / 20).toFixed(2);
  }

  render() {
    const {products, fetchingProducts, newStock,
      changeNewStockQuantity, changeNewStockPrice} = this.props;

    return (
      <div>
        <h2>Add Product/Restock</h2>
        <form onSubmit={(e) => this.addStock(e)}>
          <input
            type={'text'}
            value={newStock.search}
            placeholder={'Search products'}
            onChange={(e) => this.productSearchText(e.target.value)}/>
          <input
            type={'number'}
            value={newStock.quantity}
            min={1}
            placeholder={'Quantity'}
            onChange={(e) => changeNewStockQuantity(e.target.value)}/>
          <input
            type={'number'}
            value={newStock.price}
            min={0}
            step={0.01}
            placeholder={'Price'}
            onChange={(e) => changeNewStockPrice(e.target.value)}/>
          <input
            type={'file'}
            name={'image'}
            accept={'.jpg'}
            placeholder={'Product Image'} />
          <input type={'submit'} value={'Add stock'} />
          {!newStock.id && <b>This item will be new!</b>}
          <div>
            <p>Original price: {newStock.id ? products[newStock.id].price : 'None'}</p>
            <p>New price: {this.getNewPrice(
              newStock.id ? products[newStock.id].price : 0,
              newStock.id ? products[newStock.id].stock : 0,
              newStock.price,
              newStock.quantity,
            )}</p>
          </div>
          {!fetchingProducts && <ul>{this.filterProducts()}</ul>}
          {fetchingProducts && <p>Loading Products</p>}
        </form>
      </div>
    );
  }
}
