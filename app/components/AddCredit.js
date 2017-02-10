import React, {Component} from 'react';
import axios from 'axios';
import {Grid, Row, Col, FormControl, Button, PageHeader, Panel} from 'react-bootstrap';

export class AddCredit extends Component {
  addCredit = (e) => {
    e.preventDefault();
    const {username, fetchUsers, balance} = this.props;

    if (balance == null || balance <= 0) {
      window.alert('Neplatná hodnota!');
      return;
    }
    // eslint-disable-next-line no-alert
    if (window.confirm(`Želáte si pridať ${balance}€ uživateľovi ${username}?`)) {
      axios
        .post(
          '/credit', {username: username, credit: balance.trim()}
        ).then(
          (res) => fetchUsers()
        ).catch(
          (err) => console.error('Could not add credit', err) // eslint-disable-line no-console
        );
    }
  }

  render() {
    const {changeBalance, balance} = this.props;

    return (
      <Grid fluid style={{marginTop: '20px'}}>
        <Row>
          <Col lg={8} md={8} sm={8}>
            <Panel>
              <PageHeader>Pridať kredit</PageHeader>
              <form onSubmit={(e) => this.addCredit(e)}>
                <Row>
                  <Col lg={6} md={6} sm={6}>
                    <FormControl
                      type={'text'}
                      name={'credit'}
                      placeholder={'Kredit'}
                      value={balance}
                      onChange={(e) => changeBalance(e.target.value)}
                      />
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Button bsStyle={'success'} type={'submit'} disabled={!(balance > 0)}>
                      Pridaj kredit
                    </Button>
                  </Col>
                  <Col lg={2} md={2} sm={2} />
                </Row>
              </form>
            </Panel>
          </Col>
          <Col lg={4} md={4} sm={4} />
        </Row>
      </Grid>
    );
  }
}
