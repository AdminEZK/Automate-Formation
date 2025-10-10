import React from 'react';
import { Container } from 'react-bootstrap';
import SessionList from './SessionList';

const SessionManager = () => {
  return (
    <Container className="my-4">
      <h1>Gestion des Sessions</h1>
      <SessionList />
    </Container>
  );
};

export default SessionManager;
