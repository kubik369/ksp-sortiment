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

import {PATH_SHOP} from '../reducers/shop';
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
    };

    return (
      <div>
        <Notifications />
        <Grid fluid>
          <Row>
            <Col lg={2} md={2} sm={2} style={{padding: '0'}}>
              <Sidebar />
            </Col>
            <Col lg={10} md={10} sm={10} style={{padding: '0'}}>
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
    addingStock: get(state, [...PATH_SHOP, 'newStock', 'active']),
    loggedIn: get(state, [...PATH_SHOP, 'login', 'loggedIn']),
    currentPage: get(state, [...PATH_SHOP, 'currentPage']),
  }),
  null
)(App);
