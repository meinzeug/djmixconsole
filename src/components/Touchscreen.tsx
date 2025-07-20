import React, { useEffect, useRef } from 'react';

interface Props {
  src: string;
  audioRef: React.RefObject<HTMLAudioElement>;
  color: string;
}

const Touchscreen: React.FC<Props> = ({ src, audioRef, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!src || !canvas) return;
    const ctx = new AudioContext();
    let raf: number;

    fetch(src)
      .then(r => r.arrayBuffer())
      .then(b => ctx.decodeAudioData(b))
      .then(buffer => {
        const c = canvas.getContext('2d');
        if (!c) return;
        const data = buffer.getChannelData(0);
        const step = Math.ceil(data.length / canvas.width);
        c.fillStyle = '#1f2937';
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = '#6b7280';
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
      });

    const drawProgress = () => {
      if (!canvas || !audioRef.current) return;
      const c = canvas.getContext('2d');
      if (!c) return;
      const progress =
        audioRef.current.duration > 0
          ? audioRef.current.currentTime / audioRef.current.duration
          : 0;
      c.fillStyle = `rgba(31,41,55,0.9)`; // gray-800
      c.fillRect(0, canvas.height - 4, canvas.width, 4);
      c.fillStyle = color;
      c.fillRect(0, canvas.height - 4, canvas.width * progress, 4);
      raf = requestAnimationFrame(drawProgress);
    };
    drawProgress();

    return () => cancelAnimationFrame(raf);
  }, [src, audioRef, color]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={80}
      className="w-full bg-gray-800/40 backdrop-blur border border-gray-700 rounded-md"
    />
  );
};

export default Touchscreen;
