import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get, isFinite, toFinite} from 'lodash';
import axios from 'axios';
import {Grid, Row, Col, FormControl, Button, Panel} from 'react-bootstrap';

import {loadUsers} from '../actions/shop';
import {addNotification} from '../actions/notifications';
import {PATH_LOGIN} from '../state/login';
import {PATH_SHOP} from '../state/shop';
import {mergeProps} from '../utils';

import './AddCredit.css';

class AddCredit extends Component {

  componentWillMount = () => {
    this.state = {credit: ''};
  }

  addCredit = (e) => {
    e.preventDefault();
    const {
      userId, username,
      actions: {loadUsers, addNotification},
    } = this.props;
    const balance = this.state.credit.replace(/,/, '.');

    if (balance === null || !isFinite(parseFloat(balance)) || toFinite(balance) === 0) {
      addNotification('Neplatná čiastka!', 'error');
      return;
    }

    axios
      .post('/credit', {userId, credit: balance.trim()})
        .then((res) => loadUsers())
        .then((res) => addNotification(
          balance > 0
          ? `Čiastka ${balance} úspešne pridaná uživateľovi ${username}`
          : `Čiastka ${balance} úspešne odobratá od uživateľa ${username}`,
          'success'
        ))
        .then(() => this.setState({credit: ''}))
        .catch(() => addNotification('Chyba počas pridávania kreditu.', 'error'));
  }

  numpadOnClick = (key) => {
    this.setState({credit: this.state.credit + key});
  }

  renderNumpad = () => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '-']
      .map((key) => (
        <li key={key} onClick={() => this.numpadOnClick(key)}>{key}</li>
      ));

    return (
      <div styleName={'numpad-wrapper'}>
        <ul styleName={'numpad'}>
          {keys}
          <li />
          <li />
          <li rel="delete" onClick={() => this.setState({credit: ''})}>
            AC
          </li>
        </ul>
      </div>
    );
  }

  renderAddCreditForm = () => {
    return (
      <Panel header={<h1><b>Pridať kredit / vybrať hotovosť</b></h1>}>
        <form onSubmit={this.addCredit}>
          <Row>
            <Col xs={3}>
              <FormControl
                type={'text'}
                name={'credit'}
                placeholder={'Kredit'}
                value={this.state.credit}
                onChange={({target: {value}}) => this.setState({credit: value})}
                />
            </Col>
            <Col xs={4}>
              <Button
                bsStyle={'success'}
                type={'submit'}
                disabled={!/^[-]?[0-9]*\.?[0-9]{1,2}$/.test(this.state.credit)}
              >
                Pridaj kredit / vyber hotovosť
              </Button>
            </Col>
            <Col xs={5}>
              <p>Ak chceš vybrať hotovosť zo svojho účtu, napíš zápornú hodnotu.</p>
            </Col>
          </Row>
          <Row>
            <Col xs={5}>
              {this.renderNumpad()}
            </Col>
            <Col xs={7} />
          </Row>
        </form>
      </Panel>
    );
  }

  render() {
    return (
      <Grid fluid style={{marginTop: '20px'}}>
        <Row>
          <Col xs={12}>
            {this.renderAddCreditForm()}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  (state) => {
    const userId = get(state, [...PATH_LOGIN, 'userId'], -1);
    return {
      userId,
      username: get(state, [...PATH_SHOP, 'users', 'data', userId, 'username'], 'Unknown'),
    };
  },
  (dispatch) => bindActionCreators({
    loadUsers,
    addNotification,
  }, dispatch),
  mergeProps
)(AddCredit);
