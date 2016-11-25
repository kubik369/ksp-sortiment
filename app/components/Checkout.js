import React, {Component} from 'react';
import axios from 'axios';

export class Checkout extends Component {

  componentWillMount = () => {
    this.props.fetchUsers();
    this.props.fetchProducts();
  }

  checkout = () => {
    const {cart, username, fetchUsers, fetchProducts} = this.props;
    if (Object.values(cart).reduce((total, item) => total + item) === 0) {
      console.log('Nothing in the cart');
      return;
    }
    axios
      .post(
        '/buy', {cart: cart, username: username}
      ).then(() => {
        fetchUsers();
        fetchProducts();
        window.alert('Purchase successful');
      }).catch((err) => {
        console.log('Error during checkout:', err);
      });
  }

  render() {
    const {cart, products, balance, loggedIn, removeFromCart} = this.props;

    if (!loggedIn) {
      return null;
    }

    const total = Object.values(products).reduce(
      (total, product) => total + product.price * cart[product.id],
      0
    );

    return (
      <div>
        <div>
          <h2>Checkout</h2>
          <p>Your Balance is: {balance.toFixed(2)}€</p>
          <p key={'total'}>Total Value of Cart: {total.toFixed(2)}€</p>
          <ul>
            {Object.keys(cart).map(
              (id) =>
                <li key={id}>
                  {products[id].label}: {cart[id]}
                  <button onClick={() => cart[id] > 0 && removeFromCart(id)}>Remove</button>
                </li>
            )}
          </ul>
          <button onClick={() => this.checkout()}>Buy</button>
        </div>
      </div>
    );
  }
}
