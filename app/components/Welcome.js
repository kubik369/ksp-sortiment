import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {Grid, Row, Col, Jumbotron, Button} from 'react-bootstrap';

import {fetchUsers, logIn} from '../actions/actions';
import {PATH_SHOP} from '../reducers/shop';

import './Welcome.css';

class Welcome extends Component {

  componentWillMount() {
    this.props.fetchUsers();
  }

  render() {
    const {users, logIn} = this.props;
    const buttonStyles = ['success', 'danger', 'info', 'warning'];

    return (
      <Grid fluid>
        <Row>
          <Col lg={12} md={12} sm={12} styleName={'wrapper'}>
            <Jumbotron>
              <h1 styleName="title">Vitaj, hladný pocestný</h1>
              <p>
                Ak si v našom sortimente ešte nenakupoval, prosím, zaregistruj sa. <br />
                Ak to tu už poznáš, prihlás sa vyhľadaním a následným kliknutím na svoje meno. <br />
                Ak si tu len na návšteve, použi prosím účet "guest".
              </p>
              {Object.values(users).map(({username}, i) => (
                <Button
                  styleName={'nameLogin'}
                  key={i}
                  bsStyle={buttonStyles[username.charCodeAt(0) % 4]}
                  onClick={() => logIn(username)}
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
    {fetchUsers, logIn},
    dispatch
  )
)(Welcome);
