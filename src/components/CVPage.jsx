import React from 'react';
import { Briefcase, GraduationCap, Cpu, Wrench, Mic } from 'lucide-react';

const experiences = [
  {
    period: 'juin 2023 – Aujourd\'hui',
    title: 'Chef de projet Qualité',
    company: 'ValFleurier, Buttes',
    tasks: [
      'Pilotage de projets d\'excellence opérationnelle et déploiement de la démarche AQF chez les fournisseurs.',
      'Développement d\'une plateforme métier intégrant SAP, Qualaxy, Windchill et Outlook pour centraliser et analyser les données qualité.',
      'Conduite du projet performance chronométrique des mouvements mécaniques (du développement au marché).',
      'Formation des collaborateurs aux normes, outils statistiques et méthodes de résolution de problèmes.',
      'Création et animation du podcast "Le Temps Maîtrisé" sur l\'excellence opérationnelle en horlogerie.',
    ],
    current: true,
  },
  {
    period: 'août 2019 – mai 2023',
    title: 'Adjoint Directeur Qualité',
    company: 'Sellita, La Chaux-de-Fonds',
    tasks: [
      'Management d\'une équipe pluridisciplinaire et pilotage de projets d\'amélioration continue (Lean, PDCA, 8D).',
      'Mise en place de l\'AQF en relation avec les exigences techniques du mouvement et satisfaction clients.',
      'Mise en œuvre de la méthode MSP dans les ateliers.',
      'Support méthodologique dans l\'analyse des sources de variabilité des process d\'usinage et d\'assemblage.',
      'Réalisation des indicateurs de productivité et de qualité.',
    ],
  },
  {
    period: 'juin 2018 – juil. 2019',
    title: 'Responsable Qualité Glace Saphir',
    company: 'Comadur (Swatch Group), La Chaux-de-Fonds',
    tasks: [
      'Mise en application du plan de surveillance produit/process.',
      'Conduite de l\'activité des agents qualité.',
      'Gestion du processus de traitement des non-conformités (actions préventives et correctives).',
      'Élaboration des indicateurs qualité.',
    ],
  },
  {
    period: 'juil. 2017 – mai 2018',
    title: 'Chef de projet – Outils Qualité',
    company: 'Comadur (Swatch Group), Le Locle',
    tasks: [
      'Management des projets d\'amélioration continue des lignes de production Céramique, Saphir et Microcomposants.',
    ],
  },
  {
    period: 'juin 2014 – juin 2017',
    title: 'Responsable Qualité Pierre d\'Horlogerie',
    company: 'Comadur (Swatch Group), Le Locle',
    tasks: [
      'Gestion des relations clients/fournisseurs.',
      'Résolution des problèmes qualité en atelier avec mise en place des outils d\'amélioration.',
      'Encadrement d\'une équipe de 20 collaborateurs pour l\'activité Contrôle Pierre d\'Horlogerie.',
    ],
  },
  {
    period: 'févr. 2013 – juin 2014',
    title: 'Agent Qualité Système',
    company: 'Universo (Swatch Group), La Chaux-de-Fonds',
    tasks: [
      'Conduite de l\'audit interne des 3 sites de production.',
      'Révision des documents d\'auto contrôle.',
      'Mise en place d\'indicateurs pour le suivi des non-conformités.',
    ],
  },
];

const skillsMetier = [
  'Excellence opérationnelle (Lean Management, Kaizen)',
  'Résolution de problèmes (QRQC, 8D, DMAIC, 5P, Ishikawa)',
  'Maîtrise statistique des procédés (SPC, MSP, R&R)',
  'Gestion des non-conformités internes et externes',
  'Déploiement AQF et plans de surveillance produit/process',
  'Normes ISO 9001 / ISO/TS 16949',
  'Management d\'équipe (jusqu\'à 20 collaborateurs)',
  'KPIs et indicateurs de performance qualité',
];

const skillsIA = [
  { name: 'Claude Code', level: 5 },
  { name: 'Gemini CLI', level: 5 },
  { name: 'Automatisation de processus', level: 5 },
  { name: 'Power BI', level: 5 },
  { name: 'Excel / Power Query', level: 5 },
  { name: 'SAP / Infor (ERP)', level: 4 },
  { name: 'Qualaxy / Windchill / MES', level: 4 },
  { name: 'Minitab / Ellistat', level: 4 },
];

const education = [
  { year: 'juin 2012 – déc. 2012', title: 'Analyste Qualité (TQ2)', school: 'Ariaq, Yverdon' },
  { year: 'nov. 2002 – juil. 2003', title: 'Technicien en Commerce International et Logistique', school: 'Chambre de Commerce de Haute Saône, Vesoul' },
  { year: 'sept. 1990 – juil. 1992', title: 'BEP (option Électronique)', school: 'Lycée Professionnel Montjoux, Besançon' },
];

function SkillDots({ level }) {
  return (
    <div className="skill-dots">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`skill-dot ${i <= level ? 'filled' : ''}`} />
      ))}
    </div>
  );
}

export function CVPage({ onNavigate }) {
  return (
    <div className="cv-page">
      {/* CV Hero */}
      <div className="cv-hero glass">
        <div className="cv-hero-avatar">CF</div>
        <div className="cv-hero-info">
          <h2 className="cv-name">Christophe Fournier</h2>
          <p className="cv-title">Responsable Excellence Opérationnelle · Qualité Horlogerie · IA Appliquée</p>
          <p className="cv-accroche">
            Professionnel de la Qualité en horlogerie, j'associe une expertise solide en excellence opérationnelle
            à la maîtrise des nouveaux outils IA (Claude Code, Gemini CLI) pour créer de la valeur :
            automatisation des processus, analyse de données multi-systèmes et développement d'applications métier.
          </p>
          <div className="cv-contacts">
            <span>christophef7@yahoo.fr</span>
            <span>033 664 13 77 55</span>
            <span>Les Fins, France (25500)</span>
          </div>
        </div>
        <button className="btn cv-podcast-btn" onClick={() => onNavigate('podcast')}>
          <Mic size={16} />
          Mon Podcast
        </button>
      </div>

      <div className="cv-grid">
        {/* Left column */}
        <div className="cv-left">
          {/* Skills métier */}
          <section className="cv-section glass">
            <h3 className="cv-section-title">
              <Wrench size={18} />
              Compétences Métier
            </h3>
            <ul className="cv-skill-list">
              {skillsMetier.map((s, i) => (
                <li key={i} className="cv-skill-item">{s}</li>
              ))}
            </ul>
          </section>

          {/* Skills IA */}
          <section className="cv-section glass">
            <h3 className="cv-section-title">
              <Cpu size={18} />
              IA &amp; Outils Numériques
            </h3>
            <div className="cv-skill-bars">
              {skillsIA.map((s, i) => (
                <div key={i} className="cv-skill-bar-row">
                  <span className="cv-skill-name">{s.name}</span>
                  <SkillDots level={s.level} />
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="cv-section glass">
            <h3 className="cv-section-title">
              <GraduationCap size={18} />
              Formation
            </h3>
            {education.map((e, i) => (
              <div key={i} className="cv-edu-item">
                <span className="cv-edu-year">{e.year}</span>
                <span className="cv-edu-title">{e.title}</span>
                <span className="cv-edu-school">{e.school}</span>
              </div>
            ))}
          </section>

          {/* Langues */}
          <section className="cv-section glass">
            <h3 className="cv-section-title">Langues</h3>
            <div className="cv-skill-bars">
              <div className="cv-skill-bar-row">
                <span className="cv-skill-name">Français</span>
                <SkillDots level={5} />
              </div>
              <div className="cv-skill-bar-row">
                <span className="cv-skill-name">Anglais</span>
                <SkillDots level={3} />
              </div>
            </div>
          </section>
        </div>

        {/* Right column — Experience timeline */}
        <div className="cv-right">
          <section className="cv-section">
            <h3 className="cv-section-title">
              <Briefcase size={18} />
              Expériences Professionnelles
            </h3>
            <div className="cv-timeline">
              {experiences.map((exp, i) => (
                <div key={i} className={`cv-timeline-item ${exp.current ? 'current' : ''}`}>
                  <div className="cv-timeline-dot" />
                  <div className="cv-timeline-content glass">
                    <span className="cv-timeline-period">{exp.period}</span>
                    <h4 className="cv-timeline-title">{exp.title}</h4>
                    <span className="cv-timeline-company">{exp.company}</span>
                    <ul className="cv-timeline-tasks">
                      {exp.tasks.map((t, j) => (
                        <li key={j}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
