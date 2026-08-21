import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function CustomSelect({ value, onChange, options, placeholder = 'Select an option', disabled = false, dark = false }) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState(null)
  const rootRef = useRef(null)
  const menuRef = useRef(null)
  const selected = options.find((option) => option.value === value)

  const updatePosition = () => {
    const root = rootRef.current
    if (!root) return

    const rect = root.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const estimatedMenuHeight = Math.min(272, options.length * 52 + 16)
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top
    const openUpward = spaceBelow < estimatedMenuHeight + 12 && spaceAbove > spaceBelow
    const availableHeight = Math.max(120, (openUpward ? spaceAbove : spaceBelow) - 16)

    setMenuStyle({
      position: 'fixed',
      left: Math.max(8, rect.left),
      width: Math.min(rect.width, window.innerWidth - 16),
      top: openUpward ? 'auto' : rect.bottom + 8,
      bottom: openUpward ? viewportHeight - rect.top + 8 : 'auto',
      maxHeight: Math.min(256, availableHeight),
      zIndex: 9999,
    })
  }

  useLayoutEffect(() => {
    if (!open) return undefined
    updatePosition()

    const handleViewportChange = () => updatePosition()
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)
    return () => {
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [open, options.length])

  useEffect(() => {
    const close = (event) => {
      const clickedTrigger = rootRef.current?.contains(event.target)
      const clickedMenu = menuRef.current?.contains(event.target)
      if (!clickedTrigger && !clickedMenu) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open])

  const base = dark
    ? 'border-white/15 bg-white/10 text-white hover:bg-white/15'
    : 'border-rb-100 bg-white text-rb-900 hover:border-rb-300 hover:shadow-sm'

  const menu = open && menuStyle && typeof document !== 'undefined'
    ? createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className={`overflow-hidden rounded-2xl border shadow-2xl ${dark ? 'border-white/10 bg-rb-900 text-white' : 'border-rb-100 bg-white text-rb-900'}`}
          role="listbox"
        >
          <div className="h-full max-h-64 overflow-y-auto p-2">
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
                  <span className="min-w-0 break-words">{option.label}</span>
                  {active && <Check size={17} className="shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>,
        document.body,
      )
    : null

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`flex min-h-12 w-full min-w-0 items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left font-semibold outline-none transition duration-300 focus-visible:ring-4 focus-visible:ring-rb-100 disabled:cursor-not-allowed disabled:opacity-50 ${base} ${open ? dark ? 'border-gold/70 bg-white/15' : 'border-rb-400 ring-4 ring-rb-100' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`min-w-0 truncate ${selected ? '' : dark ? 'text-white/55' : 'text-slate-400'}`}>{selected?.label || placeholder}</span>
        <ChevronDown size={18} className={`shrink-0 transition duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {menu}
    </div>
  )
}
