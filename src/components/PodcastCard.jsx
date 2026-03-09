import React from 'react';
import { Play, Pause, CheckCircle, Clock } from 'lucide-react';

export function PodcastCard({ podcast, isRead, isCurrentlyPlaying, onToggleRead, onPlay }) {
    return (
        <div className={`card glass ${isRead ? 'card--read' : ''}`}>
            {/* Episode Image */}
            <div className="card-image">
                <img src={podcast.image} alt={podcast.title} />
                <button
                    className="card-play-btn"
                    onClick={() => onPlay(podcast)}
                    aria-label={isCurrentlyPlaying ? 'Pause' : 'Écouter'}
                >
                    {isCurrentlyPlaying
                        ? <Pause size={24} fill="black" />
                        : <Play size={24} fill="black" style={{ marginLeft: '3px' }} />
                    }
                </button>
            </div>

            {/* Content */}
            <div className="card-body">
                <div className="card-meta">
                    <span className="card-meta-item">
                        <Clock size={14} />
                        {podcast.duration}
                    </span>
                    <span className="card-meta-item">
                        {new Date(podcast.date).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </span>
                </div>

                <h3 className="card-title">{podcast.title}</h3>

                <p className="card-description">{podcast.description}</p>

                {/* Keywords */}
                {podcast.keywords?.length > 0 && (
                    <div className="card-tags">
                        {podcast.keywords.slice(0, 5).map(kw => (
                            <span key={kw} className="tag">{kw}</span>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="card-actions">
                    <button className="btn" onClick={() => onPlay(podcast)}>
                        {isCurrentlyPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                        {isCurrentlyPlaying ? 'Pause' : 'Écouter'}
                    </button>

                    <div className="card-actions-right">

                        <button
                            className={`btn btn-secondary btn-icon ${isRead ? 'btn--active' : ''}`}
                            onClick={() => onToggleRead(podcast.id)}
                            title={isRead ? 'Remettre comme non lu' : 'Marquer comme écouté'}
                        >
                            <CheckCircle size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
