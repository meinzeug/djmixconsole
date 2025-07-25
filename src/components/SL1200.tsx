import React, { useRef, useState } from 'react';
import { getAudioContext } from '../audio';

interface Props {
  files: File[];
  name: string;
  /**
   * Optional ref to expose the underlying audio element
   * for mixer volume control.
   */
  audioRef?: React.RefObject<HTMLAudioElement>;
}

/**
 * Basic representation of the Technics SL‑1200G turntable based on
 * the operating instructions. Only simplified controls are provided.
 */
const SL1200: React.FC<Props> = ({ files, name, audioRef }) => {
  const internalRef = useRef<HTMLAudioElement | null>(null);
  const ref = audioRef ?? internalRef;
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
    if (!ref.current) return;
    if (isRunning) {
      ref.current.pause();
    } else {
      const ctx = getAudioContext();
      ctx.resume();
      ref.current.play();
    }
    setIsRunning(!isRunning);
  };

  const toggleRange = () => {
    setPitchRange(pitchRange === 0.08 ? 0.16 : 0.08);
    setPitch(0);
    if (ref.current) ref.current.playbackRate = 1;
  };

  const resetPitch = () => {
    setPitch(0);
    if (ref.current) ref.current.playbackRate = 1;
  };

  const changePitch = (value: number) => {
    setPitch(value);
    if (ref.current) {
      ref.current.playbackRate = 1 + value;
    }
  };

  return (
    <div className="border p-2 bg-gray-800 rounded-lg text-white">
      <h2 className="font-semibold mb-2">{name} – Technics SL‑1200</h2>
      <audio ref={ref} src={selected} className="mb-2" />
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
      <div className="mt-4 space-x-2">
        <button onClick={startStop} className="play-button-modern bg-gray-600">
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button onClick={resetPitch} className="play-button-modern bg-gray-600">RESET</button>
        <button onClick={toggleRange} className="play-button-modern bg-gray-600 px-3">
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
