import React, {Component} from 'react';
import {Grid, Row, Col, Jumbotron} from 'react-bootstrap';

import './Welcome.css';

export class Welcome extends Component {

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col lg={12} md={12} sm={12} style={{height: '100%', marginTop: '20px'}}>
            <Jumbotron>
              <h1 styleName={'title'}>Vitaj, hladný pocestný</h1>
              <p>Ak si v našom sortimente ešte nenakupoval, prosím, zaregistruj sa.</p>
              <p>Ak to tu už poznáš, prihlás sa vyhľadaním a následným kliknutím na svoje meno.</p>
            </Jumbotron>
          </Col>
        </Row>
      </Grid>
    );
  }
}
