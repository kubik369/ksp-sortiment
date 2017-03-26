import React, {Component} from 'react';
import {Grid, Row, Col, Jumbotron, Button} from 'react-bootstrap';

import './Welcome.css';

export class Welcome extends Component {

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
