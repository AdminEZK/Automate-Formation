import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import sessionService from '../services/sessionService';
import './Dashboard.css';

const Dashboard = () => {
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

  // Statistiques
  const stats = {
    total: sessions.length,
    demandes: sessions.filter(s => s.statut === 'demande').length,
    confirmees: sessions.filter(s => s.statut === 'confirmee').length,
    en_cours: sessions.filter(s => s.statut === 'en_cours').length,
    terminees: sessions.filter(s => s.statut === 'terminee').length,
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Tableau de Bord</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {/* Statistiques */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h3>{stats.total}</h3>
                  <p className="text-muted">Total Sessions</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-info">
                <Card.Body>
                  <h3 className="text-info">{stats.demandes}</h3>
                  <p className="text-muted">Demandes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-success">
                <Card.Body>
                  <h3 className="text-success">{stats.confirmees}</h3>
                  <p className="text-muted">Confirmées</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-warning">
                <Card.Body>
                  <h3 className="text-warning">{stats.en_cours}</h3>
                  <p className="text-muted">En Cours</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Dernières demandes */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Dernières Demandes de Formation</h5>
            </Card.Header>
            <Card.Body>
              {sessions.length === 0 ? (
                <p className="text-center text-muted">Aucune session trouvée.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Entreprise</th>
                        <th>Formation</th>
                        <th>Statut</th>
                        <th>Date début</th>
                        <th>Participants</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.slice(0, 10).map(session => (
                        <tr key={session.id}>
                          <td>{session.nom_entreprise || 'N/A'}</td>
                          <td>{session.titre_formation || session.formation_titre || 'N/A'}</td>
                          <td>
                            <span className={`badge bg-${
                              session.statut === 'demande' ? 'info' :
                              session.statut === 'confirmee' ? 'success' :
                              session.statut === 'en_cours' ? 'warning' :
                              session.statut === 'terminee' ? 'dark' : 'secondary'
                            }`}>
                              {session.statut}
                            </span>
                          </td>
                          <td>{session.date_debut ? new Date(session.date_debut).toLocaleDateString('fr-FR') : 'N/A'}</td>
                          <td>{session.nombre_participants || 0}</td>
                          <td>
                            <Link to={`/sessions/${session.id}`} className="btn btn-sm btn-outline-primary">
                              Voir
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="text-center mt-3">
                <Link to="/sessions" className="btn btn-primary">
                  Voir toutes les sessions
                </Link>
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
