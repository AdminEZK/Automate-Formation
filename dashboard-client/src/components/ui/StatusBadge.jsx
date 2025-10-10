import { clsx } from 'clsx';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Pause,
  PlayCircle 
} from 'lucide-react';

const statusConfig = {
  demande: {
    label: 'Demande reçue',
    icon: AlertCircle,
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  devis_envoye: {
    label: 'Devis envoyé',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  en_attente: {
    label: 'En attente',
    icon: Clock,
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  confirmee: {
    label: 'Confirmée',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  convoquee: {
    label: 'Convoquée',
    icon: CheckCircle,
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  en_cours: {
    label: 'En cours',
    icon: PlayCircle,
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  terminee: {
    label: 'Terminée',
    icon: CheckCircle,
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  annulee: {
    label: 'Annulée',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

export function StatusBadge({ status, showIcon = true, className }) {
  const config = statusConfig[status] || statusConfig.demande;
  const Icon = config.icon;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
}

// Badge pour les étapes individuelles
export function StepBadge({ status }) {
  const icons = {
    completed: { icon: CheckCircle, className: 'text-green-600' },
    in_progress: { icon: Clock, className: 'text-yellow-600' },
    pending: { icon: Pause, className: 'text-gray-400' },
  };

  const config = icons[status] || icons.pending;
  const Icon = config.icon;

  return <Icon className={clsx('w-5 h-5', config.className)} />;
}
