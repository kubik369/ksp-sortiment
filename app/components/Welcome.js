import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {Grid, Row, Col, Jumbotron, Button} from 'react-bootstrap';

import {loadUsers} from '../actions/shop';
import {login} from '../actions/login';
import {mergeProps} from '../utils';
import {PATH_SHOP} from '../state/shop';

import './Welcome.css';

class Welcome extends Component {

  componentWillMount() {
    this.props.actions.loadUsers();
  }

  render() {
    const {users, actions: {login}} = this.props;
    const buttonStyles = ['success', 'danger', 'info', 'warning'];

    return (
      <Grid fluid>
        <Row>
          <Col xs={12} styleName={'wrapper'}>
            <Jumbotron>
              <h1 styleName="title">Vitaj, hladný pocestný</h1>
              <p>
                Ak si v našom sortimente ešte nenakupoval, prosím, zaregistruj sa. <br />
                Ak to tu už poznáš, prihlás sa vyhľadaním a následným kliknutím na svoje meno. <br />
                Ak si tu len na návšteve, použi prosím účet
                <Button styleName={'nameLogin'} bsStyle={buttonStyles[2]} onClick={() => login('guest')}>
                  guest
                </Button>
              </p>
              {Object.values(users).map(({id, username}, i) => (
                <Button
                  key={i}
                  styleName={'nameLogin'}
                  bsStyle={buttonStyles[username.charCodeAt(0) % 4]}
                  onClick={() => login(id)}
                >{username}</Button>
              ))}
            </Jumbotron>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  (state) => ({
    users: get(state, [...PATH_SHOP, 'users', 'data']),
  }),
  (dispatch) => bindActionCreators(
    {loadUsers, login},
    dispatch
  ),
  mergeProps
)(Welcome);
