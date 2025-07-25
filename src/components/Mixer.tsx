import React, { useEffect, useRef, useState } from 'react'
import Knob from './Knob'
import { getAudioContext } from '../audio'

interface Props {
  leftRef: React.RefObject<HTMLAudioElement>
  rightRef: React.RefObject<HTMLAudioElement>
}

const Mixer: React.FC<Props> = ({ leftRef, rightRef }) => {
  const ctxRef = useRef<AudioContext | null>(null)
  const leftGain = useRef<GainNode | null>(null)
  const rightGain = useRef<GainNode | null>(null)
  const leftFilters = useRef<{ high: BiquadFilterNode; mid: BiquadFilterNode; low: BiquadFilterNode } | null>(null)
  const rightFilters = useRef<{ high: BiquadFilterNode; mid: BiquadFilterNode; low: BiquadFilterNode } | null>(null)

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

  // Initialize audio routing
  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return
    const ctx = getAudioContext()
    ctxRef.current = ctx

    const createChain = (el: HTMLAudioElement) => {
      const source = ctx.createMediaElementSource(el)
      const low = ctx.createBiquadFilter()
      low.type = 'lowshelf'
      low.frequency.value = 200
      const mid = ctx.createBiquadFilter()
      mid.type = 'peaking'
      mid.frequency.value = 1000
      const high = ctx.createBiquadFilter()
      high.type = 'highshelf'
      high.frequency.value = 8000
      const gain = ctx.createGain()
      source.connect(low).connect(mid).connect(high).connect(gain).connect(ctx.destination)
      return { gain, filters: { high, mid, low } }
    }

    const left = createChain(leftRef.current)
    const right = createChain(rightRef.current)
    leftGain.current = left.gain
    rightGain.current = right.gain
    leftFilters.current = left.filters
    rightFilters.current = right.filters

    return () => {
      left.gain.disconnect()
      right.gain.disconnect()
    }
  }, [leftRef, rightRef])

  // Apply volume and crossfader
  useEffect(() => {
    if (!leftGain.current || !rightGain.current) return
    leftGain.current.gain.value = (1 - cross) * leftVol * Math.pow(10, gainL / 20)
    rightGain.current.gain.value = cross * rightVol * Math.pow(10, gainR / 20)
  }, [cross, leftVol, rightVol, gainL, gainR])

  // Apply EQ changes
  useEffect(() => {
    if (!leftFilters.current) return
    leftFilters.current.high.gain.value = eqLHigh
    leftFilters.current.mid.gain.value = eqLMid
    leftFilters.current.low.gain.value = eqLLow
  }, [eqLHigh, eqLMid, eqLLow])

  useEffect(() => {
    if (!rightFilters.current) return
    rightFilters.current.high.gain.value = eqRHigh
    rightFilters.current.mid.gain.value = eqRMid
    rightFilters.current.low.gain.value = eqRLow
  }, [eqRHigh, eqRMid, eqRLow])

  return (
    <div className="glass-panel flex flex-col items-center">
      <h2 className="font-semibold mb-2 text-lg">Mixer</h2>
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
          <button className="cue-button bg-cyan-500 shadow-cyan-500/50">Cue</button>
        </div>

        <div className="flex flex-col justify-end w-32 mt-8">
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
          <button className="cue-button bg-rose-500 shadow-rose-500/50">Cue</button>
        </div>
      </div>
    </div>
  )
}

export default Mixer
