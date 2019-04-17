import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {Button, Panel, Grid, Row, Col} from 'react-bootstrap';

import {pages} from '../constants/enums/pages';
import {goToPage} from '../actions/shop';
import {logout} from '../actions/login';
import {PATH_LOGIN} from '../state/login';
import {PATH_SHOP} from '../state/shop';
import {mergeProps} from '../utils';
import Login from './Login';
import Checkout from './Checkout';

import './Sidebar.css';

class Sidebar extends Component {

  renderLoggedIn = () => {
    const {username, balance, actions: {goToPage, logout}} = this.props;

    return (
      <div>
        <p>
          <b>{username}</b> - {balance.toFixed(2)}€
        </p>
        <div>
          <Button bsStyle={'primary'} onClick={() => goToPage(pages.store)} block>
            Obchod
          </Button>
          <Button styleName={'credit'} bsStyle={'primary'} onClick={() => goToPage(pages.addCredit)} block>
            Nabi kredit <br />vyber hotovosť
          </Button>
          <Button bsStyle={'primary'} onClick={() => goToPage(pages.addStock)} block>
            Pridaj tovar
          </Button>
          <Button bsStyle={'danger'} onClick={logout} block>
            Odhlásenie
          </Button>
        </div>
      </div>
    );
  }

  renderLoggedOut = () => {
    const {actions: {goToPage}} = this.props;

    return (
      <div>
        <Button bsStyle={'primary'} onClick={() => goToPage(pages.welcome)} block>
          Home
        </Button>
        <Button bsStyle={'primary'} onClick={() => goToPage(pages.registration)} block>
          Registrácia
        </Button>
        <Button bsStyle={'primary'} onClick={() => goToPage(pages.stats)} block>
          Štatistiky
        </Button>
      </div>
    );
  }

  render() {
    const {loggedIn} = this.props;

    return (
      <Grid fluid style={{marginTop: '20px', padding: 0, paddingLeft: '10px'}}>
        <Row>
          <Col xs={12}>
            <Panel style={{padding: '0'}}>
              <Panel.Heading styleName="versionTitle">
                <b>Sortiment v{process.env.VERSION}</b>
              </Panel.Heading>
              <Panel.Body>
                {loggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}
                <Login />
                <Checkout />
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
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
      username,
      balance,
      loggedIn: get(state, [...PATH_LOGIN, 'loggedIn']),
    };
  },
  (dispatch) => bindActionCreators({
    goToPage,
    logout,
  }, dispatch),
  mergeProps
)(Sidebar);
