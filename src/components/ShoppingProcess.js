import React, {Component} from 'react';

import {Login} from './Login';
import {Registration} from './Registration';
import {Checkout} from './Checkout';
import {Welcome} from './Welcome';

export class ShoppingProcess extends Component {
  render() {
    return (<div>
      <Welcome />
      <Login />
      <Registration />
      <Checkout />
    </div>);
  }
}