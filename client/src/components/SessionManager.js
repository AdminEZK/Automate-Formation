import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SessionList from './SessionList';
import sessionService from '../services/sessionService';

const SessionManager = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getAllSessions();
      setSessions(data || []);
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des sessions:', err);
      setError('Impossible de charger les sessions. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId) => {
    try {
      await sessionService.deleteSession(sessionId);
      // Recharger la liste après suppression
      await loadSessions();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Impossible de supprimer la session.');
    }
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestion des Sessions</h1>
        <Link to="/sessions/new">
          <Button variant="primary">
            <i className="fas fa-plus me-2"></i>
            Nouvelle Session
          </Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : (
        <SessionList sessions={sessions} onDelete={handleDelete} />
      )}
    </Container>
  );
};

export default SessionManager;
