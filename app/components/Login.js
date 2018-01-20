import React, {Component} from 'react';
import {Button, ControlLabel, FormControl} from 'react-bootstrap';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get, findKey} from 'lodash';
import {remove as removeDiacritics} from 'diacritics';

import {loadUsers} from '../actions/shop';
import {login, searchUsername} from '../actions/login';
import {PATH_SHOP} from '../state/shop';
import {PATH_LOGIN} from '../state/login';
import {mergeProps} from '../utils';
import BarcodeInput from './BarcodeInput';

import './Login.css';

class Login extends Component {
  componentWillMount = () => this.props.actions.loadUsers()

  filterUsers = () => {
    const {search, users, actions: {login}} = this.props;

    if (!search) {
      return [];
    }
    return Object.values(users)
      .filter((user) =>
        (new RegExp(`^${removeDiacritics(search).trim().toLowerCase()}`))
          .test(removeDiacritics(user.username).toLowerCase())
      )
      .slice(0, 9)
      .map((user, i) => (
        <Button
          key={i}
          bsStyle={'info'}
          onClick={() => login(user.id)}
          block
        >{user.username}</Button>
      ));
  }

  isBarcodeISIC = (barcode) => findKey(
    this.props.users,
    ({isic}) => isic === barcode
  )

  loginWithISIC = (isic) => this.props.actions.login(this.isBarcodeISIC(isic))

  render() {
    const {loggedIn, search, username, balance, fetching,
      actions: {searchUsername}} = this.props;

    return (<div styleName={'login'}>
      {!loggedIn &&
        <form>
          <BarcodeInput
            isBarcodeValid={this.isBarcodeISIC}
            action={this.loginWithISIC}
            placeholder={'ISIC'}
          />
          <FormControl
            type={'text'}
            name={'username'}
            value={search}
            placeholder={'Username'}
            autoComplete={'off'}
            onChange={(e) => searchUsername(e.target.value)}
          />
          {fetching ? <p>Loading</p> : this.filterUsers()}
        </form>
      }
      {loggedIn &&
        <div styleName={'userInfo'}>
          <div>
            <ControlLabel>Prihlásený</ControlLabel>
            <p>{username}</p>
          </div>
          <div>
            <ControlLabel>Zostatok na účte</ControlLabel>
            <p>{balance.toFixed(2)}€</p>
          </div>
        </div>
      }
    </div>);
  }
}

export default connect(
  (state) => {
    const {balance, username} = get(
      state,
      [...PATH_SHOP, 'users', 'data', get(state, [...PATH_LOGIN, 'userId'])],
      {}
    );

    return {
      users: get(state, [...PATH_SHOP, 'users', 'data']),
      loggedIn: get(state, [...PATH_LOGIN, 'loggedIn']),
      search: get(state, [...PATH_LOGIN, 'search']),
      username,
      balance,
      fetching: get(state, [...PATH_SHOP, 'users', 'fetching']),
    };
  },
  (dispatch) => bindActionCreators(
    {searchUsername, login, loadUsers},
    dispatch,
  ),
  mergeProps
)(Login);
