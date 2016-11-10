import React, {Component} from 'react';
import ProductContainer from '../containers/Product'

export class Sortiment extends Component {
  render() {
    const {increment, decrement, cart} = this.props;
    const products =  Object.keys(cart).map((product) =>
      <ProductContainer
        key={product}
        type={product}
        addToCart={() => increment(product)}
        removeFromCart={() => decrement(product)}
      />
    );

    return <div id="sortiment" style={{'background-color': 'green'}}>{products}</div>;
  }
}