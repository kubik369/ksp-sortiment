import React, {Component} from 'react';
import axios from 'axios';

export class Registration extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const {username, balance, logIn} = this.props;

    axios
      .post('/register', {username: username, balance: balance})
      .then((res) => logIn(username))
      .catch(
        (err) => console.error(`Registration failed: ${err}`)
      );
  }

  render() {
    const {
      username,
      balance,
      changeRegistrationUsername,
      changeRegistrationBalance,
    } = this.props;

    return (
      <div>
        <p>Registration</p>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input
            type={'text'}
            name={'username'}
            value={username}
            onChange={(e) => changeRegistrationUsername(e.target.value.trim())}
          />
          <input
            type={'number'}
            name={'balance'}
            step={0.01}
            value={balance}
            onChange={(e) => changeRegistrationBalance(e.target.value)}
          />
          <input type={'submit'} />
        </form>
      </div>
    );
  }
}
