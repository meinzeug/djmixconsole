import React, { useEffect, useRef, useState } from 'react';

interface Props {
  files: File[];
  name: string;
  /**
   * Optional ref to expose the underlying audio element.
   * Allows the mixer component to control volume/crossfader.
   */
  audioRef?: React.RefObject<HTMLAudioElement>;
}

// Simple placeholder implementation of a Pioneer CDJ-3000 deck.
// Offers basic audio playback functionality for now.
const CDJ3000: React.FC<Props> = ({ files, name, audioRef }) => {
  const internalRef = useRef<HTMLAudioElement | null>(null);
  const ref = audioRef ?? internalRef;
  const [selected, setSelected] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [trackInfo, setTrackInfo] = useState<{title: string; duration: number; bpm?: number} | null>(null);

  const loadTrack = (file: File) => {
    const url = URL.createObjectURL(file);
    setSelected(url);
    setTrackInfo({ title: file.name, duration: 0 });
  };

  const play = () => {
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
    if (!selected || !canvasRef.current) return;
    const ctx = new AudioContext();
    fetch(selected)
      .then(r => r.arrayBuffer())
      .then(b => ctx.decodeAudioData(b))
      .then(drawWaveform);

    function drawWaveform(buffer: AudioBuffer) {
      const canvas = canvasRef.current!;
      const c = canvas.getContext('2d');
      if (!c) return;
      const data = buffer.getChannelData(0);
      const step = Math.ceil(data.length / canvas.width);
      c.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < canvas.width; i++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
          const val = data[i * step + j];
          if (val < min) min = val;
          if (val > max) max = val;
        }
        const y1 = ((1 + min) * canvas.height) / 2;
        const y2 = ((1 + max) * canvas.height) / 2;
        c.fillRect(i, y1, 1, y2 - y1);
      }
    }
    if (ref.current) {
      ref.current.onloadedmetadata = () => {
        setTrackInfo(info => info && { ...info, duration: ref.current!.duration });
      };
    }
  }, [selected]);

  return (
    <div className="border p-2 bg-gray-800 rounded-lg text-white">
      <h2 className="font-semibold mb-2">{name} – CDJ‑3000</h2>
      {trackInfo && (
        <div className="text-sm mb-1">
          {trackInfo.title} – {trackInfo.duration.toFixed(1)}s
        </div>
      )}
      <audio ref={ref} src={selected} controls className="w-full mb-2" />
      <canvas ref={canvasRef} width={300} height={60} className="w-full mb-2 bg-gray-900" />
      <div
        className="jogwheel mx-auto my-4"
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onMouseMove={onMouseMove}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="marker" />
      </div>
      <div className="mt-2 space-x-2">
        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => loadTrack(file)}
            className="border px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
          >
            {file.name}
          </button>
        ))}
      </div>
      <div className="mt-2 space-x-2">
        <button onClick={play} className="play-button">
          Play
        </button>
        <button onClick={pause} className="pause-button">
          Pause
        </button>
      </div>
    </div>
  );
};

export default CDJ3000;
