import React, {Component} from 'react';
import axios from 'axios';

import {processSteps} from '../constants/enums/steps';

export class Dashboard extends Component {

  componentWillMount = () => {
    this.props.fetchUsers();
    this.props.fetchProducts();
  }

  addCredit = (e) => {
    e.preventDefault();
    const {username} = this.props;
    const credit = e.target.credit.value;

    if (window.confirm(`Do you wish to add ${credit}€ to user ${username}?`)) {
      axios
        .post(
          '/credit', {username: username, credit: credit}
        ).then(
          (res) => this.props.fetchUsers()
        ).catch(
          (err) => console.log('Could not add credit', err)
        );
    }
  }

  addProduct = (e) => {
    e.preventDefault();
  }

  checkout = () => {
    const {cart, username, goToStep} = this.props;
    if (Object.values(cart).reduce((total, item) => total + item) === 0) {
      console.log('Nothing in the cart');
      return;
    }
    axios
      .post(
        '/buy', {cart: cart, username: username}
      ).then(() => {
        goToStep(processSteps.success);
      }).catch((err) => {
        console.log('Error during checkout:', err);
        goToStep(processSteps.error);
      });
  }

  render() {
    const {cart, products, balance, username, changeBalance} = this.props;
    const total = Object.values(products).reduce(
      (total, product) =>  total + product.price * cart[product.id],
      0
    );

    return (
      <div>
        <h1>Dashboard</h1>
        <p>Logged in as user: {username}</p>
        <div>
          <h2>Checkout</h2>
          <p>Your Balance is: {balance.toFixed(2)}€</p>
          <p key={'total'}>Total Value of Cart: {total.toFixed(2)}€</p>
          <ul>
            {Object.keys(cart).map(
              (id) => <li key={id}>{products[id].label}: {cart[id]}</li>
            )}
          </ul>
          <button onClick={() => this.checkout()}>Buy</button>
        </div>
        <div>
          <h2>Add Credit</h2>
          <form onSubmit={(e) => this.addCredit(e)}>
            <input
              type={'number'}
              name={'credit'}
              step={0.01}
              onChange={(e) => changeBalance(e.target.value)}
            />
            <input type={'submit'} value={'Add Credit'} />
          </form>
        </div>
        <div>
          <h2>Add Product/Restock</h2>
          <form onSubmit={(e) => this.addProduct(e)}>
            <input type={'text'} name={'productName'}/>
            <input type={'number'} name={'newStock'}/>
            <input type={'submit'} value={'Add stock'} />
          </form>
        </div>
      </div>
    );
  }
}
