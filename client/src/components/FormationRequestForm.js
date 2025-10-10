import React, { useState, useEffect } from 'react';
import axios from 'axios';
import supabaseClient from '../services/supabaseClient';
import './FormationRequestForm.css';

const FormationRequestForm = () => {
  const [formData, setFormData] = useState({
    entreprise_id: '',
    formation_id: '',
    nombre_participants: '',
    date_souhaitee: '',
    commentaires: ''
  });

  const [entreprises, setEntreprises] = useState([]);
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Charger les entreprises et formations au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les entreprises
        const { data: entreprisesData, error: entreprisesError } = await supabaseClient
          .from('entreprises')
          .select('id, nom_entreprise')
          .order('nom_entreprise');
        
        if (entreprisesError) throw entreprisesError;
        setEntreprises(entreprisesData || []);

        // Charger les formations
        const { data: formationsData, error: formationsError } = await supabaseClient
          .from('formations_catalogue')
          .select('id, titre, description')
          .order('titre');
        
        if (formationsError) throw formationsError;
        setFormations(formationsData || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setErrorMessage('Erreur lors du chargement des données');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      // Envoyer la demande au backend
      const response = await axios.post(`${apiUrl}/api/demandes`, {
        ...formData,
        nombre_participants: parseInt(formData.nombre_participants, 10)
      });

      setSuccessMessage('Votre demande de formation a été envoyée avec succès !');
      
      // Réinitialiser le formulaire
      setFormData({
        entreprise_id: '',
        formation_id: '',
        nombre_participants: '',
        date_souhaitee: '',
        commentaires: ''
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      setErrorMessage(
        error.response?.data?.message || 
        'Erreur lors de l\'envoi de la demande. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formation-request-container">
      <h2>Demande de Formation</h2>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="formation-form">
        <div className="form-section">
          <h3>Informations de l'entreprise</h3>
          
          <div className="form-group">
            <label htmlFor="entreprise_id">Entreprise *</label>
            <select
              id="entreprise_id"
              name="entreprise_id"
              value={formData.entreprise_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une entreprise</option>
              {entreprises.map(entreprise => (
                <option key={entreprise.id} value={entreprise.id}>
                  {entreprise.nom_entreprise}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Détails de la formation</h3>
          
          <div className="form-group">
            <label htmlFor="formation_id">Formation souhaitée *</label>
            <select
              id="formation_id"
              name="formation_id"
              value={formData.formation_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une formation</option>
              {formations.map(formation => (
                <option key={formation.id} value={formation.id}>
                  {formation.titre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="nombre_participants">Nombre de participants *</label>
            <input
              type="number"
              id="nombre_participants"
              name="nombre_participants"
              value={formData.nombre_participants}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date_souhaitee">Date souhaitée *</label>
            <input
              type="date"
              id="date_souhaitee"
              name="date_souhaitee"
              value={formData.date_souhaitee}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="commentaires">Commentaires</label>
            <textarea
              id="commentaires"
              name="commentaires"
              value={formData.commentaires}
              onChange={handleChange}
              rows="4"
              placeholder="Informations complémentaires..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormationRequestForm;
