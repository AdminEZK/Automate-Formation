import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const FormationRequestForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formations, setFormations] = useState([
    { id: 'maitre-apprentissage', titre: 'Devenir maître d\'apprentissage', duree: 14 },
    { id: 'formateur-entreprise', titre: 'Formation formateur en entreprise', duree: 21 },
    { id: 'tuteur-afest', titre: 'Formation – Tuteur référent AFEST', duree: 14 },
    { id: 'strategie-entreprise', titre: 'Formation Stratégie d\'entreprise', duree: 21 },
    { id: 'conseils-rh', titre: 'Formation Conseils RH', duree: 14 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    // Étape 1 : Entreprise
    entreprise: {
      nom: '',
      siret: '',
      adresse: '',
      code_postal: '',
      ville: '',
      email_contact: '',
      telephone: ''
    },
    // Étape 2 : Formation
    formation: {
      formation_catalogue_id: '',
      date_debut: '',
      date_fin: '',
      modalite: 'presentiel'
    },
    // Étape 3 : Participants
    participants: [
      { nom: '', prenom: '', email: '', telephone: '', fonction: '' }
    ]
  });

  // Les formations sont maintenant définies directement dans le state initial
  // Plus besoin de les charger depuis l'API

  // Gestion des changements de champs
  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Gestion des participants
  const handleParticipantChange = (index, field, value) => {
    const newParticipants = [...formData.participants];
    newParticipants[index][field] = value;
    setFormData(prev => ({ ...prev, participants: newParticipants }));
  };

  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, { nom: '', prenom: '', email: '', telephone: '', fonction: '' }]
    }));
  };

  const removeParticipant = (index) => {
    if (formData.participants.length > 1) {
      setFormData(prev => ({
        ...prev,
        participants: prev.participants.filter((_, i) => i !== index)
      }));
    }
  };

  // Navigation entre les étapes
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  // Validation des étapes
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.entreprise.nom || !formData.entreprise.email_contact || !formData.entreprise.telephone) {
          setError('Veuillez remplir tous les champs obligatoires (nom, email, téléphone)');
          return false;
        }
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.entreprise.email_contact)) {
          setError('Email invalide');
          return false;
        }
        return true;

      case 2:
        if (!formData.formation.formation_catalogue_id || !formData.formation.date_debut) {
          setError('Veuillez sélectionner une formation et une date de début');
          return false;
        }
        return true;

      case 3:
        const hasValidParticipant = formData.participants.some(p => p.nom && p.prenom && p.email);
        if (!hasValidParticipant) {
          setError('Veuillez ajouter au moins un participant avec nom, prénom et email');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setLoading(true);
    setError('');

    try {
      console.log('📤 Envoi de la demande:', formData);
      
      // Créer la demande de formation
      const response = await axios.post(`${API_URL}/demandes`, {
        entreprise: formData.entreprise,
        formation: formData.formation,
        participants: formData.participants.filter(p => p.nom && p.prenom && p.email)
      });
      
      console.log('✅ Réponse du serveur:', response.data);

      setSuccess(true);
      
      // Redirection après 3 secondes
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setError(err.response?.data?.error || 'Une erreur est survenue lors de l\'envoi de votre demande');
    } finally {
      setLoading(false);
    }
  };

  // Affichage du succès
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Demande envoyée !</h2>
          <p className="text-gray-600 mb-4">
            Votre demande de formation a été enregistrée avec succès. Nous vous contacterons très prochainement.
          </p>
          <p className="text-sm text-gray-500">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Demande de Formation</h1>
          <p className="text-gray-600">Complétez ce formulaire pour nous faire part de votre besoin</p>
        </div>

        {/* Barre de progression */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-2">
            {[1, 2, 3].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-32 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Entreprise</span>
            <span>Formation</span>
            <span>Participants</span>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Étape 1 : Entreprise */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations Entreprise</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.entreprise.nom}
                    onChange={(e) => handleChange('entreprise', 'nom', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SIRET</label>
                    <input
                      type="text"
                      value={formData.entreprise.siret}
                      onChange={(e) => handleChange('entreprise', 'siret', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="14 chiffres"
                      maxLength="14"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.entreprise.telephone}
                      onChange={(e) => handleChange('entreprise', 'telephone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.entreprise.email_contact}
                    onChange={(e) => handleChange('entreprise', 'email_contact', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={formData.entreprise.adresse}
                    onChange={(e) => handleChange('entreprise', 'adresse', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                    <input
                      type="text"
                      value={formData.entreprise.code_postal}
                      onChange={(e) => handleChange('entreprise', 'code_postal', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength="5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                    <input
                      type="text"
                      value={formData.entreprise.ville}
                      onChange={(e) => handleChange('entreprise', 'ville', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Étape 2 : Formation */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Formation Souhaitée</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choisir une formation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.formation.formation_catalogue_id}
                    onChange={(e) => handleChange('formation', 'formation_catalogue_id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Sélectionnez une formation --</option>
                    {formations.map((formation) => (
                      <option key={formation.id} value={formation.id}>
                        {formation.titre} ({formation.duree}h)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début souhaitée <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.formation.date_debut}
                      onChange={(e) => handleChange('formation', 'date_debut', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin souhaitée</label>
                    <input
                      type="date"
                      value={formData.formation.date_fin}
                      onChange={(e) => handleChange('formation', 'date_fin', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modalité</label>
                  <select
                    value={formData.formation.modalite}
                    onChange={(e) => handleChange('formation', 'modalite', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="presentiel">Présentiel</option>
                    <option value="distanciel">Distanciel</option>
                    <option value="mixte">Mixte</option>
                  </select>
                </div>
              </div>
            )}

            {/* Étape 3 : Participants */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Participants</h2>
                  <button
                    type="button"
                    onClick={addParticipant}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + Ajouter un participant
                  </button>
                </div>

                {formData.participants.map((participant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 relative">
                    {formData.participants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}

                    <h3 className="font-semibold text-gray-900 mb-4">Participant {index + 1}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={participant.nom}
                          onChange={(e) => handleParticipantChange(index, 'nom', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={participant.prenom}
                          onChange={(e) => handleParticipantChange(index, 'prenom', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={participant.email}
                          onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                        <input
                          type="tel"
                          value={participant.telephone}
                          onChange={(e) => handleParticipantChange(index, 'telephone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                        <input
                          type="text"
                          value={participant.fonction}
                          onChange={(e) => handleParticipantChange(index, 'fonction', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Messages d'erreur */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Boutons de navigation */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ← Précédent
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Suivant →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormationRequestForm;
