import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import sessionService from '../services/sessionService';
import supabaseClient from '../services/supabaseClient';

const SessionForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [entreprises, setEntreprises] = useState([]);
  const [formations, setFormations] = useState([]);

  // Chargement des données pour le formulaire
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        // Chargement des entreprises
        const { data: entreprisesData, error: entreprisesError } = await supabaseClient
          .from('entreprises')
          .select('id, nom_entreprise')
          .order('nom_entreprise');
        
        if (entreprisesError) throw entreprisesError;
        setEntreprises(entreprisesData);
        
        // Chargement des formations
        const { data: formationsData, error: formationsError } = await supabaseClient
          .from('formations_catalogue')
          .select('id, titre')
          .order('titre');
        
        if (formationsError) throw formationsError;
        setFormations(formationsData);
        
        // Si mode édition, charger les données de la session
        if (isEdit && id) {
          const sessionData = await sessionService.getSessionById(id);
          
          // Remplir le formulaire avec les données de la session
          Object.keys(sessionData).forEach(key => {
            setValue(key, sessionData[key]);
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données du formulaire');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [isEdit, id, setValue]);

  // Soumission du formulaire
  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      // Conversion des types de données si nécessaire
      if (data.nombre_participants) {
        data.nombre_participants = parseInt(data.nombre_participants, 10);
      }
      
      let result;
      if (isEdit) {
        result = await sessionService.updateSession(id, data);
      } else {
        result = await sessionService.createSession(data);
      }
      
      // Redirection vers la page de détails de la session
      navigate(`/sessions/${result.id}`);
    } catch (err) {
      console.error('Erreur lors de la soumission du formulaire:', err);
      setError(`Erreur lors de ${isEdit ? 'la mise à jour' : 'la création'} de la session`);
      setSubmitting(false);
    }
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

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h1>{isEdit ? 'Modifier la Session' : 'Nouvelle Session de Formation'}</h1>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Entreprise *</Form.Label>
                  <Form.Select 
                    {...register('entreprise_id', { required: 'L\'entreprise est requise' })}
                    isInvalid={!!errors.entreprise_id}
                  >
                    <option value="">Sélectionnez une entreprise</option>
                    {entreprises.map(entreprise => (
                      <option key={entreprise.id} value={entreprise.id}>
                        {entreprise.nom_entreprise}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.entreprise_id?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Formation *</Form.Label>
                  <Form.Select 
                    {...register('formation_catalogue_id', { required: 'La formation est requise' })}
                    isInvalid={!!errors.formation_catalogue_id}
                  >
                    <option value="">Sélectionnez une formation</option>
                    {formations.map(formation => (
                      <option key={formation.id} value={formation.id}>
                        {formation.titre}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.formation_catalogue_id?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de début</Form.Label>
                  <Form.Control 
                    type="date" 
                    {...register('date_debut')}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de fin</Form.Label>
                  <Form.Control 
                    type="date" 
                    {...register('date_fin')}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de participants</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="1"
                    {...register('nombre_participants', { 
                      valueAsNumber: true,
                      min: { value: 1, message: 'Le nombre de participants doit être au moins 1' }
                    })}
                    isInvalid={!!errors.nombre_participants}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre_participants?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lieu</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Lieu de la formation"
                    {...register('lieu')}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                placeholder="Description de la session de formation"
                {...register('description')}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email de contact</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Email de contact"
                    {...register('email_contact', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Adresse email invalide'
                      }
                    })}
                    isInvalid={!!errors.email_contact}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email_contact?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Téléphone de contact</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Téléphone de contact"
                    {...register('telephone_contact')}
                  />
                </Form.Group>
              </Col>
            </Row>

            {isEdit && (
              <Form.Group className="mb-3">
                <Form.Label>Statut</Form.Label>
                <Form.Select {...register('statut')}>
                  <option value="demande">Demande</option>
                  <option value="planifiee">Planifiée</option>
                  <option value="confirmee">Confirmée</option>
                  <option value="en_cours">En cours</option>
                  <option value="terminee">Terminée</option>
                  <option value="annulee">Annulée</option>
                </Form.Select>
              </Form.Group>
            )}

            <div className="d-flex gap-2 mt-4">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    {isEdit ? 'Mise à jour...' : 'Création...'}
                  </>
                ) : (
                  isEdit ? 'Mettre à jour' : 'Créer la session'
                )}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/sessions')}
                disabled={submitting}
              >
                Annuler
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SessionForm;
