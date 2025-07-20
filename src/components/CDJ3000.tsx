import React, { useEffect, useRef, useState } from 'react';
import { getAudioContext } from '../audio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import Touchscreen from './Touchscreen';

interface Props {
  files: File[];
  name: string;
  color: string;
  /**
   * Optional ref to expose the underlying audio element.
   * Allows the mixer component to control volume/crossfader.
   */
  audioRef?: React.RefObject<HTMLAudioElement>;
}

// Simple placeholder implementation of a Pioneer CDJ-3000 deck.
// Offers basic audio playback functionality for now.
const CDJ3000: React.FC<Props> = ({ files, name, audioRef, color }) => {
  const internalRef = useRef<HTMLAudioElement | null>(null);
  const ref = audioRef ?? internalRef;
  const [selected, setSelected] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trackInfo, setTrackInfo] = useState<{title: string; duration: number; bpm?: number} | null>(null);
  const deckColors: Record<string, string> = { cyan: '#06b6d4', rose: '#f43f5e' };

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const loadTrack = (file: File) => {
    const url = URL.createObjectURL(file);
    setSelected(url);
    setTrackInfo({ title: file.name, duration: 0 });
  };

  const play = () => {
    const ctx = getAudioContext();
    ctx.resume();
    ref.current?.play();
  };

  const pause = () => {
    ref.current?.pause();
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !ref.current) return;
    ref.current.currentTime += e.movementX * 0.01;
    setRotation(r => r + e.movementX);
  };

  useEffect(() => {
    if (!ref.current) return;
    const audio = ref.current;
    const updateProgress = () => {
      if (audio.duration > 0) {
        setProgress(audio.currentTime / audio.duration);
      }
      if (isPlaying) requestAnimationFrame(updateProgress);
    };
    const onPlay = () => {
      setIsPlaying(true);
      updateProgress();
    };
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [ref, isPlaying]);

  useEffect(() => {
    if (!selected) return;
    if (ref.current) {
      ref.current.onloadedmetadata = () => {
        setTrackInfo(info => info && { ...info, duration: ref.current!.duration });
      };
    }
  }, [selected]);

  return (
    <div
      className="glass-panel text-center"
      style={{ boxShadow: `0 0 15px ${deckColors[color]}` }}
    >
      <h2 className="font-semibold mb-2 text-lg">{name} – CDJ‑3000</h2>
      {trackInfo && (
        <div className="text-sm mb-1 flex justify-between">
          <span>{trackInfo.title}</span>
          <span>
            {formatTime(ref.current?.currentTime || 0)} / {formatTime(trackInfo.duration)}
          </span>
        </div>
      )}
      <audio ref={ref} src={selected} className="hidden" />
      {selected && (
        <Touchscreen src={selected} audioRef={ref} color={deckColors[color]} />
      )}
      <div className="h-2 bg-gray-700/50 rounded mt-2">
        <div
          className="h-2"
          style={{ width: `${(progress * 100).toFixed(1)}%`, backgroundColor: deckColors[color] }}
        ></div>
      </div>
      <div
        className={`jogwheel mx-auto my-4 ${isPlaying ? 'playing' : ''}`}
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onMouseMove={onMouseMove}
        style={{
          ...(isPlaying ? {} : { transform: `rotate(${rotation}deg)` }),
          boxShadow: `0 0 10px ${deckColors[color]}`,
        }}
      >
        <div className="marker" />
      </div>
      <div className="mt-2 space-x-2">
        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => loadTrack(file)}
            className="text-xs px-2 py-1 rounded bg-gray-700/50 backdrop-blur hover:bg-gray-600/70 transition"
          >
            {file.name}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-center space-x-4">
        <button
          onClick={play}
          className="play-button-modern"
          style={{ backgroundColor: deckColors[color] }}
        >
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button onClick={pause} className="play-button-modern bg-gray-600">
          <FontAwesomeIcon icon={faPause} />
        </button>
      </div>
    </div>
  );
};

export default CDJ3000;
