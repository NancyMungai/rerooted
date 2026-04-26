'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/app/components/Nav'

interface ShoppingResult {
  items: string[]
  wasteSaved: string
  tip: string
}

const SUGGESTIONS = [
  {
    label: 'Shakshuka & Pasta',
    query: 'shakshuka and pasta',
    img: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=240&fit=crop',
  },
  {
    label: 'Salads for the Week',
    query: 'salads for the week',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=240&fit=crop',
  },
  {
    label: 'Curry & Rice',
    query: 'curry and rice',
    img: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=240&fit=crop',
  },
  {
    label: 'Wraps & Bowls',
    query: 'wraps and bowls',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=240&fit=crop',
  },
]

export default function ShoppingPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ShoppingResult | null>(null)
  const [checked, setChecked] = useState<Set<number>>(new Set())

  async function handleBuild(queryOverride?: string) {
    const q = queryOverride ?? input
    if (!q.trim()) return
    setLoading(true)
    setResult(null)
    setChecked(new Set())
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: q, mode: 'shopping' }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      // user can retry
    } finally {
      setLoading(false)
    }
  }

  function toggleCheck(i: number) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7F2' }}>
      <Nav />
      <div
        className="hero-section"
        style={{
          background: "linear-gradient(rgba(20,50,15,0.6), rgba(20,50,15,0.6)), url('/hero.jpg') center/cover no-repeat",
          padding: '0 0 72px',
        }}
      >
        <div className="hero-content">
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
            plan your week.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 6, fontSize: 15 }}>
            build a smart shopping list
          </p>
        </div>
      </div>

      <div className="main-card">

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && e.metaKey && handleBuild()}
          placeholder="e.g. pasta bake, stir fry, a big salad..."
          rows={3}
          className="page-textarea"
          style={{
            width: '100%',
            backgroundColor: '#F0F2ED',
            border: '1px solid #E2E8DF',
            borderRadius: 14,
            padding: 16,
            color: '#1A1A1A',
            fontSize: 14,
            lineHeight: 1.5,
            resize: 'vertical',
            minHeight: 80,
            outline: 'none',
          }}
        />
        <button
          onClick={() => handleBuild()}
          disabled={loading || !input.trim()}
          style={{
            display: 'block',
            width: '100%',
            padding: '13px 24px',
            backgroundColor: '#D4E84A',
            color: '#1A1A1A',
            border: 'none',
            borderRadius: 99,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            opacity: loading ? 0.75 : 1,
            marginTop: 10,
            minHeight: 44,
          }}
        >
          {loading ? 'building list...' : 'build my list'}
        </button>

        {!result && !loading && (
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#6B7B69', marginBottom: 10 }}>
              explore meal ideas
            </p>
            <div className="suggestion-grid">
              {SUGGESTIONS.map(s => (
                <div
                  key={s.label}
                  onClick={() => { setInput(s.query); handleBuild(s.query) }}
                  style={{
                    position: 'relative',
                    borderRadius: 14,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: 120,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.img}
                    alt={s.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,0,0,0.52)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                    padding: '8px 10px',
                  }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#ffffff', margin: 0 }}>{s.label}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', margin: 0 }}>tap to build list</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            {[0, 1].map(i => (
              <div key={i} style={{ backgroundColor: '#F0F2ED', borderRadius: 16, overflow: 'hidden' }}>
                <div className="skeleton-pulse" style={{ height: 140, backgroundColor: '#E2E8DF' }} />
                <div style={{ padding: '10px 12px' }}>
                  <div className="skeleton-pulse" style={{ height: 11, backgroundColor: '#E2E8DF', borderRadius: 6, marginBottom: 7 }} />
                  <div className="skeleton-pulse" style={{ height: 11, backgroundColor: '#E2E8DF', borderRadius: 6, width: '55%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {result && !loading && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#2D6A1F', marginBottom: 14 }}>
              shopping list.
            </p>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, border: '1px solid #E2E8DF' }}>
              {result.items?.map((item, i) => (
                <label
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '9px 0',
                    borderBottom: i < result.items.length - 1 ? '1px solid #E2E8DF' : 'none',
                    cursor: 'pointer',
                    minHeight: 44,
                  }}
                >
                  <div
                    onClick={() => toggleCheck(i)}
                    style={{
                      width: 20, height: 20, borderRadius: '50%',
                      border: checked.has(i) ? 'none' : '1.5px solid #00C853',
                      backgroundColor: checked.has(i) ? '#00C853' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
                    }}
                  >
                    {checked.has(i) && (
                      <span style={{ color: '#ffffff', fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      color: checked.has(i) ? '#9aaa98' : '#1A1A1A',
                      textDecoration: checked.has(i) ? 'line-through' : 'none',
                      flex: 1, transition: 'color 0.15s',
                    }}
                  >
                    {item}
                  </span>
                </label>
              ))}
            </div>

            {(result.tip || result.wasteSaved) && (
              <div style={{ marginTop: 12, backgroundColor: '#F0F7EE', borderRadius: 12, padding: 12 }}>
                {result.tip && (
                  <p style={{ fontSize: 12, color: '#2D6A1F', lineHeight: 1.6 }}>{result.tip}</p>
                )}
                {result.wasteSaved && (
                  <p style={{ fontSize: 12, color: '#2D6A1F', marginTop: result.tip ? 6 : 0, fontWeight: 500 }}>
                    potential waste saved: {result.wasteSaved}
                  </p>
                )}
              </div>
            )}

            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a
                href="https://bolt.eu/en-ee/market/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', padding: '13px 24px',
                  backgroundColor: '#D4E84A', color: '#1A1A1A',
                  borderRadius: 99, fontSize: 14, fontWeight: 700,
                  textDecoration: 'none', textAlign: 'center', minHeight: 44,
                }}
              >
                order on Bolt Market
              </a>
              <Link
                href="/skip"
                style={{
                  display: 'block', padding: '13px 24px',
                  border: '1.5px solid #2D6A1F', color: '#2D6A1F',
                  borderRadius: 99, fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', textAlign: 'center', minHeight: 44,
                }}
              >
                skip cooking tonight
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
