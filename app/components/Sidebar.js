import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {Button, Panel, Grid, Row, Col} from 'react-bootstrap';

import {pages} from '../constants/enums/pages';
import {goToPage, logOut} from '../actions/actions';
import {PATH_SHOP} from '../reducers/shop';
import Login from './Login';

import './Sidebar.css';

class Sidebar extends Component {
  render() {
    const {loggedIn, goToPage, logOut} = this.props;

    return (
      <Grid fluid style={{marginTop: '20px'}}>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Panel style={{padding: '0'}}>
              <Row>
                <h1>Sortiment</h1>
              </Row>
              {!loggedIn &&
                <Button
                  bsStyle={'primary'}
                  onClick={() => goToPage(pages.registration)}
                  block
                >Registration</Button>
              }
              {loggedIn &&
                <div>
                  <Button
                    bsStyle={'primary'}
                    onClick={() => goToPage(pages.store)}
                    block
                    >Obchod</Button>
                  <Button
                    styleName={'credit'}
                    bsStyle={'primary'}
                    onClick={() => goToPage(pages.addCredit)}
                    block
                    >Nabi kredit <br />vyber hotovosť</Button>
                  <Button
                    bsStyle={'primary'}
                    onClick={() => goToPage(pages.addStock)}
                    block
                    >Pridaj tovar</Button>
                  <Button
                    bsStyle={'danger'}
                    onClick={() => logOut()}
                    block
                    >Odhlásenie</Button>
                </div>
              }
              <Login />
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  (state) => ({
    addingStock: get(state, [...PATH_SHOP, 'newStock', 'active']),
    loggedIn: get(state, [...PATH_SHOP, 'login', 'loggedIn']),
  }),
  (dispatch) => bindActionCreators({goToPage, logOut}, dispatch)
)(Sidebar);
