import React, { useState, useRef } from 'react';
import DeckWrapper from './components/Deck/DeckWrapper';
import Mixer from './components/Mixer';
import './style.css';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const leftRef = useRef<HTMLAudioElement>(null);
  const rightRef = useRef<HTMLAudioElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      localStorage.setItem('djFiles', JSON.stringify([...files, ...newFiles.map(f => f.name)]));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-2 font-mono">
      <h1 className="text-center text-xl font-bold mb-2">DJ Mix Console</h1>
      <input
        type="file"
        accept="audio/*"
        multiple
        onChange={onFileChange}
        className="mb-2 self-center text-sm file:rounded-full file:border-0 file:bg-cyan-600 file:px-3 file:py-1 file:text-white hover:file:bg-cyan-500"
      />
      <div className="flex flex-col md:flex-row flex-1 gap-4 mt-2 items-start">
        <DeckWrapper initialType="cdj" files={files} name="Left Deck" color="cyan" audioRef={leftRef} />
        <Mixer leftRef={leftRef} rightRef={rightRef} />
        <DeckWrapper initialType="cdj" files={files} name="Right Deck" color="rose" audioRef={rightRef} />
      </div>
    </div>
  );
};

export default App;
