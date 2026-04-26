'use client'

import { useState } from 'react'
import Nav from '@/app/components/Nav'

interface Recipe {
  name: string
  time: string
  tags: string[]
  usesCount: number
  totalIngredients: number
  wasteSaved: string
  co2Saved: string
  steps: string[]
  missing: string[]
}

interface FridgeResult {
  expiring: string[]
  recipes: Recipe[]
}

const RECIPE_IMAGES = [
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=200&fit=crop',
]

const RECIPE_IMAGES_LARGE = [
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=520&fit=crop',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=520&fit=crop',
  'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&h=520&fit=crop',
]

const SUGGESTIONS = [
  {
    label: 'Eggs & Spinach',
    query: 'eggs, spinach, tomatoes',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=240&fit=crop',
  },
  {
    label: 'Avocado Rice Bowl',
    query: 'avocado, rice, lime',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=240&fit=crop',
  },
  {
    label: 'Garlic Pasta',
    query: 'pasta, garlic, olive oil',
    img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=240&fit=crop',
  },
  {
    label: 'Broccoli & Cheese',
    query: 'broccoli, cheese, potato',
    img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=240&fit=crop',
  },
]

export default function FridgePage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FridgeResult | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)

  async function handleFind(queryOverride?: string) {
    const q = queryOverride ?? input
    if (!q.trim()) return
    setLoading(true)
    setResult(null)
    setExpanded(null)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: q, mode: 'fridge' }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      // user can retry
    } finally {
      setLoading(false)
    }
  }

  function clear() {
    setInput('')
    setResult(null)
    setExpanded(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedRecipe = expanded !== null && result ? result.recipes[expanded] : null

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
            what&apos;s in your fridge?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 6, fontSize: 15 }}>
            we&apos;ll use the expiring stuff first
          </p>
        </div>
      </div>

      <div className="main-card">

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && e.metaKey && handleFind()}
          placeholder="e.g. eggs, spinach, old tomatoes, feta..."
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
          {loading ? 'finding recipes...' : 'find recipes'}
        </button>

        {!result && !loading && (
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#6B7B69', marginBottom: 10 }}>
              explore suggestions
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
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', margin: 0 }}>tap to explore</p>
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
            {selectedRecipe ? (
              <div>
                <button
                  onClick={() => setExpanded(null)}
                  style={{
                    background: 'none',
                    border: '1px solid #9aaa98',
                    borderRadius: 99,
                    cursor: 'pointer',
                    fontSize: 13,
                    color: '#9aaa98',
                    padding: '9px 16px',
                    minHeight: 44,
                    marginBottom: 14,
                  }}
                >
                  ← back to recipes
                </button>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={RECIPE_IMAGES_LARGE[expanded! % RECIPE_IMAGES_LARGE.length]}
                  alt={selectedRecipe.name}
                  style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: '16px 16px 0 0', display: 'block' }}
                />
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 16,
                    padding: 20,
                    marginTop: -24,
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                >
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A' }}>
                    {selectedRecipe.name}
                  </h2>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
                    <span style={{ backgroundColor: '#F0F2ED', color: '#6B7B69', fontSize: 11, padding: '4px 11px', borderRadius: 99 }}>
                      {selectedRecipe.time}
                    </span>
                    {selectedRecipe.tags?.map((tag, t) => (
                      <span key={t} style={{ backgroundColor: '#F0F2ED', color: '#6B7B69', fontSize: 11, padding: '4px 11px', borderRadius: 99 }}>
                        {tag}
                      </span>
                    ))}
                    <span style={{ backgroundColor: '#D4E84A', color: '#1A1A1A', fontSize: 11, fontWeight: 600, padding: '4px 11px', borderRadius: 99 }}>
                      saves {selectedRecipe.wasteSaved}
                    </span>
                  </div>

                  {selectedRecipe.missing?.length > 0 && (
                    <>
                      <div style={{ marginTop: 16 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 10 }}>
                          ingredients needed
                        </p>
                        {selectedRecipe.missing.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '9px 0',
                              borderBottom: i < selectedRecipe.missing.length - 1 ? '1px solid #E2E8DF' : 'none',
                              fontSize: 13,
                              color: '#1A1A1A',
                            }}
                          >
                            <span>{item}</span>
                            <span style={{ color: '#6B7B69', fontSize: 12 }}>to buy</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ height: 1, backgroundColor: '#E2E8DF', margin: '16px 0' }} />
                    </>
                  )}

                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 12 }}>steps</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {selectedRecipe.steps?.map((step, s) => (
                      <div key={s} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div
                          style={{
                            width: 26, height: 26, borderRadius: '50%',
                            backgroundColor: '#00C853',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, color: '#ffffff', flexShrink: 0,
                          }}
                        >
                          {s + 1}
                        </div>
                        <p style={{ fontSize: 13, lineHeight: 1.7, color: '#4A5A48', paddingTop: 3 }}>{step}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                      <span style={{ fontSize: 12, color: '#6B7B69' }}>waste saved</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#2D6A1F' }}>{selectedRecipe.wasteSaved}</span>
                    </div>
                    <div style={{ height: 5, backgroundColor: '#F0F2ED', borderRadius: 99, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(100, Math.round((selectedRecipe.usesCount / selectedRecipe.totalIngredients) * 100))}%`,
                          backgroundColor: '#00C853',
                          borderRadius: 99,
                        }}
                      />
                    </div>
                  </div>

                  {selectedRecipe.missing?.length > 0 && (
                    <a
                      href="https://bolt.eu/en-ee/market/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block', marginTop: 16, padding: '12px 20px',
                        border: '1.5px solid #2D6A1F', color: '#2D6A1F',
                        borderRadius: 99, fontSize: 14, fontWeight: 600,
                        textDecoration: 'none', textAlign: 'center', minHeight: 44,
                      }}
                    >
                      missing ingredients? Bolt Market
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <>
                {result.expiring?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
                    {result.expiring.map((item, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: '#FFF3E0', color: '#E65100',
                          fontSize: 12, padding: '5px 12px', borderRadius: 99, fontWeight: 500,
                        }}
                      >
                        {item} expiring
                      </span>
                    ))}
                  </div>
                )}

                <p style={{ fontSize: 13, fontWeight: 600, color: '#6B7B69', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                  recipes for you
                </p>

                <div className="recipe-grid">
                  {result.recipes?.map((recipe, i) => (
                    <div
                      key={i}
                      onClick={() => setExpanded(i)}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 16,
                        overflow: 'hidden',
                        border: '1px solid #E2E8DF',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        cursor: 'pointer',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={RECIPE_IMAGES[i % RECIPE_IMAGES.length]}
                        alt={recipe.name}
                        style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ padding: 14 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 }}>
                          {recipe.name}
                        </h3>
                        <p style={{ fontSize: 11, color: '#6B7B69', marginTop: 3 }}>
                          uses {recipe.usesCount} of {recipe.totalIngredients} ingredients
                        </p>
                        <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: '#F0F2ED', color: '#6B7B69', fontSize: 10, padding: '3px 10px', borderRadius: 99 }}>
                            {recipe.time}
                          </span>
                          <span style={{ backgroundColor: '#D4E84A', color: '#1A1A1A', fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 99 }}>
                            saves {recipe.wasteSaved}
                          </span>
                          {recipe.co2Saved && (
                            <span style={{ backgroundColor: '#E8F5E0', color: '#2D6A1F', fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 99 }}>
                              🌿 saves {recipe.co2Saved} CO₂
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                          <div
                            style={{
                              width: 36, height: 36, borderRadius: '50%',
                              backgroundColor: '#00C853',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#ffffff', fontSize: 16, flexShrink: 0,
                            }}
                          >
                            →
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 20 }}>
                  <button
                    onClick={clear}
                    style={{
                      padding: '11px 22px',
                      background: 'transparent',
                      color: '#9aaa98',
                      border: '1px solid #E2E8DF',
                      borderRadius: 99,
                      fontSize: 13,
                      cursor: 'pointer',
                      minHeight: 44,
                    }}
                  >
                    clear
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
