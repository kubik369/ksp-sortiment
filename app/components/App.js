import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

import SortimentC from '../containers/Sortiment';
import AddStockC from '../containers/AddStock';
import AddCreditC from '../containers/AddCredit';
import SidebarC from '../containers/Sidebar';
import RegistrationC from '../containers/Registration';
import {Welcome} from './Welcome';

import {pages} from '../constants/enums/pages';

import './App.css';

export class App extends Component {
  render() {
    const {loggedIn, currentPage} = this.props;

    const allPages = {
      [pages.welcome]: !loggedIn && <Welcome />,
      [pages.registration]: <RegistrationC />,
      [pages.addCredit]: <AddCreditC />,
      [pages.addStock]: <AddStockC />,
      [pages.store]: <SortimentC />,
    };

    return (
      <Grid fluid style={{height: '100%', margin: '0'}}>
        <Row style={{height: '100%'}}>
          <Col lg={2} md={2} sm={2} style={{height: '100%', padding: '0'}}>
            <SidebarC />
          </Col>
          <Col lg={10} md={10} sm={10} style={{height: '100%', padding: '0'}}>
            {allPages[currentPage]}
          </Col>
        </Row>
      </Grid>
    );
  }
}
