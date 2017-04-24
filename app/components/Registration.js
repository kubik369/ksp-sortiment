import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import axios from 'axios';
import {Grid, Row, Col, FormControl, Button, PageHeader, Panel, ControlLabel} from 'react-bootstrap';

import {
  goToPage,
  changeRegistrationUsername,
  changeRegistrationBalance,
  logIn,
} from '../actions/actions';
import {PATH_SHOP} from '../reducers/shop';

class Registration extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const {username, balance, logIn} = this.props;

    if (!(username && balance && !isNaN(balance))) {
      window.alert('Chýbajúce alebo chybné údaje!');
      return;
    }

    axios
      .post('/register', {username: username.trim(), balance})
      .then((res) => logIn(username))
      .catch((err) => {
        console.error(`Registration failed: ${err}`);
        // eslint-disable-next-line no-alert
        window.alert('Niečo sa stalo, tvoje meno už je použité alebo nebolo možné dosiahnuť server.');
      });
  }

  render() {
    const {
      username,
      balance,
      changeRegistrationUsername,
      changeRegistrationBalance,
    } = this.props;

    return (
      <Grid fluid style={{marginTop: '20px'}}>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Panel>
              <PageHeader>Registrácia</PageHeader>
              <form onSubmit={(e) => this.handleSubmit(e)}>
                <Row>
                  <Col lg={4} md={4} sm={4}>
                    <ControlLabel>Username</ControlLabel>
                    <FormControl
                      type={'text'}
                      name={'username'}
                      value={username}
                      placeholder={'Username'}
                      onChange={(e) => changeRegistrationUsername(e.target.value.trim())}
                    />
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <ControlLabel>Počiatočný kredit</ControlLabel>
                    <FormControl
                      type={'text'}
                      name={'balance'}
                      value={balance}
                      placeholder={'Počiatočný kredit'}
                      onChange={(e) => changeRegistrationBalance(e.target.value)}
                    />
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Button
                      bsStyle={'success'}
                      type={'submit'}
                      style={{marginTop: '25px'}}
                      disabled={!(username && balance && !isNaN(balance))}
                    >Registrácia</Button>
                  </Col>
                </Row>
              </form>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  (state) => ({
    username: get(state, [...PATH_SHOP, 'registration', 'username']),
    balance: get(state, [...PATH_SHOP, 'registration', 'balance']),
  }),
  (dispatch) => bindActionCreators({
    goToPage,
    logIn,
    changeRegistrationUsername,
    changeRegistrationBalance,
  }, dispatch)
)(Registration);
