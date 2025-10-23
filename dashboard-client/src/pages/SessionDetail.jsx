import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, Mail, Phone, MapPin, Send, CheckCircle, XCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StepBadge } from '../components/ui/StatusBadge';
import { sessionsApi, participantsApi } from '../lib/api';
import { formatDate, formatDateTime, formatSessionNumber, getModaliteLabel } from '../lib/utils';

export function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadSessionData();
  }, [id]);

  const loadSessionData = async () => {
    try {
      setLoading(true);
      const [sessionRes, participantsRes] = await Promise.all([
        sessionsApi.getById(id),
        participantsApi.getBySession(id),
      ]);
      setSession(sessionRes.data);
      setParticipants(participantsRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDevisSent = async () => {
    try {
      setActionLoading(true);
      await sessionsApi.markDevisSent(id);
      await loadSessionData();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setActionLoading(false);
    }
  };

  const handleValidateDemande = async () => {
    if (!window.confirm('Confirmer la validation de cette demande ?')) return;

    try {
      setActionLoading(true);
      await sessionsApi.validateDemande(id);
      await loadSessionData();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la validation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDevisResponse = async (response) => {
    const confirmMessage = response === 'accepte' 
      ? 'Confirmer que le devis a été accepté par le client ?'
      : 'Confirmer que le devis a été refusé par le client ?';
    
    if (!window.confirm(confirmMessage)) return;

    try {
      setActionLoading(true);
      await sessionsApi.devisResponse(id, response);
      await loadSessionData();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadProgramme = async () => {
    try {
      setActionLoading(true);
      const response = await sessionsApi.downloadProgramme(id);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Programme_${session.formation_titre?.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération du programme');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Session non trouvée</p>
      </div>
    );
  }

  const getStepStatus = (step) => {
    const steps = {
      demande: ['demande'],
      devis_envoye: ['devis_envoye'],
      devis_accepte: ['en_attente', 'confirmee', 'convoquee', 'en_cours', 'terminee'],
      convention: ['confirmee', 'convoquee', 'en_cours', 'terminee'],
      convocation: ['convoquee', 'en_cours', 'terminee'],
      formation: ['en_cours', 'terminee'],
      terminee: ['terminee'],
    };

    if (session.statut === 'annulee') return 'cancelled';
    if (steps[step]?.includes(session.statut)) return 'completed';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au dashboard
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {formatSessionNumber(session.id, session.session_created_at)}
              </h1>
              <p className="mt-2 text-xl text-gray-600">{session.formation_titre}</p>
            </div>
            <div>
              <Button
                onClick={handleDownloadProgramme}
                disabled={actionLoading}
                variant="outline"
                size="md"
              >
                <Download className="w-4 h-4" />
                Télécharger le programme
              </Button>
            </div>
          </div>

          {/* Infos principales */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Entreprise</p>
                <p className="font-medium">{session.entreprise_nom}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Dates</p>
                <p className="font-medium">
                  {session.date_debut && session.date_fin
                    ? `${formatDate(session.date_debut)} - ${formatDate(session.date_fin)}`
                    : 'À définir'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{session.entreprise_email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Modalité</p>
                <p className="font-medium">{getModaliteLabel(session.modalite)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Participants */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">👥 Participants ({participants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <p className="text-gray-500">Aucun participant enregistré</p>
            ) : (
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div key={participant.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {participant.prenom} {participant.nom}
                        </p>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{participant.email}</span>
                          </div>
                          {participant.telephone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{participant.telephone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          getStepStatus('convocation') === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {getStepStatus('convocation') === 'completed' ? '✅ Convoqué' : '⏸️ En attente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">📋 Suivi de la Formation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* AVANT LA FORMATION */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📋 AVANT LA FORMATION
                </h3>
                
                <div className="space-y-6 ml-4 border-l-2 border-gray-200 pl-6">
                  {/* Demande reçue */}
                  <div className="relative">
                    <div className="absolute -left-[33px] mt-1">
                      <StepBadge status="completed" />
                    </div>
                    <div>
                      <p className="font-medium text-green-600">✅ Demande reçue</p>
                      {session.created_at && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDateTime(session.created_at)}
                        </p>
                      )}
                      {session.statut === 'demande' && (
                        <p className="text-sm text-yellow-600 mt-2 font-medium">
                          💡 Prochaine action : Valider la demande
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Validation demande */}
                  <div className="relative">
                    <div className="absolute -left-[33px] mt-1">
                      <StepBadge status={
                        session.statut === 'demande' ? 'pending' : 'completed'
                      } />
                    </div>
                    <div>
                      {session.statut === 'demande' ? (
                        <div>
                          <p className="font-medium text-gray-400">⏸️ Validation de la demande</p>
                          <p className="text-sm text-gray-400 mt-1">
                            En attente de votre validation
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-green-600">✅ Demande validée</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Statut : En attente d'envoi du devis
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Devis */}
                  <div className="relative">
                    <div className="absolute -left-[33px] mt-1">
                      <StepBadge status={
                        session.statut === 'demande' ? 'pending' :
                        session.statut === 'en_attente' && !session.devis_envoye_le ? 'in_progress' :
                        session.statut === 'devis_envoye' ? 'in_progress' : 'completed'
                      } />
                    </div>
                    <div>
                      {session.statut === 'demande' && (
                        <div>
                          <p className="font-medium text-yellow-600">⏳ Demande à valider</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Validez cette demande avant d'envoyer le devis
                          </p>
                          <Button
                            onClick={handleValidateDemande}
                            disabled={actionLoading}
                            variant="primary"
                            size="sm"
                            className="mt-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Valider la demande
                          </Button>
                        </div>
                      )}

                      {session.statut === 'en_attente' && !session.devis_envoye_le && (
                        <div>
                          <p className="font-medium text-yellow-600">⏳ Devis à envoyer</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Envoyez le devis par email, puis marquez-le comme envoyé
                          </p>
                          <Button
                            onClick={handleMarkDevisSent}
                            disabled={actionLoading}
                            variant="primary"
                            size="sm"
                            className="mt-2"
                          >
                            <Send className="w-4 h-4" />
                            Marquer comme envoyé
                          </Button>
                        </div>
                      )}

                      {session.statut === 'devis_envoye' && (
                        <div>
                          <p className="font-medium text-green-600">✅ Devis envoyé</p>
                          {session.devis_envoye_le && (
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDateTime(session.devis_envoye_le)}
                            </p>
                          )}
                          
                          <div className="mt-3">
                            <p className="text-yellow-600 font-medium mb-2">
                              ⏳ En attente de la réponse du client
                            </p>
                            <div className="flex gap-3">
                              <Button
                                onClick={() => handleDevisResponse('accepte')}
                                disabled={actionLoading}
                                variant="success"
                                size="sm"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Accepté
                              </Button>
                              <Button
                                onClick={() => handleDevisResponse('refuse')}
                                disabled={actionLoading}
                                variant="danger"
                                size="sm"
                              >
                                <XCircle className="w-4 h-4" />
                                Refusé
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {['en_attente', 'confirmee', 'convoquee', 'en_cours', 'terminee'].includes(session.statut) && session.devis_envoye_le && (
                        <div>
                          <p className="font-medium text-green-600">✅ Devis accepté par le client</p>
                          {session.devis_accepte_le && (
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDateTime(session.devis_accepte_le)}
                            </p>
                          )}
                        </div>
                      )}

                      {session.statut === 'annulee' && session.raison_annulation === 'devis_refuse' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="font-semibold text-red-600">❌ Devis refusé par le client</p>
                          {session.devis_refuse_le && (
                            <p className="text-sm text-red-600 mt-1">
                              {formatDateTime(session.devis_refuse_le)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Convention */}
                  {session.statut !== 'annulee' && (
                    <div className="relative">
                      <div className="absolute -left-[33px] mt-1">
                        <StepBadge status={
                          ['confirmee', 'convoquee', 'en_cours', 'terminee'].includes(session.statut)
                            ? 'completed'
                            : session.statut === 'en_attente'
                            ? 'in_progress'
                            : 'pending'
                        } />
                      </div>
                      <div>
                        {session.statut === 'en_attente' && (
                          <div>
                            <p className="font-medium text-yellow-600">⏳ Convention en attente de signature</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Convention envoyée automatiquement via DocuSeal
                            </p>
                          </div>
                        )}
                        
                        {['confirmee', 'convoquee', 'en_cours', 'terminee'].includes(session.statut) && (
                          <div>
                            <p className="font-medium text-green-600">✅ Convention signée</p>
                            {session.convention_signee_le && (
                              <p className="text-sm text-gray-500 mt-1">
                                {formatDateTime(session.convention_signee_le)}
                              </p>
                            )}
                          </div>
                        )}

                        {!['en_attente', 'confirmee', 'convoquee', 'en_cours', 'terminee'].includes(session.statut) && (
                          <div>
                            <p className="font-medium text-gray-400">⏸️ Convention</p>
                            <p className="text-sm text-gray-400 mt-1">
                              À envoyer après acceptation du devis
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Convocations */}
                  {session.statut !== 'annulee' && (
                    <div className="relative">
                      <div className="absolute -left-[33px] mt-1">
                        <StepBadge status={
                          ['convoquee', 'en_cours', 'terminee'].includes(session.statut)
                            ? 'completed'
                            : 'pending'
                        } />
                      </div>
                      <div>
                        {['convoquee', 'en_cours', 'terminee'].includes(session.statut) ? (
                          <div>
                            <p className="font-medium text-green-600">✅ Convocations envoyées</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {participants.length} convocations envoyées automatiquement
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium text-gray-400">⏸️ Convocations</p>
                            <p className="text-sm text-gray-400 mt-1">
                              À envoyer après signature de la convention
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PENDANT LA FORMATION */}
              {session.statut !== 'annulee' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🎓 PENDANT LA FORMATION
                  </h3>
                  
                  <div className="space-y-6 ml-4 border-l-2 border-gray-200 pl-6">
                    <div className="relative">
                      <div className="absolute -left-[33px] mt-1">
                        <StepBadge status={
                          ['en_cours', 'terminee'].includes(session.statut) ? 'in_progress' : 'pending'
                        } />
                      </div>
                      <div>
                        <p className="font-medium text-gray-400">⏸️ Émargements</p>
                        <p className="text-sm text-gray-400 mt-1">À compléter pendant la formation</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[33px] mt-1">
                        <StepBadge status="pending" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-400">⏸️ Évaluation à chaud</p>
                        <p className="text-sm text-gray-400 mt-1">À compléter en fin de formation</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* APRÈS LA FORMATION */}
              {session.statut !== 'annulee' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ✨ APRÈS LA FORMATION
                  </h3>
                  
                  <div className="space-y-6 ml-4 border-l-2 border-gray-200 pl-6">
                    <div className="relative">
                      <div className="absolute -left-[33px] mt-1">
                        <StepBadge status={session.statut === 'terminee' ? 'completed' : 'pending'} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-400">⏸️ Évaluation à froid (J+30)</p>
                        <p className="text-sm text-gray-400 mt-1">À envoyer 30 jours après la formation</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[33px] mt-1">
                        <StepBadge status="pending" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-400">⏸️ Certificats de réalisation</p>
                        <p className="text-sm text-gray-400 mt-1">À générer après les évaluations</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[33px] mt-1">
                        <StepBadge status="pending" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-400">⏸️ Dossier Qualiopi finalisé</p>
                        <p className="text-sm text-gray-400 mt-1">Archivage complet du dossier</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Session annulée */}
              {session.statut === 'annulee' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                  <p className="text-xl font-semibold text-red-600">❌ DEMANDE DE FORMATION ANNULÉE</p>
                  <p className="text-red-600 mt-2">
                    Raison : {session.raison_annulation === 'devis_refuse' ? 'Devis refusé' : session.raison_annulation}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
