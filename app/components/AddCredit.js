import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get, isNumber, toNumber} from 'lodash';
import axios from 'axios';
import {Grid, Row, Col, FormControl, Button, PageHeader, Panel} from 'react-bootstrap';

import {fetchUsers, changeBalance, resetAddCredit} from '../actions/actions';
import {addNotification} from '../actions/notifications';
import {PATH_SHOP} from '../reducers/shop';

class AddCredit extends Component {
  addCredit = (e) => {
    e.preventDefault();
    const {username, fetchUsers, addNotification, resetAddCredit} = this.props;
    const balance = this.props.balance.replace(/,/, '.');

    if (balance === null || !isNumber(parseFloat(balance)) || toNumber(balance) === 0) {
      addNotification('Neplatná čiastka!', 'error');
      return;
    }

    axios
      .post('/credit', {username: username, credit: balance.trim()})
        .then((res) => fetchUsers())
        .then((res) => addNotification(
          balance > 0
          ? `Čiastka ${balance} úspešne pridaná uživateľovi ${username}`
          : `Čiastka ${balance} úspešne odobratá od uživateľa ${username}`,
          'success'
        ))
        .then(resetAddCredit)
        .catch(() => addNotification('Chyba počas pridávania kreditu.', 'error'));
  }

  render() {
    const {changeBalance, balance} = this.props;

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
                      value={balance}
                      onChange={(e) => changeBalance(e.target.value)}
                      />
                  </Col>
                  <Col xs={4}>
                    <Button
                      bsStyle={'success'}
                      type={'submit'}
                      disabled={!isNumber(parseFloat(balance)) || (toNumber(balance) === 0)}
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
  (state) => ({
    username: get(state, [...PATH_SHOP, 'login', 'username'], 'No user selected'),
    balance: get(state, [...PATH_SHOP, 'balance'], 0),
  }),
  (dispatch) => bindActionCreators({
    fetchUsers,
    changeBalance,
    addNotification,
    resetAddCredit,
  }, dispatch),
)(AddCredit);
