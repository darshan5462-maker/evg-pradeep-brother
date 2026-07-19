import { X, Play, Pause, Volume2, Maximize, Music, Video } from 'lucide-react';
import { Sermon } from '../types';
import { useState, useEffect, useRef, ChangeEvent } from 'react';

interface MediaPlayerProps {
  sermon: Sermon | null;
  onClose: () => void;
}

export default function MediaPlayer({ sermon, onClose }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);
  }, [sermon]);

  if (!sermon) return null;

  const handlePlayPause = () => {
    if (sermon.type === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol / 100;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary-container text-white border-t border-outline/20 shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Sermon Details */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-16 h-12 md:w-24 md:h-16 rounded overflow-hidden relative shrink-0">
            <img src={sermon.imageUrl} alt={sermon.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              {sermon.type === 'video' ? <Video className="w-4 h-4 text-white" /> : <Music className="w-4 h-4 text-white" />}
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-secondary text-white px-2 py-0.5 rounded-full font-label-caps uppercase tracking-wider font-bold">
                {sermon.type}
              </span>
              <span className="text-xs text-on-primary-container font-mono">{sermon.duration}</span>
            </div>
            <h4 className="text-sm font-semibold text-white line-clamp-1 mt-1">{sermon.title}</h4>
            <p className="text-xs text-on-primary-container">Speaker: Bro {sermon.speaker}</p>
          </div>
        </div>

        {/* Player Controls & Visualizers */}
        <div className="flex flex-col items-center gap-2 w-full md:flex-1 md:max-w-xl">
          {sermon.type === 'video' && sermon.mediaUrl ? (
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black max-h-[140px] md:max-h-[180px] mb-2 border border-outline/30">
              <iframe
                src={`${sermon.mediaUrl}?autoplay=1&mute=0`}
                title={sermon.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : sermon.type === 'audio' && sermon.mediaUrl ? (
            <audio
              ref={audioRef}
              src={sermon.mediaUrl}
              autoPlay
              onTimeUpdate={() => {
                if (audioRef.current) {
                  const current = audioRef.current.currentTime;
                  const total = audioRef.current.duration || 1;
                  setProgress((current / total) * 100);
                }
              }}
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <div className="text-xs text-secondary-fixed-dim bg-white/5 py-2 px-4 rounded w-full text-center italic">
              This teaches a Series study. Please explore Bible Study material below.
            </div>
          )}

          {sermon.type === 'audio' && (
            <div className="flex items-center gap-4 w-full">
              <button 
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>

              <div className="flex-1 flex items-center gap-2">
                <span className="text-[10px] font-mono text-on-primary-container">
                  {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) : 0}:
                  {audioRef.current ? String(Math.floor(audioRef.current.currentTime % 60)).padStart(2, '0') : '00'}
                </span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const percent = clickX / rect.width;
                  setProgress(percent * 100);
                  if (audioRef.current) {
                    audioRef.current.currentTime = percent * audioRef.current.duration;
                  }
                }}>
                  <div className="absolute left-0 top-0 bottom-0 bg-secondary-container" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="text-[10px] font-mono text-on-primary-container">
                  {audioRef.current && isFinite(audioRef.current.duration) ? Math.floor(audioRef.current.duration / 60) : 0}:
                  {audioRef.current && isFinite(audioRef.current.duration) ? String(Math.floor(audioRef.current.duration % 60)).padStart(2, '0') : '00'}
                </span>
              </div>

              {/* Volume */}
              <div className="hidden sm:flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-on-primary-container" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-on-primary-container hover:text-white"
            title="Close Player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
