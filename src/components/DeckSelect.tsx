import React from 'react'
import { Listbox } from '@headlessui/react'

interface Props {
  value: 'cdj' | 'sl1200'
  onChange: (val: 'cdj' | 'sl1200') => void
  label: string
}

const options = [
  { id: 'cdj', label: 'CDJ‑3000' },
  { id: 'sl1200', label: 'SL‑1200' },
]

const DeckSelect: React.FC<Props> = ({ value, onChange, label }) => {
  return (
    <div className="mb-2 text-white">
      <Listbox value={value} onChange={onChange}>
        <Listbox.Label className="block text-sm font-medium mb-1">{label}</Listbox.Label>
        <div className="relative">
          <Listbox.Button className="w-full rounded px-2 py-1 text-left bg-gray-700/50 backdrop-blur">
            {options.find(o => o.id === value)?.label}
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full bg-gray-800/70 backdrop-blur text-white border rounded shadow-md z-10">
            {options.map(option => (
              <Listbox.Option
                key={option.id}
                value={option.id as 'cdj' | 'sl1200'}
                className={({ active }) =>
                  `cursor-pointer px-2 py-1 ${active ? 'bg-blue-500 text-white' : ''}`
                }
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  )
}

export default DeckSelect
