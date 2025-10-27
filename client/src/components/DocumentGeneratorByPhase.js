import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Badge, ListGroup, Accordion } from 'react-bootstrap';
import axios from 'axios';

const DocumentGeneratorByPhase = ({ sessionId }) => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Charger la liste des documents générés
  const loadDocuments = async () => {
    try {
      const response = await axios.get(`/api/documents/session/${sessionId}`);
      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (err) {
      console.error('Erreur chargement documents:', err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [sessionId]);

  // Générer les documents d'une phase
  const generatePhase = async (phase, endpoint) => {
    try {
      setLoading({ ...loading, [phase]: true });
      setError(null);
      setSuccess(null);

      const response = await axios.post(`/api/documents/phase/${endpoint}/${sessionId}`);

      if (response.data.success) {
        setSuccess(response.data.message);
        loadDocuments(); // Recharger la liste
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(`Erreur génération ${phase}:`, err);
      setError(`Erreur lors de la génération: ${err.message}`);
    } finally {
      setLoading({ ...loading, [phase]: false });
    }
  };

  // Phases de génération
  const phases = [
    {
      id: 'proposition',
      title: 'Phase 2 : Proposition Commerciale (J+1)',
      description: 'Génère la proposition de formation et le programme',
      documents: ['Proposition de formation', 'Programme de formation'],
      endpoint: 'proposition',
      icon: '💼',
      timing: 'J+1',
      color: 'primary'
    },
    {
      id: 'convention',
      title: 'Phase 3 : Convention (J+3)',
      description: 'Génère la convention de formation',
      documents: ['Convention de formation'],
      endpoint: 'convention',
      icon: '✍️',
      timing: 'J+3',
      color: 'info'
    },
    {
      id: 'preparation',
      title: 'Phase 4 : Préparation (J-7)',
      description: 'Génère les questionnaires préalables pour chaque participant',
      documents: ['Questionnaire préalable (par participant)'],
      endpoint: 'preparation',
      icon: '📋',
      timing: 'J-7',
      color: 'warning'
    },
    {
      id: 'convocation',
      title: 'Phase 5 : Convocation (J-4)',
      description: 'Génère les convocations et feuilles d\'émargement',
      documents: [
        'Convocation (par participant)',
        'Règlement intérieur',
        'Feuille d\'émargement entreprise',
        'Feuille d\'émargement individuelle (par participant)'
      ],
      endpoint: 'convocation',
      icon: '📨',
      timing: 'J-4',
      color: 'success'
    },
    {
      id: 'evaluation-chaud',
      title: 'Phase 7 : Évaluation à Chaud (Fin formation)',
      description: 'Génère les évaluations à chaud pour chaque participant',
      documents: ['Évaluation à chaud (par participant)'],
      endpoint: 'evaluation-chaud',
      icon: '📊',
      timing: 'Fin J',
      color: 'danger'
    },
    {
      id: 'cloture',
      title: 'Phase 9 : Clôture (J+2)',
      description: 'Génère les certificats et l\'évaluation client',
      documents: [
        'Certificat de réalisation (par participant)',
        'Évaluation satisfaction client'
      ],
      endpoint: 'cloture',
      icon: '🎓',
      timing: 'J+2',
      color: 'success'
    },
    {
      id: 'evaluation-froid',
      title: 'Phase 10 : Évaluation à Froid (J+60)',
      description: 'Génère les évaluations à froid pour chaque participant',
      documents: ['Évaluation à froid (par participant)'],
      endpoint: 'evaluation-froid',
      icon: '📈',
      timing: 'J+60',
      color: 'secondary'
    }
  ];

  return (
    <Card className="mb-4">
      <Card.Header className="bg-light">
        <h5 className="mb-0">📄 Génération de Documents par Phase</h5>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Accordion defaultActiveKey="0">
          {phases.map((phase, index) => (
            <Accordion.Item eventKey={index.toString()} key={phase.id}>
              <Accordion.Header>
                <div className="d-flex align-items-center w-100">
                  <span className="me-2" style={{ fontSize: '1.5rem' }}>{phase.icon}</span>
                  <div className="flex-grow-1">
                    <strong>{phase.title}</strong>
                    <br />
                    <small className="text-muted">{phase.description}</small>
                  </div>
                  <Badge bg={phase.color} className="ms-2">{phase.timing}</Badge>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <div className="mb-3">
                  <strong>Documents générés :</strong>
                  <ListGroup variant="flush" className="mt-2">
                    {phase.documents.map((doc, idx) => (
                      <ListGroup.Item key={idx} className="py-1">
                        • {doc}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>

                <Button
                  variant={phase.color}
                  onClick={() => generatePhase(phase.id, phase.endpoint)}
                  disabled={loading[phase.id]}
                  className="w-100"
                >
                  {loading[phase.id] ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      {phase.icon} Générer les documents de cette phase
                    </>
                  )}
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        {/* Liste des documents générés */}
        {documents.length > 0 && (
          <Card className="mt-4">
            <Card.Header className="bg-light">
              <h6 className="mb-0">📁 Documents Générés ({documents.length})</h6>
            </Card.Header>
            <ListGroup variant="flush">
              {documents.map((doc, idx) => (
                <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{doc.name}</strong>
                    <br />
                    <small className="text-muted">
                      Créé le {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                    </small>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    href={doc.path}
                    download
                  >
                    ⬇️ Télécharger
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        )}
      </Card.Body>
    </Card>
  );
};

export default DocumentGeneratorByPhase;
