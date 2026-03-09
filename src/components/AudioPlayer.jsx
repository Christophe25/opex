import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, X } from 'lucide-react';

export function AudioPlayer({ podcast, isPlaying, audioRef, onPlayPause, onPrev, onNext, onClose }) {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('durationchange', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('durationchange', updateDuration);
        };
    }, [audioRef]);

    const formatTime = (secs) => {
        if (isNaN(secs)) return '0:00';
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e) => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        if (audioRef.current) {
            audioRef.current.currentTime = ratio * duration;
        }
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="player-bar glass">
            {/* Podcast Info */}
            <div className="player-info">
                <img src={podcast.image} alt="" className="player-thumb" />
                <div className="player-text">
                    <div className="player-title">{podcast.title}</div>
                    <div className="player-author">Le Temps Maîtrisé</div>
                </div>
            </div>

            {/* Controls */}
            <div className="player-controls">
                <div className="player-buttons">
                    <button className="player-btn" onClick={onPrev} aria-label="Précédent">
                        <SkipBack size={20} />
                    </button>
                    <button className="player-btn player-btn-main" onClick={onPlayPause} aria-label={isPlaying ? 'Pause' : 'Lecture'}>
                        {isPlaying ? <Pause size={22} fill="black" /> : <Play size={22} fill="black" style={{ marginLeft: '2px' }} />}
                    </button>
                    <button className="player-btn" onClick={onNext} aria-label="Suivant">
                        <SkipForward size={20} />
                    </button>
                </div>
                <div className="player-progress-row">
                    <span className="player-time">{formatTime(currentTime)}</span>
                    <div className="player-progress-bar" onClick={handleSeek}>
                        <div className="player-progress-fill" style={{ width: `${progress}%` }} />
                        <div className="player-progress-dot" style={{ left: `${progress}%` }} />
                    </div>
                    <span className="player-time">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume (Desktop only) */}
            <div className="player-volume">
                <Volume2 size={18} color="var(--text-secondary)" />
            </div>

            <button className="player-btn close-player-btn" onClick={onClose} aria-label="Fermer le lecteur" title="Fermer">
                <X size={20} color="var(--text-secondary)" />
            </button>
        </div>
    );
}
