import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get, isFinite, toFinite} from 'lodash';
import axios from 'axios';
import {Grid, Row, Col, FormControl, Button, PageHeader, Panel} from 'react-bootstrap';

import {loadUsers, changeAddCreditBalance} from '../actions/shop';
import {addNotification} from '../actions/notifications';
import {PATH_LOGIN} from '../state/login';
import {PATH_SHOP} from '../state/shop';
import {mergeProps} from '../utils';

class AddCredit extends Component {
  addCredit = (e) => {
    e.preventDefault();
    const {userId, username, formBalance,
      actions: {loadUsers, addNotification, changeAddCreditBalance}} = this.props;
    const balance = formBalance.replace(/,/, '.');

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
        .then(() => changeAddCreditBalance(''))
        .catch(() => addNotification('Chyba počas pridávania kreditu.', 'error'));
  }

  render() {
    const {formBalance, actions: {changeAddCreditBalance}} = this.props;

    return (
      <Grid fluid style={{marginTop: '20px'}}>
        <Row>
          <Col xs={8}>
            <Panel>
              <PageHeader>Pridať kredit / vybrať hotovosť</PageHeader>
              <form onSubmit={(e) => this.addCredit(e)}>
                <Row>
                  <Col xs={6}>
                    <FormControl
                      type={'text'}
                      name={'credit'}
                      placeholder={'Kredit'}
                      value={formBalance}
                      onChange={(e) => changeAddCreditBalance(e.target.value)}
                      />
                  </Col>
                  <Col xs={4}>
                    <Button
                      bsStyle={'success'}
                      type={'submit'}
                      disabled={!isFinite(parseFloat(formBalance)) || (toFinite(formBalance) === 0)}
                    >
                      Pridaj kredit / vyber hotovosť
                    </Button>
                  </Col>
                  <Col xs={4} />
                </Row>
                <p>Ak chceš vybrať hotovosť zo svojho účtu, napíš zápornú hodnotu.</p>
              </form>
            </Panel>
          </Col>
          <Col xs={4} />
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
      formBalance: get(state, [...PATH_SHOP, 'addCredit']),
    };
  },
  (dispatch) => bindActionCreators({
    loadUsers,
    addNotification,
    changeAddCreditBalance,
  }, dispatch),
  mergeProps
)(AddCredit);
