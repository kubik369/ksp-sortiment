import React, {Component} from 'react';

import {processSteps} from '../constants/enums/steps';

export class Login extends Component {
  componentWillMount() {
    this.props.fetchUsers();
  }

  filterUsers = () => {
    const {username, users, changeUsername, goToStep} = this.props;

    if (!username) {
      return [];
    }
    return Object.values(users)
      .filter((user) => new RegExp(`^${username}`).test(user.username))
      .slice(0, 9)
      .map(
        (user, i) =>
          (<li
            key={i}
            onClick={() => {
                changeUsername(user.username);
                goToStep(processSteps.dashboard);
              }
            }
          >{user.username}</li>)
      );
  }

  render() {
    const {goToStep, changeUsername, fetching} = this.props;

    return (<div>
      <form>
        <input
          type={'text'}
          name={'username'}
          value={this.props.username}
          placeholder={'Your username comes here'}
          autoComplete={'off'}
          onChange={(e) => changeUsername(e.target.value)}
        />
        {!fetching && <ul>{this.filterUsers()}</ul>}
        {fetching && <p>Loading</p>}
      </form>
    </div>);
  }
}
