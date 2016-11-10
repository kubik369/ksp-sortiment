import React, {Component} from 'react';

export class Product extends Component {
  render() {
    const {productInfo, quantity, addToCart, removeFromCart} = this.props

    return (
      <div>
        <p>
          <img src={productInfo.image} />
        </p>
        <button onClick={() => removeFromCart()}>-</button>
        <input type={'number'} value={quantity} />
        <button onClick={() => addToCart()}>+</button>

        <p>{productInfo.label}</p>
        <p>{productInfo.price}</p>
      </div>
    )
  }
}