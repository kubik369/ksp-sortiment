import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {Button, Panel, Grid, Row, Col} from 'react-bootstrap';

import {pages} from '../constants/enums/pages';
import {goToPage} from '../actions/shop';
import {logout} from '../actions/login';
import {PATH_LOGIN} from '../state/login';
import {mergeProps} from '../utils';
import Login from './Login';

import './Sidebar.css';

class Sidebar extends Component {

  renderLoggedIn = () => {
    const {actions: {goToPage, logout}} = this.props;

    return (
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
      </div>
    );
  }

  render() {
    const {loggedIn} = this.props;

    return (
      <Grid fluid style={{marginTop: '20px'}}>
        <Row>
          <Col xs={12}>
            <Panel style={{padding: '0'}}>
              <Row>
                <h1>Sortiment</h1>
              </Row>
              {loggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}
              <Login />
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  (state) => ({
    loggedIn: get(state, [...PATH_LOGIN, 'loggedIn']),
  }),
  (dispatch) => bindActionCreators({
    goToPage,
    logout,
  }, dispatch),
  mergeProps
)(Sidebar);
