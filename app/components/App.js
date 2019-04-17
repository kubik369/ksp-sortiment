import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import {connect} from 'react-redux';
import {get} from 'lodash';

import Sortiment from './Sortiment';
import AddStock from './AddStock';
import AddCredit from './AddCredit';
import Sidebar from './Sidebar';
import Registration from './Registration';
import Welcome from './Welcome';
import Notifications from './Notifications';
import Stats from './Stats';

import {PATH_SHOP} from '../state/shop';
import {PATH_LOGIN} from '../state/login';
import {pages} from '../constants/enums/pages';

import './App.css';

class App extends Component {

  render() {
    const {loggedIn, currentPage} = this.props;

    const allPages = {
      [pages.welcome]: !loggedIn && <Welcome />,
      [pages.registration]: <Registration />,
      [pages.addCredit]: <AddCredit />,
      [pages.addStock]: <AddStock />,
      [pages.store]: <Sortiment />,
      [pages.stats]: <Stats />,
    };

    return (
      <div>
        <Notifications />
        <Grid fluid>
          <Row>
            <Col xs={3} style={{padding: '0'}}>
              <Sidebar />
            </Col>
            <Col xs={9} style={{padding: '0'}}>
              {allPages[currentPage]}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    loggedIn: get(state, [...PATH_LOGIN, 'loggedIn']),
    currentPage: get(state, [...PATH_SHOP, 'currentPage']),
  }),
  null
)(App);
