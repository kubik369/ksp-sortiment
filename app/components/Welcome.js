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

  getButtonColourByBalance = (balance) => {
    if (balance < -5.0) {
      return 'danger';
    } else if (balance < 0) {
      return 'warning';
    } else if (balance < 5) {
      return 'info';
    } else {
      return 'success';
    }
  }

  renderButton = ({id, username, balance}) => {
    const {actions: {login}} = this.props;
    const isSeverelyIndebted = balance < -10;

    return (
      <Button
        key={id}
        bsStyle={this.getButtonColourByBalance(balance)}
        styleName={isSeverelyIndebted ? 'debt' : 'nameLogin'}
        onClick={() => login(id)}
      >
        {username}
      </Button>
    );
  }

  renderWelcomeText = () => {
    const GUEST_ID = 1;
    return (
      <div>
        <h1 styleName="title">Vitaj, hladný pocestný</h1>
        <p>
          Ak si v našom sortimente ešte nenakupoval, prosím, zaregistruj
          sa.<br />
          Ak to tu už poznáš, prihlás sa vyhľadaním a následným kliknutím
          na svoje meno.<br />
          Ak si tu len na návšteve, použi prosím účet
          <Button
            styleName={'nameLogin'}
            bsStyle={'success'}
            onClick={() => this.props.actions.login(GUEST_ID)}
          >
            guest
          </Button>
        </p>
      </div>
    );
  }

  renderUserLoginButtons = () => (
    Object.values(this.props.users)
      .slice(1)
      .map(this.renderButton)
  )

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={12} styleName={'wrapper'}>
            <Jumbotron>
              {this.renderWelcomeText()}
              {this.renderUserLoginButtons()}
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
