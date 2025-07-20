import React, { useRef, useState } from 'react';

interface Props {
  files: File[];
  name: string;
}

/**
 * Basic representation of the Technics SL‑1200G turntable based on
 * the operating instructions. Only simplified controls are provided.
 */
const SL1200: React.FC<Props> = ({ files, name }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selected, setSelected] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [pitchRange, setPitchRange] = useState(0.08); // ±8 % default
  const [pitch, setPitch] = useState(0);

  const loadTrack = (file: File) => {
    const url = URL.createObjectURL(file);
    setSelected(url);
    setIsRunning(false);
  };

  const startStop = () => {
    if (!audioRef.current) return;
    if (isRunning) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsRunning(!isRunning);
  };

  const toggleRange = () => {
    setPitchRange(pitchRange === 0.08 ? 0.16 : 0.08);
    setPitch(0);
    if (audioRef.current) audioRef.current.playbackRate = 1;
  };

  const resetPitch = () => {
    setPitch(0);
    if (audioRef.current) audioRef.current.playbackRate = 1;
  };

  const changePitch = (value: number) => {
    setPitch(value);
    if (audioRef.current) {
      audioRef.current.playbackRate = 1 + value;
    }
  };

  return (
    <div className="border p-2">
      <h2 className="font-semibold mb-2">{name} – Technics SL‑1200</h2>
      <audio ref={audioRef} src={selected} />
      <div className="mt-2 space-x-2">
        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => loadTrack(file)}
            className="border px-2 py-1"
          >
            {file.name}
          </button>
        ))}
      </div>
      <div className="mt-4 space-x-2">
        <button onClick={startStop} className="bg-green-500 text-white px-2 py-1">
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button onClick={resetPitch} className="border px-2 py-1">RESET</button>
        <button onClick={toggleRange} className="border px-2 py-1">
          Range {pitchRange === 0.08 ? '±8%' : '±16%'}
        </button>
      </div>
      <div className="mt-2">
        <input
          type="range"
          min={-pitchRange}
          max={pitchRange}
          step={0.01}
          value={pitch}
          onChange={(e) => changePitch(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SL1200;
