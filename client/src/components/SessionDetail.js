import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import sessionService from '../services/sessionService';

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Statuts possibles pour les sessions
  const statusOptions = [
    { value: 'demande', label: 'Demande', variant: 'info' },
    { value: 'planifiee', label: 'Planifiée', variant: 'primary' },
    { value: 'confirmee', label: 'Confirmée', variant: 'success' },
    { value: 'en_cours', label: 'En cours', variant: 'warning' },
    { value: 'terminee', label: 'Terminée', variant: 'dark' },
    { value: 'annulee', label: 'Annulée', variant: 'danger' }
  ];

  // Chargement des détails de la session
  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        setLoading(true);
        const data = await sessionService.getSessionById(id);
        setSession(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des détails de la session');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [id]);

  // Mise à jour du statut de la session
  const updateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      await sessionService.updateSessionStatus(id, newStatus);
      
      // Rechargement des données de la session
      const updatedSession = await sessionService.getSessionById(id);
      setSession(updatedSession);
      
      setError(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut de la session');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Rendu du statut actuel
  const renderCurrentStatus = () => {
    if (!session || !session.statut) return null;
    
    const statusOption = statusOptions.find(option => option.value === session.statut);
    if (!statusOption) return <Badge bg="secondary">Inconnu</Badge>;
    
    return <Badge bg={statusOption.variant}>{statusOption.label}</Badge>;
  };

  // Rendu des boutons de changement de statut
  const renderStatusButtons = () => {
    if (!session) return null;
    
    return (
      <div className="d-flex flex-wrap gap-2 mt-3">
        {statusOptions.map(option => (
          <Button
            key={option.value}
            variant={option.variant}
            size="sm"
            disabled={session.statut === option.value || updating}
            onClick={() => updateStatus(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate('/sessions')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container className="my-4">
        <Alert variant="warning">Session non trouvée</Alert>
        <Button variant="primary" onClick={() => navigate('/sessions')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h1>Détails de la Session</h1>
        </Col>
        <Col xs="auto" className="d-flex align-items-center gap-2">
          <Link to={`/sessions/${id}/edit`}>
            <Button variant="outline-primary">
              <i className="fas fa-edit me-1"></i>Modifier
            </Button>
          </Link>
          <Button variant="outline-secondary" onClick={() => navigate('/sessions')}>
            Retour à la liste
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Informations générales</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Entreprise:</strong> {session.nom_entreprise || 'N/A'}</p>
                  <p><strong>Formation:</strong> {session.titre_formation || 'N/A'}</p>
                  <p><strong>Statut:</strong> {renderCurrentStatus()}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Date de début:</strong> {formatDate(session.date_debut)}</p>
                  <p><strong>Date de fin:</strong> {formatDate(session.date_fin)}</p>
                  <p><strong>Nombre de participants:</strong> {session.nombre_participants || 0}</p>
                </Col>
              </Row>
              
              <hr />
              
              <h6>Changer le statut:</h6>
              {updating ? (
                <div className="text-center my-2">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : (
                renderStatusButtons()
              )}
            </Card.Body>
          </Card>

          {session.description && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Description</h5>
              </Card.Header>
              <Card.Body>
                <p>{session.description}</p>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Contact</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Email:</strong> {session.email_contact || 'Non spécifié'}</p>
              <p><strong>Téléphone:</strong> {session.telephone_contact || 'Non spécifié'}</p>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Informations complémentaires</h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Créée le:</strong> {formatDate(session.session_created_at)}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Mise à jour le:</strong> {formatDate(session.session_updated_at)}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Lieu:</strong> {session.lieu || 'Non spécifié'}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SessionDetail;
