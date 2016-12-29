import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

import LoginC from '../containers/Login';

import {pages} from '../constants/enums/pages';

import './Sidebar.css';

export class Sidebar extends Component {
  render() {
    const {loggedIn, goToPage, logOut} = this.props;

    return (
      <div>
        <h1>Sortiment</h1>
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
              >Nabi kredit</Button>
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
      </div>
    );
  }
}