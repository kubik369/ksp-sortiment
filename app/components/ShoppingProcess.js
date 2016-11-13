import React, {Component} from 'react';

import LoginC from '../containers/Login';
import RegistrationC from '../containers/Registration';
import DashboardC from '../containers/Dashboard';
import WelcomeC from '../containers/Welcome';

import {processSteps as steps} from '../constants/enums/steps';

export class ShoppingProcess extends Component {

  render() {
    const {currentStep, goToStep} = this.props;

    const screens = {
      [steps.welcome]: <WelcomeC />,
      [steps.login]: <LoginC />,
      [steps.registration]: <RegistrationC />,
      [steps.dashboard]: <DashboardC />,
      [steps.success]: <p>Transaction successful, we hope you come again</p>,
      [steps.error]: <p>Something went wrong, please try purchasing again</p>,
    }

    return (<div style={{backgroundColor: 'yellow'}}>
      <button onClick={() => goToStep(steps.welcome)}>
        Home
      </button>
      {screens[currentStep]}
    </div>);
  }
}
