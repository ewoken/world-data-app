import React from 'react';

import { Row, Card, Col } from 'antd';

function AboutView() {
  return (
    <div className="AboutView">
      <Row>
        <Col md={16}>
          <Card title={<h1>About</h1>}>
            <p>
              The goals of this app are:
              <ul>
                <li>to ease the vizualization of energy and economy data</li>
                <li>gather different data from different place</li>
                <li>
                  propose an open-source project to do so, in order to let
                  everybody contribute to a better understanding of these data.
                </li>
              </ul>
            </p>
            <p>
              {'This website has been developped by '}
              <a href="https://github.com/ewoken" rel="noopener noreferrer">
                ewoken
              </a>
              .
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AboutView;
