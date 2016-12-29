import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

import './Login.css';

export class Login extends Component {
  componentWillMount = () => this.props.fetchUsers()

  filterUsers = () => {
    const {search, users, logIn} = this.props;

    if (!search) {
      return [];
    }
    return Object.values(users)
      .filter((user) => new RegExp(`^${search}`).test(user.username))
      .slice(0, 9)
      .map(
        (user, i) =>
          (<Button
            key={i}
            bsStyle={'info'}
            onClick={() => logIn(user.username)}
            block
          >{user.username}</Button>)
      );
  }

  render() {
    const {loggedIn, search, username, balance,
      searchUsername, fetching} = this.props;

    return (<div styleName={'login'}>
      {!loggedIn &&
        <form>
          <input
            type={'text'}
            name={'username'}
            value={search}
            placeholder={'Username'}
            autoComplete={'off'}
            onChange={(e) => searchUsername(e.target.value)}
          />
          {!fetching && this.filterUsers()}
          {fetching && <p>Loading</p>}
        </form>
      }
      {loggedIn &&
        <div>
          Prihlásený: {username}
          <p>Zostatok na účte: {balance.toFixed(2)}€</p>
        </div>
      }
    </div>);
  }
}
