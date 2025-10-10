import React, { useState } from 'react';
import { Table, Badge, Button, Modal, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import sessionService from '../services/sessionService';

const SessionList = ({ sessions, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  // Formatage du statut avec badge coloré
  const renderStatus = (status) => {
    let variant;
    let label;

    switch (status) {
      case 'demande':
        variant = 'info';
        label = 'Demande';
        break;
      case 'planifiee':
        variant = 'primary';
        label = 'Planifiée';
        break;
      case 'confirmee':
        variant = 'success';
        label = 'Confirmée';
        break;
      case 'en_cours':
        variant = 'warning';
        label = 'En cours';
        break;
      case 'terminee':
        variant = 'dark';
        label = 'Terminée';
        break;
      case 'annulee':
        variant = 'danger';
        label = 'Annulée';
        break;
      default:
        variant = 'secondary';
        label = status || 'Inconnu';
    }

    return <Badge bg={variant}>{label}</Badge>;
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

  // Confirmation de suppression
  const confirmDelete = (session) => {
    setSessionToDelete(session);
    setShowDeleteModal(true);
  };

  // Suppression d'une session
  const handleDelete = async () => {
    if (!sessionToDelete) return;
    
    try {
      // Appel du callback de suppression fourni par le parent
      if (onDelete) {
        await onDelete(sessionToDelete.id);
      }
      
      setShowDeleteModal(false);
      setSessionToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de la session:', error);
    }
  };

  return (
    <>
      {sessions.length === 0 ? (
        <div className="text-center my-5">
          <p>Aucune session de formation trouvée.</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Formation</th>
              <th>Statut</th>
              <th>Date de début</th>
              <th>Date de fin</th>
              <th>Participants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>{session.nom_entreprise || 'N/A'}</td>
                <td>{session.titre_formation || 'N/A'}</td>
                <td>{renderStatus(session.statut)}</td>
                <td>{formatDate(session.date_debut)}</td>
                <td>{formatDate(session.date_fin)}</td>
                <td>{session.nombre_participants || 0}</td>
                <td>
                  <ButtonGroup size="sm">
                    <Link to={`/sessions/${session.id}`}>
                      <Button variant="outline-primary" size="sm">
                        <i className="fas fa-eye me-1"></i>Voir
                      </Button>
                    </Link>
                    <Link to={`/sessions/${session.id}/edit`}>
                      <Button variant="outline-secondary" size="sm">
                        <i className="fas fa-edit me-1"></i>Modifier
                      </Button>
                    </Link>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => confirmDelete(session)}
                    >
                      <i className="fas fa-trash-alt me-1"></i>Supprimer
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {sessionToDelete && (
            <p>
              Êtes-vous sûr de vouloir supprimer la session de formation pour{' '}
              <strong>{sessionToDelete.nom_entreprise}</strong> concernant{' '}
              <strong>{sessionToDelete.titre_formation}</strong> ?
            </p>
          )}
          <p className="text-danger">Cette action est irréversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SessionList;
