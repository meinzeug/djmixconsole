import React from 'react';
import CDJ3000 from '../CDJ3000';
import SL1200 from '../SL1200';
import DeckSelect from '../DeckSelect';

export type DeckType = 'cdj' | 'sl1200';

interface DeckWrapperProps {
  initialType: DeckType;
  files: File[];
  name: string;
}

const DeckWrapper: React.FC<DeckWrapperProps> = ({ initialType, files, name }) => {
  const [type, setType] = React.useState<DeckType>(() => {
    const saved = localStorage.getItem(`${name}-deck-type`);
    return (saved as DeckType) || initialType;
  });

  React.useEffect(() => {
    localStorage.setItem(`${name}-deck-type`, type);
  }, [name, type]);

  return (
    <div>
      <DeckSelect value={type} onChange={setType} label={name} />
      {type === 'cdj' ? (
        <CDJ3000 files={files} name={name} />
      ) : (
        <SL1200 files={files} name={name} />
      )}
    </div>
  );
};

export default DeckWrapper;
