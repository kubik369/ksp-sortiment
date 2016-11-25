import React, {Component} from 'react';
import axios from 'axios';

export class AddCredit extends Component {
  addCredit = (e) => {
    e.preventDefault();
    const {username, fetchUsers} = this.props;
    const credit = e.target.credit.value;

    if (window.confirm(`Do you wish to add ${credit}€ to user ${username}?`)) {
      axios
        .post(
          '/credit', {username: username, credit: credit}
        ).then(
          (res) => fetchUsers()
        ).catch(
          (err) => console.log('Could not add credit', err)
        );
    }
  }

  render() {
    const {changeBalance} = this.props;

    return (
      <div>
        <h2>Add Credit</h2>
        <form onSubmit={(e) => this.addCredit(e)}>
          <input
            type={'number'}
            name={'credit'}
            step={0.01}
            onChange={(e) => changeBalance(e.target.value)}/>
          <input type={'submit'} value={'Add Credit'} />
        </form>
      </div>
    );
  }
}