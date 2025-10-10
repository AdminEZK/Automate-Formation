import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs) {
  return clsx(inputs);
}

// Formater une date
export function formatDate(date, formatStr = 'dd/MM/yyyy') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}

// Formater une date avec l'heure
export function formatDateTime(date) {
  return formatDate(date, 'dd/MM/yyyy à HH:mm');
}

// Formater une plage de dates
export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return '';
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

// Télécharger un fichier blob
export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Obtenir le label d'un statut
export function getStatusLabel(status) {
  const labels = {
    demande: 'Demande reçue',
    devis_envoye: 'Devis envoyé',
    en_attente: 'En attente',
    confirmee: 'Confirmée',
    convoquee: 'Convoquée',
    en_cours: 'En cours',
    terminee: 'Terminée',
    annulee: 'Annulée',
  };
  return labels[status] || status;
}

// Formater le numéro de session (Session AC# N°)
export function formatSessionNumber(sessionId, createdAt) {
  if (!sessionId || !createdAt) return 'Session';
  
  // Extraire l'année de création
  const year = new Date(createdAt).getFullYear();
  
  // Utiliser les 6 premiers caractères de l'UUID comme numéro unique
  const shortId = sessionId.slice(0, 6).toUpperCase();
  
  return `Session AC${year} N°${shortId}`;
}

// Obtenir le label de la modalité
export function getModaliteLabel(modalite) {
  const labels = {
    presentiel: 'Présentiel',
    distanciel: 'Distanciel',
    mixte: 'Mixte',
  };
  return labels[modalite] || modalite || 'Présentiel';
}
