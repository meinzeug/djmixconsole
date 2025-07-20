import React, { useEffect, useState } from 'react'

interface Props {
  leftRef: React.RefObject<HTMLAudioElement>
  rightRef: React.RefObject<HTMLAudioElement>
}

const Mixer: React.FC<Props> = ({ leftRef, rightRef }) => {
  const [cross, setCross] = useState(0.5)
  const [leftVol, setLeftVol] = useState(1)
  const [rightVol, setRightVol] = useState(1)

  useEffect(() => {
    if (leftRef.current) leftRef.current.volume = leftVol * (1 - cross)
  }, [leftRef, leftVol, cross])

  useEffect(() => {
    if (rightRef.current) rightRef.current.volume = rightVol * cross
  }, [rightRef, rightVol, cross])

  return (
    <div className="border p-2 flex flex-col items-center">
      <h2 className="font-semibold mb-2">Mixer</h2>
      <div className="flex items-end space-x-4">
        <div className="flex flex-col items-center">
          <label className="text-xs mb-1">Ch1</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={leftVol}
            onChange={e => setLeftVol(parseFloat(e.target.value))}
            className="h-32 rotate-[-90deg]"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-xs mb-1">Crossfader</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={cross}
            onChange={e => setCross(parseFloat(e.target.value))}
            className="w-32"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-xs mb-1">Ch2</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={rightVol}
            onChange={e => setRightVol(parseFloat(e.target.value))}
            className="h-32 rotate-[-90deg]"
          />
        </div>
      </div>
    </div>
  )
}

export default Mixer
