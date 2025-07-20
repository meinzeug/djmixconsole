import React, { useState } from 'react';
import CDJ3000 from './components/CDJ3000';
import SL1200 from './components/SL1200';
import DeckSelect from './components/DeckSelect';
import './style.css';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [leftType, setLeftType] = useState<'cdj' | 'sl1200'>('cdj');
  const [rightType, setRightType] = useState<'cdj' | 'sl1200'>('cdj');

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
        <div>
          <DeckSelect
            value={leftType}
            onChange={(val) => setLeftType(val)}
            label="Left Deck"
          />
          {leftType === 'cdj' ? (
            <CDJ3000 files={files} name="Left Deck" />
          ) : (
            <SL1200 files={files} name="Left Deck" />
          )}
        </div>
        <div>
          <DeckSelect
            value={rightType}
            onChange={(val) => setRightType(val)}
            label="Right Deck"
          />
          {rightType === 'cdj' ? (
            <CDJ3000 files={files} name="Right Deck" />
          ) : (
            <SL1200 files={files} name="Right Deck" />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
