import React, {Component} from 'react';
import ProductC from '../containers/Product';

export class Sortiment extends Component {
  componentWillMount = () => {
    this.props.fetchProducts();
  }

  render() {
    const products = Object.keys(this.props.products.data).map(
      (key) => <ProductC key={key} id={key}/>
    );

    return (
      <div id="sortiment" style={{backgroundColor: 'green'}}>
        {products}
      </div>
    );
  }
}
