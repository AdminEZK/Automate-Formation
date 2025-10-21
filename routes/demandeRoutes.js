const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const emailService = require('../services/emailService');
require('dotenv').config();

// Utiliser la clé SERVICE_ROLE pour bypasser le RLS (nécessaire pour les insertions backend)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
console.log('🔑 Clé Supabase utilisée:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'AUCUNE CLÉ');
console.log('🔑 SERVICE_ROLE disponible:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabase = createClient(process.env.SUPABASE_URL, supabaseKey);

// POST /api/demandes - Créer une nouvelle demande de formation
router.post('/demandes', async (req, res) => {
  try {
    const { entreprise, formation, participants } = req.body;

    console.log('📝 Nouvelle demande de formation reçue');
    console.log('📧 Email entreprise:', entreprise.email_contact);
    console.log('📊 Données reçues:', JSON.stringify({ entreprise, formation, participants }, null, 2));

    // 1. Vérifier si l'entreprise existe déjà (par email ou SIRET)
    let entrepriseId;
    
    const { data: entrepriseExistante } = await supabase
      .from('entreprises')
      .select('id')
      .or(`email_contact.eq.${entreprise.email_contact}${entreprise.siret ? `,siret.eq.${entreprise.siret}` : ''}`)
      .single();

    if (entrepriseExistante) {
      // Entreprise existe déjà
      entrepriseId = entrepriseExistante.id;
      console.log('✅ Entreprise existante trouvée:', entrepriseId);
      console.log('📝 Mise à jour avec:', { 
        nom: entreprise.nom, 
        adresse: entreprise.adresse,
        ville: entreprise.ville 
      });

      // Mettre à jour les informations si nécessaire
      const { error: updateError } = await supabase
        .from('entreprises')
        .update({
          nom: entreprise.nom,
          adresse: entreprise.adresse,
          code_postal: entreprise.code_postal,
          ville: entreprise.ville,
          telephone: entreprise.telephone
        })
        .eq('id', entrepriseId);

      if (updateError) {
        console.error('❌ Erreur lors de la mise à jour de l\'entreprise:', updateError);
      } else {
        console.log('✅ Entreprise mise à jour avec succès');
      }

    } else {
      // Créer une nouvelle entreprise
      const { data: nouvelleEntreprise, error: entrepriseError } = await supabase
        .from('entreprises')
        .insert([{
          nom: entreprise.nom,
          siret: entreprise.siret || null,
          adresse: entreprise.adresse || null,
          code_postal: entreprise.code_postal || null,
          ville: entreprise.ville || null,
          pays: entreprise.pays || 'France',
          email_contact: entreprise.email_contact,
          telephone: entreprise.telephone,
          site_web: entreprise.site_web || null
        }])
        .select()
        .single();

      if (entrepriseError) throw entrepriseError;

      entrepriseId = nouvelleEntreprise.id;
      console.log('✅ Nouvelle entreprise créée:', entrepriseId);
    }

    // 2. Créer la session de formation avec statut "demande"
    // Vérifier si c'est un UUID valide ou une formation en dur (slug)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isFormationEnDur = !uuidRegex.test(formation.formation_catalogue_id);
    
    const sessionData = {
      entreprise_id: entrepriseId,
      formation_catalogue_id: isFormationEnDur ? null : formation.formation_catalogue_id,
      date_debut: formation.date_debut,
      date_fin: formation.date_fin || null,
      statut: 'demande',
      nombre_participants: participants.length,
      modalite: formation.modalite || 'presentiel'
    };

    // Si c'est une formation en dur, on stocke le titre dans formation_titre
    if (isFormationEnDur) {
      const formationTitles = {
        'maitre-apprentissage': 'Devenir maître d\'apprentissage',
        'formateur-entreprise': 'Formation formateur en entreprise',
        'tuteur-afest': 'Formation – Tuteur référent AFEST',
        'strategie-entreprise': 'Formation Stratégie d\'entreprise',
        'conseils-rh': 'Formation Conseils RH'
      };
      sessionData.formation_titre = formationTitles[formation.formation_catalogue_id] || formation.formation_catalogue_id;
      sessionData.notes = `Formation personnalisée demandée via le formulaire`;
    }

    const { data: nouvelleSession, error: sessionError } = await supabase
      .from('sessions_formation')
      .insert([sessionData])
      .select()
      .single();

    if (sessionError) throw sessionError;

    console.log('✅ Session créée:', nouvelleSession.id);

    // 3. Ajouter les participants
    const participantsData = participants.map(p => ({
      session_formation_id: nouvelleSession.id,
      nom: p.nom,
      prenom: p.prenom,
      email: p.email,
      telephone: p.telephone || null,
      fonction: p.fonction || null,
      date_naissance: p.date_naissance || null,
      lieu_naissance: p.lieu_naissance || null,
      adresse: p.adresse || null,
      code_postal: p.code_postal || null,
      ville: p.ville || null,
      niveau_etudes: p.niveau_etudes || null,
      situation_handicap: p.situation_handicap || false,
      amenagements_necessaires: p.amenagements_necessaires || null
    }));

    console.log('👥 Participants à insérer:', JSON.stringify(participantsData, null, 2));

    const { error: participantsError } = await supabase
      .from('participants')
      .insert(participantsData);

    if (participantsError) throw participantsError;

    console.log(`✅ ${participants.length} participant(s) ajouté(s)`);

    // 4. Logger l'action (optionnel - commenté si la table n'existe pas)
    try {
      await supabase
        .from('actions_log')
        .insert([{
          session_formation_id: nouvelleSession.id,
          type_action: 'creation_demande',
          description: `Nouvelle demande de formation reçue via le formulaire public`,
          user_email: entreprise.email_contact,
          metadata: {
            modalite: formation.modalite,
            nombre_participants: participants.length
          }
        }]);
    } catch (logError) {
      console.log('⚠️ Impossible de logger l\'action (table actions_log peut-être absente)');
    }

    // 5. Envoyer les emails de confirmation
    console.log('📧 Envoi des emails de confirmation...');
    
    // Préparer les données pour l'email
    const formationInfo = {
      titre: sessionData.formation_titre || formation.titre || 'Formation demandée',
      duree: formation.duree || 'À définir',
      dates: formation.date_debut ? 
        `${new Date(formation.date_debut).toLocaleDateString('fr-FR')}${formation.date_fin ? ' au ' + new Date(formation.date_fin).toLocaleDateString('fr-FR') : ''}` 
        : 'Dates à définir',
      modalite: formation.modalite || 'presentiel',
      nombre_participants: participants.length
    };

    // Email au client (confirmation de demande)
    try {
      const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';
      console.log('📧 Tentative d\'envoi email client vers:', entreprise.email_contact, 'depuis:', emailFrom);
      const resultClient = await emailService.sendConfirmationDemande(
        entreprise.email_contact,
        entreprise.nom,
        formationInfo,
        emailFrom
      );
      console.log('📧 Résultat email client:', resultClient);
      if (resultClient.success) {
        console.log('✅ Email de confirmation envoyé au client:', entreprise.email_contact);
      } else {
        console.error('❌ Échec envoi email client:', resultClient.error);
      }
    } catch (emailError) {
      console.error('⚠️ Erreur lors de l\'envoi de l\'email au client:', emailError.message);
      // On ne bloque pas la réponse si l'email échoue
    }

    // Email à l'organisme (notification nouvelle demande)
    try {
      const emailOrganisme = process.env.EMAIL_ORGANISME || process.env.EMAIL_FROM || 'onboarding@resend.dev';
      const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';
      
      console.log('📧 Tentative d\'envoi email organisme vers:', emailOrganisme, 'depuis:', emailFrom);
      const resultOrganisme = await emailService.sendEmail(
        emailOrganisme,
        `🆕 Nouvelle demande de formation - ${entreprise.nom}`,
        `
          <h1>Nouvelle demande de formation reçue</h1>
          <h2>Entreprise</h2>
          <ul>
            <li><strong>Nom :</strong> ${entreprise.nom}</li>
            <li><strong>Email :</strong> ${entreprise.email_contact}</li>
            <li><strong>Téléphone :</strong> ${entreprise.telephone || 'Non renseigné'}</li>
            <li><strong>Ville :</strong> ${entreprise.ville || 'Non renseigné'}</li>
          </ul>
          <h2>Formation demandée</h2>
          <ul>
            <li><strong>Formation :</strong> ${formationInfo.titre}</li>
            <li><strong>Dates souhaitées :</strong> ${formationInfo.dates}</li>
            <li><strong>Modalité :</strong> ${formationInfo.modalite}</li>
            <li><strong>Nombre de participants :</strong> ${formationInfo.nombre_participants}</li>
          </ul>
          <h2>Participants</h2>
          <ul>
            ${participants.map(p => `<li>${p.prenom} ${p.nom} - ${p.email}</li>`).join('')}
          </ul>
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/sessions/${nouvelleSession.id}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Voir la demande dans le dashboard</a></p>
        `,
        emailFrom
      );
      console.log('📧 Résultat email organisme:', resultOrganisme);
      if (resultOrganisme.success) {
        console.log('✅ Email de notification envoyé à l\'organisme:', emailOrganisme);
      } else {
        console.error('❌ Échec envoi email organisme:', resultOrganisme.error);
      }
    } catch (emailError) {
      console.error('⚠️ Erreur lors de l\'envoi de l\'email à l\'organisme:', emailError.message);
      // On ne bloque pas la réponse si l'email échoue
    }

    res.status(201).json({
      success: true,
      message: 'Demande de formation enregistrée avec succès',
      session_id: nouvelleSession.id,
      entreprise_id: entrepriseId
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création de la demande:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'enregistrement de votre demande',
      details: error.message 
    });
  }
});

// GET /api/demandes - Liste des demandes (pour le dashboard)
router.get('/demandes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vue_sessions_formation')
      .select('*')
      .eq('statut', 'demande')
      .order('session_created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes' });
  }
});

module.exports = router;
