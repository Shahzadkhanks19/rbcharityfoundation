import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function CustomSelect({ value, onChange, options, placeholder = 'Select an option', disabled = false, dark = false }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const base = dark
    ? 'border-white/15 bg-white/10 text-white hover:bg-white/15'
    : 'border-rb-100 bg-white text-rb-900 hover:border-rb-300 hover:shadow-sm'

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left font-semibold outline-none transition duration-300 focus-visible:ring-4 focus-visible:ring-rb-100 disabled:cursor-not-allowed disabled:opacity-50 ${base} ${open ? dark ? 'border-gold/70 bg-white/15' : 'border-rb-400 ring-4 ring-rb-100' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? '' : dark ? 'text-white/55' : 'text-slate-400'}>{selected?.label || placeholder}</span>
        <ChevronDown size={18} className={`shrink-0 transition duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border shadow-2xl ${dark ? 'border-white/10 bg-rb-900 text-white' : 'border-rb-100 bg-white text-rb-900'}`} role="listbox">
          <div className="max-h-64 overflow-y-auto p-2">
            {options.map((option) => {
              const active = option.value === value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active ? dark ? 'bg-gold text-rb-900' : 'bg-rb-50 text-rb-900' : dark ? 'text-white/75 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-rb-50 hover:text-rb-900'}`}
                  role="option"
                  aria-selected={active}
                >
                  <span>{option.label}</span>
                  {active && <Check size={17} />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
