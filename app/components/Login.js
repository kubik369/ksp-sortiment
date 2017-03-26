import React, {Component} from 'react';
import {Button, ControlLabel, FormControl} from 'react-bootstrap';
import {remove as removeDiacritics} from 'diacritics'

import './Login.css';

export class Login extends Component {
  componentWillMount = () => this.props.fetchUsers()

  filterUsers = () => {
    const {search, users, logIn} = this.props;

    if (!search) {
      return [];
    }
    return Object.values(users)
      .filter((user) => new RegExp(`^${removeDiacritics(search).trim().toLowerCase()}`)
      .test(removeDiacritics(user.username).toLowerCase()))
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
          <FormControl
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
          <div>
            <ControlLabel>Prihlásený:</ControlLabel>{username}
          </div>
          <div>
            <ControlLabel>Zostatok na účte:</ControlLabel> {balance.toFixed(2)}€
          </div>
        </div>
      }
    </div>);
  }
}
