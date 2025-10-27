import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import supabaseClient from '../services/supabaseClient';

const FormateursList = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFormateur, setEditingFormateur] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  // Charger la liste des formateurs
  const loadFormateurs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from('formateurs')
        .select('*')
        .order('nom', { ascending: true });
      
      if (error) throw error;
      setFormateurs(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des formateurs:', err);
      setError('Erreur lors du chargement des formateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFormateurs();
  }, []);

  // Ouvrir le modal pour ajouter un formateur
  const handleAdd = () => {
    setEditingFormateur(null);
    reset({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      specialites: '',
      tarif_horaire: '',
      tarif_journalier: '',
      cv_url: '',
      actif: true
    });
    setShowModal(true);
  };

  // Ouvrir le modal pour éditer un formateur
  const handleEdit = (formateur) => {
    setEditingFormateur(formateur);
    reset({
      nom: formateur.nom,
      prenom: formateur.prenom,
      email: formateur.email,
      telephone: formateur.telephone || '',
      specialites: formateur.specialites ? formateur.specialites.join(', ') : '',
      tarif_horaire: formateur.tarif_horaire || '',
      tarif_journalier: formateur.tarif_journalier || '',
      cv_url: formateur.cv_url || '',
      actif: formateur.actif
    });
    setShowModal(true);
  };

  // Soumettre le formulaire (ajout ou modification)
  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      // Convertir les spécialités en array
      const specialitesArray = data.specialites 
        ? data.specialites.split(',').map(s => s.trim()).filter(s => s)
        : [];
      
      const formateurData = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone || null,
        specialites: specialitesArray,
        tarif_horaire: data.tarif_horaire ? parseFloat(data.tarif_horaire) : null,
        tarif_journalier: data.tarif_journalier ? parseFloat(data.tarif_journalier) : null,
        cv_url: data.cv_url || null,
        actif: data.actif
      };

      let result;
      if (editingFormateur) {
        // Mise à jour
        result = await supabaseClient
          .from('formateurs')
          .update(formateurData)
          .eq('id', editingFormateur.id)
          .select();
      } else {
        // Création
        result = await supabaseClient
          .from('formateurs')
          .insert([formateurData])
          .select();
      }

      if (result.error) throw result.error;

      setShowModal(false);
      loadFormateurs();
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(`Erreur lors de la sauvegarde: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Supprimer un formateur
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce formateur ?')) {
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('formateurs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadFormateurs();
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(`Erreur lors de la suppression: ${err.message}`);
    }
  };

  // Basculer le statut actif/inactif
  const toggleActif = async (formateur) => {
    try {
      const { error } = await supabaseClient
        .from('formateurs')
        .update({ actif: !formateur.actif })
        .eq('id', formateur.id);

      if (error) throw error;

      loadFormateurs();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError(`Erreur lors de la mise à jour: ${err.message}`);
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
          <h1>👨‍🏫 Gestion des Formateurs</h1>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleAdd}>
            ➕ Nouveau Formateur
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Card>
        <Card.Body>
          {formateurs.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">Aucun formateur enregistré</p>
              <Button variant="primary" onClick={handleAdd}>
                Ajouter le premier formateur
              </Button>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Spécialités</th>
                  <th>Tarif/jour</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formateurs.map(formateur => (
                  <tr key={formateur.id}>
                    <td>
                      <strong>{formateur.prenom} {formateur.nom}</strong>
                    </td>
                    <td>{formateur.email}</td>
                    <td>{formateur.telephone || '-'}</td>
                    <td>
                      {formateur.specialites && formateur.specialites.length > 0 ? (
                        formateur.specialites.map((spec, idx) => (
                          <Badge key={idx} bg="info" className="me-1">
                            {spec}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {formateur.tarif_journalier ? (
                        `${formateur.tarif_journalier.toFixed(2)} €`
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <Badge 
                        bg={formateur.actif ? 'success' : 'secondary'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleActif(formateur)}
                      >
                        {formateur.actif ? '✅ Actif' : '⏸️ Inactif'}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEdit(formateur)}
                      >
                        ✏️ Modifier
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(formateur.id)}
                      >
                        🗑️ Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal d'ajout/édition */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingFormateur ? '✏️ Modifier le formateur' : '➕ Nouveau formateur'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prénom *</Form.Label>
                  <Form.Control 
                    type="text" 
                    {...register('prenom', { required: 'Le prénom est requis' })}
                    isInvalid={!!errors.prenom}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.prenom?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom *</Form.Label>
                  <Form.Control 
                    type="text" 
                    {...register('nom', { required: 'Le nom est requis' })}
                    isInvalid={!!errors.nom}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nom?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control 
                    type="email" 
                    {...register('email', { 
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide'
                      }
                    })}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control 
                    type="text" 
                    {...register('telephone')}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Spécialités</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: Excel, PowerPoint, Management (séparées par des virgules)"
                {...register('specialites')}
              />
              <Form.Text className="text-muted">
                Séparez les spécialités par des virgules
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tarif horaire (€)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.01"
                    min="0"
                    {...register('tarif_horaire')}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tarif journalier (€)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.01"
                    min="0"
                    {...register('tarif_journalier')}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>URL du CV</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="https://..."
                {...register('cv_url')}
              />
              <Form.Text className="text-muted">
                Lien vers le CV du formateur (optionnel)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Formateur actif"
                {...register('actif')}
              />
              <Form.Text className="text-muted">
                Les formateurs inactifs ne sont pas proposés lors de la création de sessions
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
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
                  Enregistrement...
                </>
              ) : (
                editingFormateur ? 'Mettre à jour' : 'Créer'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default FormateursList;
