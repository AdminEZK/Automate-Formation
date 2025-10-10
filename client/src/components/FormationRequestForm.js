import React, { useState, useEffect } from 'react';
import axios from 'axios';
import supabaseClient from '../services/supabaseClient';
import './FormationRequestForm.css';

const FormationRequestForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Données du formulaire
  const [entreprise, setEntreprise] = useState({
    nom: '',
    siret: '',
    adresse: '',
    code_postal: '',
    ville: '',
    email_contact: '',
    telephone: ''
  });

  const [formation, setFormation] = useState({
    formation_catalogue_id: '',
    date_debut: '',
    date_fin: '',
    modalite: 'presentiel'
  });

  const [participants, setParticipants] = useState([
    { nom: '', prenom: '', email: '', telephone: '', fonction: '' }
  ]);

  // Charger les formations
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('formations_catalogue')
          .select('id, titre, description')
          .order('titre');
        
        if (error) throw error;
        setFormations(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des formations:', error);
      }
    };

    fetchFormations();
  }, []);

  const handleEntrepriseChange = (e) => {
    const { name, value } = e.target;
    setEntreprise(prev => ({ ...prev, [name]: value }));
  };

  const handleFormationChange = (e) => {
    const { name, value } = e.target;
    setFormation(prev => ({ ...prev, [name]: value }));
  };

  const handleParticipantChange = (index, field, value) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  const addParticipant = () => {
    setParticipants([...participants, { nom: '', prenom: '', email: '', telephone: '', fonction: '' }]);
  };

  const removeParticipant = (index) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      await axios.post(`${apiUrl}/api/demandes`, {
        entreprise,
        formation,
        participants
      });

      setSuccessMessage('Votre demande de formation a été envoyée avec succès ! Nous vous contacterons très prochainement.');
      
      // Réinitialiser
      setCurrentStep(1);
      setEntreprise({ nom: '', siret: '', adresse: '', code_postal: '', ville: '', email_contact: '', telephone: '' });
      setFormation({ formation_catalogue_id: '', date_debut: '', date_fin: '', modalite: 'presentiel' });
      setParticipants([{ nom: '', prenom: '', email: '', telephone: '', fonction: '' }]);

    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage(error.response?.data?.message || 'Erreur lors de l\'envoi de la demande.');
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => (
    <div className="progress-bar">
      <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
        <div className="step-number">1</div>
        <div className="step-label">Entreprise</div>
      </div>
      <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
      <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
        <div className="step-number">2</div>
        <div className="step-label">Formation</div>
      </div>
      <div className={`progress-line ${currentStep >= 3 ? 'active' : ''}`}></div>
      <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
        <div className="step-number">3</div>
        <div className="step-label">Participants</div>
      </div>
    </div>
  );

  return (
    <div className="formation-request-container">
      <h2>Demande de Formation</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {renderProgressBar()}

      <form onSubmit={handleSubmit} className="formation-form">
        {/* ÉTAPE 1: Entreprise */}
        {currentStep === 1 && (
          <div className="form-section">
            <h3>Informations Entreprise</h3>
            <div className="form-group">
              <label>Nom de l'entreprise *</label>
              <input type="text" name="nom" value={entreprise.nom} onChange={handleEntrepriseChange} required />
            </div>
            <div className="form-group">
              <label>Email de contact *</label>
              <input type="email" name="email_contact" value={entreprise.email_contact} onChange={handleEntrepriseChange} required />
            </div>
            <div className="form-group">
              <label>Téléphone *</label>
              <input type="tel" name="telephone" value={entreprise.telephone} onChange={handleEntrepriseChange} required />
            </div>
            <div className="form-group">
              <label>SIRET (optionnel)</label>
              <input type="text" name="siret" value={entreprise.siret} onChange={handleEntrepriseChange} maxLength="14" />
            </div>
            <div className="form-group">
              <label>Adresse (optionnel)</label>
              <input type="text" name="adresse" value={entreprise.adresse} onChange={handleEntrepriseChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Code postal</label>
                <input type="text" name="code_postal" value={entreprise.code_postal} onChange={handleEntrepriseChange} maxLength="5" />
              </div>
              <div className="form-group">
                <label>Ville</label>
                <input type="text" name="ville" value={entreprise.ville} onChange={handleEntrepriseChange} />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2: Formation */}
        {currentStep === 2 && (
          <div className="form-section">
            <h3>Formation Souhaitée</h3>
            <div className="form-group">
              <label>Choisissez une formation *</label>
              <select name="formation_catalogue_id" value={formation.formation_catalogue_id} onChange={handleFormationChange} required>
                <option value="">-- Sélectionnez --</option>
                {formations.map(f => (
                  <option key={f.id} value={f.id}>{f.titre}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date de début souhaitée *</label>
              <input type="date" name="date_debut" value={formation.date_debut} onChange={handleFormationChange} required />
            </div>
            <div className="form-group">
              <label>Date de fin (optionnel)</label>
              <input type="date" name="date_fin" value={formation.date_fin} onChange={handleFormationChange} />
            </div>
            <div className="form-group">
              <label>Modalité</label>
              <select name="modalite" value={formation.modalite} onChange={handleFormationChange}>
                <option value="presentiel">Présentiel</option>
                <option value="distanciel">Distanciel</option>
                <option value="mixte">Mixte</option>
              </select>
            </div>
          </div>
        )}

        {/* ÉTAPE 3: Participants */}
        {currentStep === 3 && (
          <div className="form-section">
            <div className="section-header">
              <h3>Participants</h3>
              <button type="button" onClick={addParticipant} className="btn-add">+ Ajouter</button>
            </div>
            {participants.map((p, index) => (
              <div key={index} className="participant-block">
                <div className="participant-header">
                  <h4>Participant {index + 1}</h4>
                  {participants.length > 1 && (
                    <button type="button" onClick={() => removeParticipant(index)} className="btn-remove">✕</button>
                  )}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nom *</label>
                    <input type="text" value={p.nom} onChange={(e) => handleParticipantChange(index, 'nom', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Prénom *</label>
                    <input type="text" value={p.prenom} onChange={(e) => handleParticipantChange(index, 'prenom', e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={p.email} onChange={(e) => handleParticipantChange(index, 'email', e.target.value)} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input type="tel" value={p.telephone} onChange={(e) => handleParticipantChange(index, 'telephone', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Fonction</label>
                    <input type="text" value={p.fonction} onChange={(e) => handleParticipantChange(index, 'fonction', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="form-actions">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">← Précédent</button>
          )}
          {currentStep < 3 ? (
            <button type="button" onClick={nextStep} className="btn-primary">Suivant →</button>
          ) : (
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer la demande'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormationRequestForm;
