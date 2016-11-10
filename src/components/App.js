import React, {Component} from 'react';
import SortimentC from '../containers/Sortiment';
import ShoppingProcessC from '../containers/ShoppingProcess'

export class App extends Component {
  render() {
    return (
      <div>
        <h1>Tu raz bude ceeeellyyyy sortiment</h1>
        <ShoppingProcessC />
        <SortimentC />
      </div>
    );
  }
}
