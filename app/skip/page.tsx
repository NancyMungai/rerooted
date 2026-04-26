'use client'

import { useState } from 'react'
import Nav from '@/app/components/Nav'

interface SkipResult {
  restaurant: string
  distance: string
  match: string
  sustainability: string
  boltFood: boolean
}

const SUGGESTIONS = [
  {
    label: 'Pasta & Tomato Sauce',
    query: 'pasta with tomato sauce',
    img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=240&fit=crop',
  },
  {
    label: 'Shakshuka',
    query: 'shakshuka',
    img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=240&fit=crop',
  },
  {
    label: 'Stir Fry Noodles',
    query: 'stir fry with noodles',
    img: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=240&fit=crop',
  },
  {
    label: 'Grain Bowl',
    query: 'grain bowl',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=240&fit=crop',
  },
]

export default function SkipPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SkipResult | null>(null)

  async function handleFind(queryOverride?: string) {
    const q = queryOverride ?? input
    if (!q.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: q, mode: 'tired' }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      // user can retry
    } finally {
      setLoading(false)
    }
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
            support local tonight.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 6, fontSize: 15 }}>
            skip the supermarket. eat somewhere good.
          </p>
        </div>
      </div>

      <div className="main-card">

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && e.metaKey && handleFind()}
          placeholder="what were you going to make?"
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
          onClick={() => handleFind()}
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
          {loading ? 'finding restaurants...' : 'find local restaurants'}
        </button>

        {!result && !loading && (
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#6B7B69', marginBottom: 10 }}>
              what are you craving?
            </p>
            <div className="suggestion-grid">
              {SUGGESTIONS.map(s => (
                <div
                  key={s.label}
                  onClick={() => { setInput(s.query); handleFind(s.query) }}
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
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', margin: 0 }}>find a local spot</p>
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
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 700,
              color: '#2D6A1F',
              lineHeight: 1.1,
              marginBottom: 18,
            }}>
              support local tonight.
            </p>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid #E2E8DF',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop"
                alt="Local restaurant"
                style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
              />

              <div style={{ padding: 14 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>
                  {result.restaurant}
                </h3>
                <p style={{ fontSize: 12, color: '#6B7B69', marginTop: 4 }}>
                  {result.distance} · {result.match}
                </p>

                <div style={{ display: 'flex', gap: 7, marginTop: 10, flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: '#F0F2ED', color: '#6B7B69', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 99 }}>
                    local
                  </span>
                  <span style={{ backgroundColor: '#F0F2ED', color: '#6B7B69', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 99 }}>
                    low packaging
                  </span>
                </div>

                <div style={{ marginTop: 12, backgroundColor: '#F0F7EE', borderRadius: 12, padding: 12 }}>
                  <p style={{ fontSize: 12, color: '#2D6A1F', lineHeight: 1.6 }}>
                    {result.sustainability}
                  </p>
                </div>

                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a
                    href="https://www.google.com/maps/search/local+restaurants+near+me"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block', padding: '13px 24px',
                      backgroundColor: '#D4E84A', color: '#1A1A1A',
                      borderRadius: 99, fontSize: 14, fontWeight: 700,
                      textDecoration: 'none', textAlign: 'center', minHeight: 44,
                    }}
                  >
                    find local restaurants
                  </a>
                  <a
                    href="https://bolt.eu/en-ee/market/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block', padding: '13px 24px',
                      border: '1.5px solid #2D6A1F', color: '#2D6A1F',
                      borderRadius: 99, fontSize: 14, fontWeight: 600,
                      textDecoration: 'none', textAlign: 'center', minHeight: 44,
                    }}
                  >
                    Bolt Market
                  </a>
                </div>
              </div>
            </div>

            <p style={{ marginTop: 12, fontSize: 11, color: '#9aaa98', textAlign: 'center', lineHeight: 1.5 }}>
              Restaurant suggestions are AI-generated. Always check opening hours and reviews before visiting.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
