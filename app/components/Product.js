import React, {Component} from 'react';

export class Product extends Component {
  render() {
    const {id, productInfo, quantity, addToCart, removeFromCart} = this.props;

    if (!productInfo.stock) {
      return null;
    }

    return (
      <div>
        <p>
          <img src={`/images/${productInfo.image}`} />
        </p>
        <button
          onClick={() => quantity - 1 >= 0 && removeFromCart(id)}
        >-</button>
        <input type={'number'} value={quantity} disabled/>
        <button
          onClick={() => quantity + 1 <= productInfo.stock && addToCart(id)}
        >+</button>

        <p>{productInfo.label}</p>
        <p>{productInfo.price}</p>
      </div>
    );
  }
}
