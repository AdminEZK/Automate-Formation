import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, Users, CheckCircle, Clock, Pause } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { formatDate, formatSessionNumber, getModaliteLabel } from '../lib/utils';

export function SessionCard({ session }) {
  const navigate = useNavigate();

  // Déterminer l'action requise
  const getActionRequired = () => {
    if (session.statut === 'demande') {
      return { text: '🆕 Nouvelle demande - À valider', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
    if (session.statut === 'en_attente' && !session.devis_envoye_le) {
      return { text: '📧 Devis à envoyer', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }
    if (session.statut === 'devis_envoye') {
      const daysSince = Math.floor((new Date() - new Date(session.devis_envoye_le)) / (1000 * 60 * 60 * 24));
      if (daysSince >= 3) {
        return { text: `⚠️ Devis envoyé il y a ${daysSince} jours - Relancer ?`, color: 'bg-orange-100 text-orange-800 border-orange-200' };
      }
      return { text: '⏳ En attente de réponse du client', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }
    if (session.statut === 'en_attente' && session.devis_envoye_le) {
      return { text: '📝 Convention à envoyer', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    }
    if (session.statut === 'confirmee') {
      return { text: '✅ Confirmée - Convocations à envoyer', color: 'bg-green-100 text-green-800 border-green-200' };
    }
    return null;
  };

  const actionRequired = getActionRequired();

  // Déterminer les statuts des étapes
  const getStepStatus = (step) => {
    const statusOrder = ['demande', 'devis_envoye', 'en_attente', 'confirmee', 'convoquee', 'en_cours', 'terminee'];
    const currentIndex = statusOrder.indexOf(session.statut);
    
    const stepMapping = {
      devis: 0,
      convention: 2,
      convocation: 4,
      formation: 5,
    };

    const stepIndex = stepMapping[step];
    
    if (session.statut === 'annulee') return 'cancelled';
    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'in_progress';
    return 'pending';
  };

  const StepIcon = ({ step }) => {
    const status = getStepStatus(step);
    
    if (status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (status === 'in_progress') {
      return <Clock className="w-4 h-4 text-yellow-600" />;
    }
    return <Pause className="w-4 h-4 text-gray-400" />;
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/sessions/${session.id}`)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Alerte d'action requise */}
          {actionRequired && (
            <div className={`px-3 py-2 rounded-lg border ${actionRequired.color} text-sm font-medium`}>
              {actionRequired.text}
            </div>
          )}

          {/* En-tête */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {formatSessionNumber(session.id, session.session_created_at)} - {session.formation_titre}
            </h3>
          </div>

          {/* Informations principales */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{session.entreprise_nom}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {session.date_debut && session.date_fin
                  ? `${formatDate(session.date_debut)} - ${formatDate(session.date_fin)}`
                  : 'Dates à définir'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{session.nombre_participants || 0} participants</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">{getModaliteLabel(session.modalite)}</span>
            </div>
          </div>

          {/* Statuts des étapes */}
          <div className="flex items-center gap-4 pt-2 border-t">
            <div className="flex items-center gap-1.5">
              <StepIcon step="devis" />
              <span className="text-xs text-gray-600">Devis</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <StepIcon step="convention" />
              <span className="text-xs text-gray-600">Convention</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <StepIcon step="convocation" />
              <span className="text-xs text-gray-600">Convocation</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <StepIcon step="formation" />
              <span className="text-xs text-gray-600">Formation</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
