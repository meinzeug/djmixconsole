import React, { useState } from 'react';
import DeckWrapper from './components/Deck/DeckWrapper';
import './style.css';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      localStorage.setItem('djFiles', JSON.stringify([...files, ...newFiles.map(f => f.name)]));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">DJ Mix Console</h1>
      <input type="file" accept="audio/*" multiple onChange={onFileChange} />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <DeckWrapper initialType="cdj" files={files} name="Left Deck" />
        <DeckWrapper initialType="cdj" files={files} name="Right Deck" />
      </div>
    </div>
  );
};

export default App;
