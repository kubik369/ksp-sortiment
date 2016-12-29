import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

export class Welcome extends Component {

  render() {

    return (
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12} style={{height: '100%'}}>
            Welcome
          </Col>
        </Row>
      </Grid>
    );
  }
}
