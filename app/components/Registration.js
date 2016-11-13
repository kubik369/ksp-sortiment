import React, {Component} from 'react';
import axios from 'axios';

import {processSteps} from '../constants/enums/steps';

export class Registration extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const balance = e.target.balance.value;

    axios
      .post(
        '/register', {username: username, balance: balance}
      ).then((res) => {
        this.props.goToStep(processSteps.dashboard);
      }).catch(
        (err) => console.log(`Registration failed: ${err}`)
      );
  }

  render() {
    const {changeUsername, changeBalance} = this.props;

    return (
      <div>
        <p>Registration</p>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input
            type={'text'}
            name={'username'}
            onChange={(e) => changeUsername(e.target.value.trim())}
          />
          <input
            type={'number'}
            name={'balance'}
            step={0.01}
            onChange={(e) => changeBalance(e.target.value)}
          />
          <input type={'submit'} />
        </form>
      </div>
    );
  }
}
