import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {Grid, Row, Col, Panel, Table} from 'react-bootstrap';

import {loadUsers, loadProducts} from '../actions/shop';
import {addNotification} from '../actions/notifications';
import {PATH_SHOP} from '../state/shop';
import {mergeProps} from '../utils';

import './AddCredit.css';

class Stats extends Component {

  componentWillMount() {
    this.props.actions.loadUsers();
    this.props.actions.loadProducts();
  }

  compareUserBalanceAscending = (a, b) => {
    if (a.balance < b.balance) {
      return -1;
    }
    if (a.balance > b.balance) {
      return 1;
    }
    return 0;
  }

  compareUserBalanceDescending = (a, b) => {
    return -this.compareUserBalanceAscending(a, b);
  }

  renderDebtors = () => {
    const debtors = Object.values(this.props.users)
      .filter(({balance}) => balance < 0)
      .sort(this.compareUserBalanceAscending)
      .slice(0, 10)
      .map(({username, balance}, i) => (
        <tr key={i}>
          <td key="username">{username}</td>
          <td key="balance">{balance.toFixed(2)}</td>
        </tr>
      ));

    return (
      <div>
        <h2>Dlžníci</h2>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Dlh</th>
            </tr>
          </thead>
          <tbody>
            {debtors}
          </tbody>
        </Table>
      </div>
    );
  }

  moneyStatus = () => {
    const totalProductValue = Object.values(this.props.products)
      .reduce((total, product) => total + product.price * product.stock, 0);
    const totalDebt = -Object.values(this.props.users)
      .filter(({balance}) => balance < 0)
      .reduce((total, user) => total + user.balance, 0);
    const totalCredit = Object.values(this.props.users)
      .filter(({balance}) => balance > 0)
      .reduce((total, user) => total + user.balance, 0);
    const bufetNetCapital = totalProductValue + totalDebt - totalCredit;

    return (
      <div>
        <h2>Hodnota bufetu</h2>
        <span><b>Net</b></span>
        <p>
          {`
            ${totalProductValue.toFixed(2)}
              + ${totalDebt.toFixed(2)}
              - ${totalCredit.toFixed(2)}
              = ${bufetNetCapital.toFixed(2)}
          `}
        </p>
        <span><b>Bez vyplatenia kreditov</b></span>
        <p>
          {`
            ${totalProductValue.toFixed(2)}
              + ${totalDebt.toFixed(2)}
              = ${(bufetNetCapital + totalCredit).toFixed(2)}
          `}
        </p>
        <span><b>Hodnota tovaru</b></span>
        <p>{totalProductValue.toFixed(2)}</p>
        <span><b>Celkový dlh</b></span>
        <p>{totalDebt.toFixed(2)}</p>
        <span><b>Celkový kredit</b></span>
        <p>{totalCredit.toFixed(2)}</p>
      </div>
    );
  }

  renderCreditors = () => {
    const creditors = Object.values(this.props.users)
      .filter(({balance}) => balance > 0)
      .sort(this.compareUserBalanceDescending)
      .slice(0, 10)
      .map(({username, balance}, i) => (
        <tr key={i}>
          <td key="username">{username}</td>
          <td key="balance">{balance.toFixed(2)}</td>
        </tr>
      ));

    return (
      <div>
        <h2>Kreditori</h2>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Kredit</th>
            </tr>
          </thead>
          <tbody>
            {creditors}
          </tbody>
        </Table>
      </div>
    );
  }

  render() {
    return (
      <Grid fluid style={{marginTop: '20px'}}>
        <Row>
          <Panel header={'Štatistiky'}>
            <Col xs={4}>
              {this.renderDebtors()}
            </Col>
            <Col xs={4}>
              {this.renderCreditors()}
            </Col>
            <Col xs={4}>
              {this.moneyStatus()}
            </Col>
          </Panel>
        </Row>
      </Grid>
    );
  }
}

export default connect(
  (state) => ({
    users: get(state, [...PATH_SHOP, 'users', 'data']),
    products: get(state, [...PATH_SHOP, 'products', 'data']),
  }),
  (dispatch) => bindActionCreators({
    loadUsers,
    loadProducts,
    addNotification,
  }, dispatch),
  mergeProps
)(Stats);
