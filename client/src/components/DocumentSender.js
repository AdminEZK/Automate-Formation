import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './DocumentSender.css';

/**
 * Composant pour l'envoi de documents (convocations et certificats)
 */
const DocumentSender = () => {
  // État pour suivre le type de document à envoyer
  const [documentType, setDocumentType] = useState('invitation');
  // État pour suivre le statut de l'envoi
  const [sendStatus, setSendStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  // Initialisation du formulaire avec react-hook-form
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  /**
   * Gère la soumission du formulaire
   * @param {Object} data - Données du formulaire
   */
  const onSubmit = async (data) => {
    setSendStatus({ loading: true, success: false, error: null });
    
    try {
      // Déterminer l'endpoint en fonction du type de document
      const endpoint = documentType === 'invitation' 
        ? '/api/documents/send-invitation' 
        : '/api/documents/send-certificate';
      
      // Envoyer la requête à l'API
      const response = await axios.post(endpoint, data);
      
      // Traiter la réponse
      if (response.data.success) {
        setSendStatus({
          loading: false,
          success: true,
          error: null
        });
        
        // Réinitialiser le formulaire après un envoi réussi
        reset();
        
        // Afficher un message de succès pendant 5 secondes
        setTimeout(() => {
          setSendStatus(prevState => ({ ...prevState, success: false }));
        }, 5000);
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'envoi du document');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du document:', error);
      setSendStatus({
        loading: false,
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'envoi du document'
      });
    }
  };

  return (
    <div className="document-sender-container">
      <h2 className="document-sender-title">Envoi de Documents</h2>
      
      <div className="document-type-selector">
        <button 
          className={`document-type-btn ${documentType === 'invitation' ? 'active' : ''}`}
          onClick={() => setDocumentType('invitation')}
        >
          Convocation
        </button>
        <button 
          className={`document-type-btn ${documentType === 'certificate' ? 'active' : ''}`}
          onClick={() => setDocumentType('certificate')}
        >
          Certificat de Réalisation
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="document-form">
        <div className="form-section">
          <h3>Informations du Destinataire</h3>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input 
              type="email" 
              id="email" 
              {...register('email', { 
                required: 'L\'email est requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse email invalide'
                }
              })}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom *</label>
              <input 
                type="text" 
                id="firstName" 
                {...register('firstName', { required: 'Le prénom est requis' })}
              />
              {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Nom *</label>
              <input 
                type="text" 
                id="lastName" 
                {...register('lastName', { required: 'Le nom est requis' })}
              />
              {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Informations de la Formation</h3>
          
          <div className="form-group">
            <label htmlFor="formationTitle">Titre de la Formation *</label>
            <input 
              type="text" 
              id="formationTitle" 
              {...register('formationTitle', { required: 'Le titre de la formation est requis' })}
            />
            {errors.formationTitle && <span className="error-message">{errors.formationTitle.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="formationDate">Date de la Formation *</label>
            <input 
              type="text" 
              id="formationDate" 
              placeholder="ex: 15 juin 2023"
              {...register('formationDate', { required: 'La date de la formation est requise' })}
            />
            {errors.formationDate && <span className="error-message">{errors.formationDate.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="formationLocation">Lieu de la Formation *</label>
            <input 
              type="text" 
              id="formationLocation" 
              {...register('formationLocation', { required: 'Le lieu de la formation est requis' })}
            />
            {errors.formationLocation && <span className="error-message">{errors.formationLocation.message}</span>}
          </div>
          
          {documentType === 'invitation' && (
            <div className="form-group">
              <label htmlFor="formationHours">Horaires</label>
              <input 
                type="text" 
                id="formationHours" 
                placeholder="ex: 9h00 - 17h00"
                {...register('formationHours')}
              />
            </div>
          )}
          
          {documentType === 'certificate' && (
            <>
              <div className="form-group">
                <label htmlFor="formationDuration">Durée de la Formation</label>
                <input 
                  type="text" 
                  id="formationDuration" 
                  placeholder="ex: 7 heures"
                  {...register('formationDuration')}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="formateur">Nom du Formateur</label>
                  <input 
                    type="text" 
                    id="formateur" 
                    {...register('formateur')}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="city">Ville</label>
                  <input 
                    type="text" 
                    id="city" 
                    placeholder="ex: Paris"
                    {...register('city')}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={sendStatus.loading}
          >
            {sendStatus.loading ? 'Envoi en cours...' : `Envoyer le ${documentType === 'invitation' ? 'convocation' : 'certificat'}`}
          </button>
          
          <button 
            type="button" 
            className="reset-btn"
            onClick={() => {
              reset();
              setSendStatus({ loading: false, success: false, error: null });
            }}
            disabled={sendStatus.loading}
          >
            Réinitialiser
          </button>
        </div>
        
        {sendStatus.success && (
          <div className="success-message">
            Document envoyé avec succès !
          </div>
        )}
        
        {sendStatus.error && (
          <div className="error-message">
            {sendStatus.error}
          </div>
        )}
      </form>
    </div>
  );
};

export default DocumentSender;
