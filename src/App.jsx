import React, { useState, useEffect, useRef } from 'react';
import { podcasts, podcastMeta, bonusPodcasts } from './data';
import { PodcastCard } from './components/PodcastCard';
import { AudioPlayer } from './components/AudioPlayer';
import { NavBar } from './components/NavBar';
import { CVPage } from './components/CVPage';
import { CoverLetterPage } from './components/CoverLetterPage';
import { Headphones, Archive, Library, Award } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Analytics } from '@vercel/analytics/react';

function PodcastSection() {
  const [activeTab, setActiveTab] = useState('all');
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem('opex_read_ids');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('opex_read_ids', JSON.stringify(readIds));
  }, [readIds]);

  const toggleRead = (id) => {
    setReadIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const displayedItems = activeTab === 'bonus'
    ? bonusPodcasts
    : podcasts.filter(p => {
      if (activeTab === 'archives') return readIds.includes(p.id);
      return !readIds.includes(p.id);
    });

  const handlePlay = (podcast) => {
    if (currentPodcast?.id === podcast.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentPodcast(podcast);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (currentPodcast && audioRef.current) {
      audioRef.current.src = currentPodcast.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(() => { });
      }
    }
  }, [currentPodcast]);

  const playNext = () => {
    if (!currentPodcast) return;
    const idx = podcasts.findIndex(p => p.id === currentPodcast.id);
    if (idx < podcasts.length - 1) {
      setCurrentPodcast(podcasts[idx + 1]);
      setIsPlaying(true);
    }
  };

  const playPrev = () => {
    if (!currentPodcast) return;
    const idx = podcasts.findIndex(p => p.id === currentPodcast.id);
    if (idx > 0) {
      setCurrentPodcast(podcasts[idx - 1]);
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={() => { setIsPlaying(false); playNext(); }}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <header className="hero">
        <div className="hero-bg">
          <img src={podcastMeta.coverImage} alt="" className="hero-cover" />
          <div className="hero-overlay" />
        </div>

        <div className="hero-qrcode glass">
          <QRCodeSVG value={window.location.href} size={64} bgColor="transparent" fgColor="#d4af37" />
          <span className="hero-qrcode-text">Scanner pour<br />partager</span>
        </div>

        <div className="hero-content">
          <div className="badge glass">
            <Headphones size={18} color="var(--primary)" />
            <span>Série de Podcasts</span>
          </div>
          <h1>Le Temps Maîtrisé</h1>
          <p className="subtitle">
            Excellence opérationnelle dans l'horlogerie suisse.
            Chaque épisode explore les outils du Lean, la qualité et la précision,
            appliqués à un univers où le temps se mesure au micron.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">{podcasts.length}</span>
              <span className="stat-label">Épisodes</span>
            </div>
            <div className="stat">
              <span className="stat-value">par</span>
              <span className="stat-label">{podcastMeta.author}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="tabs">
        <div className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          <Library size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Épisodes
        </div>
        <div className={`tab ${activeTab === 'archives' ? 'active' : ''}`} onClick={() => setActiveTab('archives')}>
          <Archive size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Archives
        </div>
        <div className={`tab ${activeTab === 'bonus' ? 'active' : ''}`} onClick={() => setActiveTab('bonus')}>
          <Award size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Bonus
        </div>
      </div>

      <div className="podcast-grid">
        {displayedItems.map(podcast => (
          <PodcastCard
            key={podcast.id}
            podcast={podcast}
            isRead={readIds.includes(podcast.id)}
            isCurrentlyPlaying={currentPodcast?.id === podcast.id && isPlaying}
            onToggleRead={toggleRead}
            onPlay={handlePlay}
          />
        ))}
      </div>

      {displayedItems.length === 0 && (
        <div className="empty-state">
          <Headphones size={48} color="var(--text-secondary)" />
          <p>{activeTab === 'archives' ? 'Aucun épisode archivé.' : 'Tous les épisodes ont été écoutés !'}</p>
        </div>
      )}

      {currentPodcast && (
        <AudioPlayer
          podcast={currentPodcast}
          isPlaying={isPlaying}
          audioRef={audioRef}
          onPlayPause={() => {
            if (isPlaying) audioRef.current?.pause();
            else audioRef.current?.play();
          }}
          onPrev={playPrev}
          onNext={playNext}
          onClose={() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            setIsPlaying(false);
            setCurrentPodcast(null);
          }}
        />
      )}
    </>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('podcast');

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <NavBar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="container">
        {currentPage === 'podcast' && <PodcastSection />}
        {currentPage === 'cv' && <CVPage />}
        {currentPage === 'lettre' && <CoverLetterPage />}
      </div>
      <Analytics />
    </>
  );
}

export default App;
