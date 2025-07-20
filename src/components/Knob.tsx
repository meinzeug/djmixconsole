import React, { useRef, useState } from 'react';

interface KnobProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: number;
}

const degRange = 270; // rotation range
const startAngle = -135; // starting offset

const Knob: React.FC<KnobProps> = ({ value, onChange, min = -12, max = 12, size = 60 }) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const valueToAngle = (v: number) => ((v - min) / (max - min)) * degRange + startAngle;
  const angleToValue = (a: number) => {
    let angle = a - startAngle;
    if (angle < 0) angle = 0;
    if (angle > degRange) angle = degRange;
    return (angle / degRange) * (max - min) + min;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging || !knobRef.current) return;
    const rect = knobRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    const val = angleToValue(angle);
    onChange(parseFloat(val.toFixed(2)));
  };

  const startDrag = () => {
    setDragging(true);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDrag);
  };

  const stopDrag = () => {
    setDragging(false);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', stopDrag);
  };

  return (
    <div
      ref={knobRef}
      onPointerDown={startDrag}
      style={{ width: size, height: size }}
      className="relative rounded-full bg-gray-700 flex items-center justify-center shadow-md cursor-pointer select-none"
    >
      <div
        className="absolute w-1 h-1/3 bg-gray-200"
        style={{ transform: `rotate(${valueToAngle(value)}deg) translateY(-50%)`, transformOrigin: '50% 100%' }}
      />
    </div>
  );
};

export default Knob;
