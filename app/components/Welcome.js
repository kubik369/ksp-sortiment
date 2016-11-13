import React, {Component} from 'react';

import {processSteps} from '../constants/enums/steps';

export class Welcome extends Component {

  render() {
    const {goToStep, changeUsername} = this.props;

    return (<div>
      <p>Welcome</p>
      <button onClick={() => {
          changeUsername('');
          goToStep(processSteps.login);
        }
      }>
        Go To Login
      </button>
      <button onClick={() => goToStep(processSteps.registration)}>
        Go To Registration
      </button>
    </div>);
  }
}
