import React, { useState } from 'react';
import Player from './components/Player';
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
      <h1 className="text-xl font-bold mb-4">DJ Mix Console (Prototype)</h1>
      <input type="file" accept="audio/*" multiple onChange={onFileChange} />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Player files={files} name="Player 1" />
        <Player files={files} name="Player 2" />
      </div>
    </div>
  );
};

export default App;
