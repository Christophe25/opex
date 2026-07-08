import React from 'react';
import { Headphones, User, FileText } from 'lucide-react';

export function NavBar({ currentPage, onNavigate }) {
  const links = [
    { id: 'podcast', label: 'Podcast', icon: <Headphones size={16} /> },
    { id: 'cv', label: 'CV', icon: <User size={16} /> },
    { id: 'lettre', label: 'Lettre de motivation', icon: <FileText size={16} /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onNavigate('podcast')}>
        <span className="navbar-name">Christophe Fournier</span>
        <span className="navbar-subtitle">Qualité Horlogerie · Excellence Opérationnelle · IA</span>
      </div>
      <div className="navbar-links">
        {links.map(link => (
          <button
            key={link.id}
            className={`navbar-link ${currentPage === link.id ? 'active' : ''}`}
            onClick={() => onNavigate(link.id)}
          >
            {link.icon}
            <span>{link.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
