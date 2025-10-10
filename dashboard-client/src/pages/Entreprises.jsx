import { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { entreprisesApi } from '../lib/api';
import { downloadBlob } from '../lib/utils';

export function Entreprises() {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadEntreprises();
  }, []);

  const loadEntreprises = async () => {
    try {
      setLoading(true);
      const response = await entreprisesApi.getAll();
      setEntreprises(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async (entrepriseId, entrepriseNom) => {
    try {
      const response = await entreprisesApi.exportCSV(entrepriseId);
      downloadBlob(response.data, `${entrepriseNom}_export.csv`);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export CSV');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🏢 Entreprises Clientes
          </h1>
          <p className="mt-2 text-gray-600">
            Gestion de vos clients et historique des formations
          </p>
        </div>
      </div>

      {/* Liste des entreprises */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {entreprises.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">Aucune entreprise enregistrée</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {entreprises.map((entreprise) => (
              <Card key={entreprise.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {entreprise.nom}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium">{entreprise.email}</p>
                          </div>
                        </div>

                        {entreprise.telephone && (
                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-gray-500">Téléphone</p>
                              <p className="font-medium">{entreprise.telephone}</p>
                            </div>
                          </div>
                        )}

                        {entreprise.adresse && (
                          <div className="flex items-start gap-2 md:col-span-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-gray-500">Adresse</p>
                              <p className="font-medium">
                                {entreprise.adresse}
                                {entreprise.code_postal && `, ${entreprise.code_postal}`}
                                {entreprise.ville && ` ${entreprise.ville}`}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Statistiques */}
                      <div className="mt-4 flex gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">Formations : </span>
                          <span className="font-semibold">{entreprise.nombre_sessions || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Participants : </span>
                          <span className="font-semibold">{entreprise.nombre_participants || 0}</span>
                        </div>
                      </div>

                      {/* Historique des formations */}
                      {entreprise.sessions && entreprise.sessions.length > 0 && (
                        <div className="mt-4">
                          <button
                            onClick={() => toggleExpand(entreprise.id)}
                            className="text-sm text-primary hover:underline"
                          >
                            {expandedId === entreprise.id ? '▼' : '▶'} Historique des formations ({entreprise.sessions.length})
                          </button>

                          {expandedId === entreprise.id && (
                            <div className="mt-3 space-y-2">
                              {entreprise.sessions.map((session) => (
                                <div
                                  key={session.id}
                                  className="pl-4 border-l-2 border-gray-200 py-2"
                                >
                                  <p className="font-medium text-gray-900">
                                    {session.formation_titre}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {session.statut === 'terminee' ? '✅ Terminée' : 
                                     session.statut === 'en_cours' ? '🎓 En cours' :
                                     session.statut === 'annulee' ? '❌ Annulée' : '⏳ En cours'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bouton export */}
                    <div>
                      <Button
                        onClick={() => handleExportCSV(entreprise.id, entreprise.nom)}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4" />
                        Exporter (CSV)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
