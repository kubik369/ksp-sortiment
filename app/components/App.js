import React, {Component} from 'react';
import SortimentC from '../containers/Sortiment';
import ShoppingProcessC from '../containers/ShoppingProcess';

import {processSteps} from '../constants/enums/steps';

export class App extends Component {
  render() {
    const {currentStep} = this.props;

    return (
      <div>
        <h1>Tu raz bude ceeeellyyyy sortiment</h1>
        <ShoppingProcessC />
        {currentStep === processSteps.dashboard && <SortimentC />}
      </div>
    );
  }
}
