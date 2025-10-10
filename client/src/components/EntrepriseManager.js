import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import supabaseClient from '../services/supabaseClient';

const EntrepriseManager = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('entreprises')
          .select('*')
          .order('nom_entreprise');
        
        if (error) throw error;
        setEntreprises(data || []);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors du chargement des entreprises');
      } finally {
        setLoading(false);
      }
    };

    fetchEntreprises();
  }, []);

  if (loading) return <Container className="my-4"><p>Chargement...</p></Container>;
  if (error) return <Container className="my-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="my-4">
      <h1>Gestion des Entreprises</h1>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entreprises.map(entreprise => (
            <tr key={entreprise.id}>
              <td>{entreprise.nom_entreprise}</td>
              <td>{entreprise.email_contact}</td>
              <td>{entreprise.telephone}</td>
              <td>
                <Button variant="primary" size="sm">Modifier</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default EntrepriseManager;
