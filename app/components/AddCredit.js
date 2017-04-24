import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import axios from 'axios';
import {Grid, Row, Col, FormControl, Button, PageHeader, Panel} from 'react-bootstrap';

import {fetchUsers, changeBalance} from '../actions/actions';
import {addNotification} from '../actions/notifications';
import {PATH_SHOP} from '../reducers/shop';

class AddCredit extends Component {
  addCredit = (e) => {
    e.preventDefault();
    const {username, fetchUsers, balance, addNotification} = this.props;

    if (balance == null) {
      addNotification('Neplatná čiastka!', 'error');
      return;
    }

    axios
      .post('/credit', {username: username, credit: balance.trim()})
        .then((res) => fetchUsers())
        .then((res) => addNotification(
          `Čiastka ${balance} úspešne pridaná uživateľovi ${username}`, 'success'
        ))
        .catch((err) => addNotification('Chyba počas pridávania kreditu.', 'error'));
  }

  render() {
    const {changeBalance, balance} = this.props;

    return (
      <Grid fluid style={{marginTop: '20px'}}>
        <Row>
          <Col lg={8} md={8} sm={8}>
            <Panel>
              <PageHeader>Pridať kredit / vybrať hotovosť</PageHeader>
              <form onSubmit={(e) => this.addCredit(e)}>
                <Row>
                  <Col lg={6} md={6} sm={6}>
                    <FormControl
                      type={'text'}
                      name={'credit'}
                      placeholder={'Kredit'}
                      value={balance}
                      onChange={(e) => changeBalance(e.target.value)}
                      />
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Button bsStyle={'success'}
                      type={'submit'}
                      disabled={isNaN(balance) || (balance == 0)}
                      >Pridaj kredit / vyber hotovosť
                    </Button>
                  </Col>
                  <Col lg={2} md={2} sm={2} />
                </Row>
                <p>Ak chceš vybrať hotovosť zo svojho účtu, napíš zápornú hodnotu.</p>
              </form>
            </Panel>
          </Col>
          <Col lg={4} md={4} sm={4} />
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
    addNotification
  }, dispatch),
)(AddCredit);
