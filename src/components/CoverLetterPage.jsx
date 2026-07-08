import React, { useState } from 'react';
import { Printer, ChevronDown } from 'lucide-react';

const letters = {
  ap: {
    company: 'Audemars Piguet',
    role: 'Responsable Excellence Opérationnelle',
    location: 'Le Locle, Neuchâtel',
    contact: 'Madame, Monsieur,',
    body: [
      `Votre offre pour le poste de Responsable Excellence Opérationnelle au sein d'Audemars Piguet a immédiatement retenu mon attention. Elle correspond avec précision à ce que je construis depuis plus de dix ans : une expertise terrain en qualité et en amélioration continue, appliquée au cœur de la manufacture horlogère suisse.`,
      `Au fil de mon parcours chez Comadur, Sellita et ValFleurier, j'ai piloté des démarches Lean/Kaizen, encadré des équipes pluridisciplinaires et supervisé le traitement des non-conformités du développement jusqu'au marché. J'ai notamment conduit le projet de performance chronométrique des mouvements mécaniques chez ValFleurier, de la phase R&D jusqu'à la validation client — une expérience directement transposable aux exigences d'Audemars Piguet.`,
      `Ce qui me distingue aujourd'hui, c'est ma capacité à associer cette expertise métier aux nouveaux outils de l'intelligence artificielle. J'utilise Claude Code et Gemini CLI au quotidien pour automatiser des processus, analyser des données et développer des applications métier. J'ai notamment créé une plateforme qui centralise et analyse les données de SAP, Qualaxy, Windchill et Outlook — transformant des silos d'information en tableaux de bord décisionnels. Cette compétence rare me permet d'accélérer concrètement les cycles d'amélioration continue.`,
      `Je suis convaincu que l'excellence opérationnelle de demain se construit à l'intersection de la rigueur horlogère et des outils numériques intelligents. C'est ce positionnement que je souhaite mettre au service d'Audemars Piguet.`,
      `Je serais heureux d'échanger avec vous sur la façon dont mon profil peut contribuer à vos ambitions. Je reste disponible pour un entretien à votre convenance.`,
    ],
    closing: 'Dans l\'attente de votre retour, je vous adresse mes sincères salutations.',
  },
  generic: {
    company: '[Nom de l\'entreprise]',
    role: '[Poste visé]',
    location: '[Lieu]',
    contact: 'Madame, Monsieur,',
    body: [
      `Votre offre pour le poste de [Poste visé] a retenu toute mon attention. Fort de plus de dix ans d'expérience en qualité industrielle et excellence opérationnelle dans le secteur horloger suisse, je suis convaincu que mon profil correspond aux attentes de votre équipe.`,
      `Au cours de mon parcours chez Comadur (Swatch Group), Sellita et ValFleurier, j'ai piloté des démarches Lean/Kaizen, encadré des équipes pluridisciplinaires et géré des projets qualité de bout en bout — du développement produit jusqu'au marché. La maîtrise des processus horlogers et des outils de résolution de problèmes (QRQC, 8D, DMAIC) constitue le socle de mon expertise.`,
      `Ce qui me distingue aujourd'hui, c'est ma capacité à combiner cette expertise métier avec les outils de l'intelligence artificielle. J'utilise Claude Code et Gemini CLI pour automatiser des analyses, développer des applications métier et traiter des données multi-systèmes (SAP, ERP, MES). J'ai notamment développé une plateforme d'intégration de données qui transforme des silos d'information en tableaux de bord décisionnels, accélérant directement les cycles d'amélioration continue.`,
      `Je suis persuadé que l'excellence opérationnelle de demain se construit à l'intersection du savoir-faire industriel et de l'intelligence artificielle. C'est cette vision que je souhaite mettre au service de votre organisation.`,
      `Je me tiens disponible pour un entretien à votre convenance et reste à votre disposition pour toute information complémentaire.`,
    ],
    closing: 'Dans l\'attente de votre retour, je vous adresse mes sincères salutations.',
  },
};

export function CoverLetterPage() {
  const [selected, setSelected] = useState('ap');
  const letter = letters[selected];

  return (
    <div className="letter-page">
      {/* Selector */}
      <div className="letter-selector glass">
        <label className="letter-selector-label">Lettre ciblée pour :</label>
        <div className="letter-selector-buttons">
          <button
            className={`btn ${selected === 'ap' ? '' : 'btn-secondary'}`}
            onClick={() => setSelected('ap')}
          >
            Audemars Piguet
          </button>
          <button
            className={`btn ${selected === 'generic' ? '' : 'btn-secondary'}`}
            onClick={() => setSelected('generic')}
          >
            Modèle générique
          </button>
        </div>
        <button className="btn btn-secondary letter-print-btn" onClick={() => window.print()}>
          <Printer size={16} />
          Imprimer / PDF
        </button>
      </div>

      {/* Letter */}
      <div className="letter-doc glass">
        {/* Header */}
        <div className="letter-header">
          <div className="letter-sender">
            <strong>Christophe Fournier</strong>
            <span>3 rue de la Voigera, 25500 Les Fins</span>
            <span>+33 664 13 77 55</span>
            <span>christophef7@yahoo.fr</span>
            <span>opex-five.vercel.app</span>
          </div>
          <div className="letter-recipient">
            <strong>{letter.company}</strong>
            <span>{letter.role}</span>
            <span>{letter.location}</span>
          </div>
        </div>

        <div className="letter-date">
          Les Fins, le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        <div className="letter-subject">
          <strong>Objet :</strong> Candidature au poste de {letter.role}
        </div>

        <p className="letter-contact">{letter.contact}</p>

        <div className="letter-body">
          {letter.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <p className="letter-closing">{letter.closing}</p>

        <div className="letter-signature">
          <span>Christophe Fournier</span>
        </div>
      </div>
    </div>
  );
}
