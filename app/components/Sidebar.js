import React, {Component} from 'react';
import {Button, Panel, Grid, Row, Col} from 'react-bootstrap';

import LoginC from '../containers/Login';

import {pages} from '../constants/enums/pages';

import './Sidebar.css';

export class Sidebar extends Component {
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
                    bsStyle={'primary'}
                    onClick={() => goToPage(pages.addCredit)}
                    block
                    >Nabi kredit / vyber hotovosť</Button>
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
              <LoginC />
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}
