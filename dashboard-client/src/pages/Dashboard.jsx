import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { SessionCard } from '../components/SessionCard';
import { sessionsApi } from '../lib/api';

export function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionsApi.getAll();
      setSessions(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les sessions
  const filteredSessions = sessions.filter(session => {
    // Filtre par recherche
    const matchSearch = searchTerm === '' || 
      session.entreprise_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.formation_titre?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par statut
    const matchStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && session.statut !== 'annulee' && session.statut !== 'terminee') ||
      (statusFilter === 'waiting' && session.statut === 'devis_envoye') ||
      (statusFilter === 'cancelled' && session.statut === 'annulee');

    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            📊 Sessions de Formation
          </h1>
          <p className="mt-2 text-gray-600">
            Suivi et gestion de vos formations
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par entreprise ou formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filtre par statut */}
            <div className="sm:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Toutes les sessions</option>
                  <option value="active">Sessions actives</option>
                  <option value="waiting">En attente d'action</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des sessions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600">Chargement des sessions...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-600">Aucune session trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
