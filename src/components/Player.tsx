import React, { useRef, useState } from 'react';

interface Props {
  files: File[];
  name: string;
}

const Player: React.FC<Props> = ({ files, name }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selected, setSelected] = useState<string>('');

  const loadTrack = (file: File) => {
    const url = URL.createObjectURL(file);
    setSelected(url);
  };

  const play = () => {
    audioRef.current?.play();
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  return (
    <div className="border p-2">
      <h2 className="font-semibold mb-2">{name}</h2>
      <audio ref={audioRef} src={selected} controls className="w-full" />
      <div className="mt-2 space-x-2">
        {files.map(file => (
          <button key={file.name} onClick={() => loadTrack(file)} className="border px-2 py-1">
            {file.name}
          </button>
        ))}
      </div>
      <div className="mt-2 space-x-2">
        <button onClick={play} className="bg-green-500 text-white px-2 py-1">Play</button>
        <button onClick={pause} className="bg-red-500 text-white px-2 py-1">Pause</button>
      </div>
    </div>
  );
};

export default Player;
