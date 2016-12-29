import React, {Component} from 'react';
import axios from 'axios';
import {Grid, Row, Col, FormControl, PageHeader} from 'react-bootstrap';

export class AddCredit extends Component {
  addCredit = (e) => {
    e.preventDefault();
    const {username, fetchUsers} = this.props;
    const credit = e.target.credit.value;

    // eslint-disable-next-line no-alert
    if (window.confirm(`Želáte si pridať ${credit}€ uživateľovi ${username}?`)) {
      axios
        .post(
          '/credit', {username: username, credit: credit}
        ).then(
          (res) => fetchUsers()
        ).catch(
          (err) => console.error('Could not add credit', err) // eslint-disable-line no-console
        );
    }
  }

  render() {
    const {changeBalance} = this.props;

    return (
      <Grid style={{marginTop: '50px'}}>
        <Row>
          <Col lg={4} md={4} sm={4} key={0} />
          <Col lg={4} md={4} sm={4} key={1}>
            <PageHeader>Pridať kredit</PageHeader>
            <form onSubmit={(e) => this.addCredit(e)}>
              <FormControl
                type={'number'}
                name={'credit'}
                step={0.01}
                placeholder={'Kredit'}
                onChange={(e) => changeBalance(e.target.value)} />
              <FormControl type={'submit'} value={'Pridaj kredit'} />
            </form>
          </Col>
          <Col lg={4} md={4} sm={4} key={2} />
        </Row>
      </Grid>
    );
  }
}
