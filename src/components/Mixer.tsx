import React, { useEffect, useState } from 'react'
import Knob from './Knob'

interface Props {
  leftRef: React.RefObject<HTMLAudioElement>
  rightRef: React.RefObject<HTMLAudioElement>
}

const Mixer: React.FC<Props> = ({ leftRef, rightRef }) => {
  const [cross, setCross] = useState(0.5)
  const [leftVol, setLeftVol] = useState(1)
  const [rightVol, setRightVol] = useState(1)

  const [gainL, setGainL] = useState(0)
  const [gainR, setGainR] = useState(0)

  const [eqLHigh, setEqLHigh] = useState(0)
  const [eqLMid, setEqLMid] = useState(0)
  const [eqLLow, setEqLLow] = useState(0)

  const [eqRHigh, setEqRHigh] = useState(0)
  const [eqRMid, setEqRMid] = useState(0)
  const [eqRLow, setEqRLow] = useState(0)

  useEffect(() => {
    if (leftRef.current) leftRef.current.volume = leftVol * (1 - cross)
  }, [leftRef, leftVol, cross])

  useEffect(() => {
    if (rightRef.current) rightRef.current.volume = rightVol * cross
  }, [rightRef, rightVol, cross])

  return (
    <div className="border p-2 flex flex-col items-center">
      <h2 className="font-semibold mb-2">Mixer</h2>
      <div className="flex space-x-8">
        {/* Channel 1 */}
        <div className="flex flex-col items-center space-y-2">
          <Knob value={gainL} onChange={setGainL} />
          <Knob value={eqLHigh} onChange={setEqLHigh} />
          <Knob value={eqLMid} onChange={setEqLMid} />
          <Knob value={eqLLow} onChange={setEqLLow} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={leftVol}
            onChange={e => setLeftVol(parseFloat(e.target.value))}
            className="volume-fader"
          />
          <button className="cue-button">Cue</button>
        </div>

        <div className="flex flex-col justify-end w-32">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={cross}
            onChange={e => setCross(parseFloat(e.target.value))}
            className="crossfader"
          />
        </div>

        {/* Channel 2 */}
        <div className="flex flex-col items-center space-y-2">
          <Knob value={gainR} onChange={setGainR} />
          <Knob value={eqRHigh} onChange={setEqRHigh} />
          <Knob value={eqRMid} onChange={setEqRMid} />
          <Knob value={eqRLow} onChange={setEqRLow} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={rightVol}
            onChange={e => setRightVol(parseFloat(e.target.value))}
            className="volume-fader"
          />
          <button className="cue-button">Cue</button>
        </div>
      </div>
    </div>
  )
}

export default Mixer
