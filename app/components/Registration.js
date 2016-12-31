import React, {Component} from 'react';
import axios from 'axios';
import {Grid, Row, Col, FormControl, Button, PageHeader, Panel, ControlLabel} from 'react-bootstrap';


export class Registration extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const {username, balance, logIn} = this.props;

    axios
      .post('/register', {username: username, balance: balance})
      .then((res) => logIn(username))
      .catch(
        (err) => console.error(`Registration failed: ${err}`)
      );
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
                      type={'number'}
                      name={'balance'}
                      step={0.01}
                      value={balance}
                      onChange={(e) => changeRegistrationBalance(e.target.value)}
                    />
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Button bsStyle={'success'} type={'submit'} style={{marginTop: '25px'}}>
                      Registrácia
                    </Button>
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
