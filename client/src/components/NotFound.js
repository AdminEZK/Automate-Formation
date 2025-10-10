import React from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Alert variant="warning">
            <Alert.Heading className="text-center">Page non trouvée</Alert.Heading>
            <p className="text-center mb-4">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <div className="d-flex justify-content-center">
              <Button as={Link} to="/" variant="primary">
                Retour à l'accueil
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
