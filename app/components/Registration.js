import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get, isNumber, toNumber} from 'lodash';
import axios from 'axios';
import {Grid, Row, Col, FormControl, Button, PageHeader, Panel, ControlLabel} from 'react-bootstrap';

import {goToPage} from '../actions/shop';
import {changeBalance, changeUsername, clearForm} from '../actions/registration';
import {login} from '../actions/login';
import {addNotification} from '../actions/notifications';
import {PATH_REGISTRATION} from '../state/registration';
import {mergeProps} from '../utils';

class Registration extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const {username, balance, actions: {login, addNotification, clearForm}} = this.props;

    if (!username || !isNumber(toNumber(balance))) {
      addNotification('Chýbajúce alebo chybné údaje!');
      return;
    }

    axios
      .post('/register', {username: username.trim(), balance})
      .then(clearForm)
      .then((res) => login(username))
      .catch((err) => {
        console.error(`Registration failed: ${err}`);
        addNotification('Niečo sa stalo, tvoje meno už je použité alebo nebolo možné dosiahnuť server.', 'error');
      });
  }

  handleChangeUsername = ({target: {value}}) => {
    this.props.actions.changeUsername(value.trim());
  }

  handleChangeBalance = ({target: {value}}) => {
    this.props.actions.changeBalance(value);
  }

  renderForm = () => {
    const {username, balance} = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <Row>
          <Col lg={4} md={4} sm={4}>
            <ControlLabel>Username</ControlLabel>
            <FormControl
              type={'text'}
              name={'username'}
              value={username}
              placeholder={'Username'}
              onChange={this.handleChangeUsername}
            />
          </Col>
          <Col lg={4} md={4} sm={4}>
            <ControlLabel>Počiatočný kredit</ControlLabel>
            <FormControl
              type={'text'}
              name={'balance'}
              value={balance}
              placeholder={'Počiatočný kredit'}
              onChange={this.handleChangeBalance}
            />
          </Col>
          <Col lg={4} md={4} sm={4}>
            <Button
              bsStyle={'success'}
              type={'submit'}
              style={{marginTop: '25px'}}
              disabled={!(username && balance != null && isNumber(balance))}
            >
              Registrácia
            </Button>
          </Col>
        </Row>
      </form>
    );
  }

  render() {
    return (
      <Grid fluid style={{marginTop: '20px'}}>
        <Row>
          <Col xs={12}>
            <Panel>
              <PageHeader>Registrácia</PageHeader>
              {this.renderForm()}
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  (state) => ({
    username: get(state, [...PATH_REGISTRATION, 'username']),
    balance: get(state, [...PATH_REGISTRATION, 'balance']),
  }),
  (dispatch) => bindActionCreators({
    goToPage,
    login,
    changeUsername,
    changeBalance,
    addNotification,
    clearForm,
  }, dispatch),
  mergeProps
)(Registration);
