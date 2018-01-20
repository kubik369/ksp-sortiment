import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import axios from 'axios';
import {Grid, Row, Col, FormControl, Button,
  Panel, ControlLabel} from 'react-bootstrap';

import {goToPage, loadUsers} from '../actions/shop';
import {login} from '../actions/login';
import {addNotification} from '../actions/notifications';
import {mergeProps} from '../utils';

class Registration extends Component {

  componentWillMount() {
    this.state = {
      username: '',
      balance: '',
      isic: '',
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {username, balance, isic} = this.state;
    const {actions: {login, addNotification, clearForm, loadUsers}} = this.props;

    if (!username || !/^[0-9]*\.?[0-9]{1,2}$/.test(balance)) {
      addNotification('Chýbajúce alebo chybné údaje!');
      return;
    }

    const data = {
      username: username.trim(),
      balance,
    };

    if (isic && isic.length > 0) {
      data.isic = isic;
    }

    axios
      .post('/register', data)
      .then(async (res) => {
        await loadUsers();
        return res;
      })
      .then(({data: {user}}) => login(user))
      .then(clearForm)
      .catch((err) => {
        console.error(`Registration failed: ${err}`);
        addNotification(
          'Niečo sa stalo, tvoje meno už je použité ' +
            'alebo nebolo možné dosiahnuť server.',
          'error'
        );
      });
  }

  renderForm = () => {
    const {username, balance, isic} = this.state;

    return (
      <Panel header={<h1><b>Registrácia</b></h1>}>
        <form onSubmit={this.handleSubmit}>
          <Row>
            <Col xs={4}>
              <ControlLabel>Username</ControlLabel>
              <FormControl
                type={'text'}
                name={'username'}
                value={username}
                placeholder={'Username'}
                onChange={
                  ({target: {value}}) => this.setState({username: value})
                }
              />
            </Col>
            <Col xs={4}>
              <ControlLabel>Počiatočný kredit</ControlLabel>
              <FormControl
                type={'text'}
                name={'balance'}
                value={balance}
                placeholder={'Počiatočný kredit'}
                onChange={
                  ({target: {value}}) => this.setState({balance: value})
                }
              />
            </Col>
            <Col xs={4}>
              <Button
                bsStyle={'success'}
                type={'submit'}
                style={{marginTop: '25px'}}
                disabled={!(username && /^[0-9]*\.?[0-9]{1,2}$/.test(balance))}
              >
                Registrácia
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <ControlLabel>Počiatočný kredit</ControlLabel>
              <FormControl
                type={'text'}
                name={'isic'}
                value={isic}
                placeholder={'Číslo čipu ISICu'}
                onChange={
                  ({target: {value}}) => this.setState({isic: value})
                }
              />
            </Col>
            <Col xs={8} />
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
            {this.renderForm()}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  null,
  (dispatch) => bindActionCreators({
    goToPage,
    login,
    addNotification,
    loadUsers,
  }, dispatch),
  mergeProps
)(Registration);
