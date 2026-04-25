"use client";
import { useState, useEffect } from "react";

type Recipe = {
  name: string;
  time: string;
  tags: string[];
  usesCount: number;
  totalIngredients: number;
  wasteSaved: string;
  co2Saved: string;
  steps: string[];
  missing: string[];
};

type FridgeResult = {
  expiring: string[];
  recipes: Recipe[];
};

type ShoppingResult = {
  items: string[];
  wasteSaved: string;
  tip: string;
};

type TiredResult = {
  restaurant: string;
  distance: string;
  match: string;
  sustainability: string;
  boltFood: boolean;
};

type Mode = "fridge" | "shopping" | "tired";

const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=56&h=56&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=56&h=56&fit=crop",
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=56&h=56&fit=crop",
];
const LOADING_MESSAGES = ["scanning your fridge...", "finding recipes...", "calculating waste saved..."];

export default function Home() {
  const [mode, setMode] = useState<Mode>("fridge");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fridgeResult, setFridgeResult] = useState<FridgeResult | null>(null);
  const [shoppingResult, setShoppingResult] = useState<ShoppingResult | null>(null);
  const [tiredResult, setTiredResult] = useState<TiredResult | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  useEffect(() => {
    if (!loading) return;
    setLoadingMsgIdx(0);
    const interval = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);

  const reset = () => {
    setFridgeResult(null);
    setShoppingResult(null);
    setTiredResult(null);
    setSelectedRecipe(null);
    setInput("");
    setChecked([]);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    reset();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: input, mode }),
      });
      const data = await res.json();
      if (mode === "fridge") setFridgeResult(data);
      if (mode === "shopping") setShoppingResult(data);
      if (mode === "tired") setTiredResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toggleCheck = (item: string) => {
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const placeholders = {
    fridge: "e.g. eggs, spinach, old tomatoes, feta, olive oil...",
    shopping: "e.g. I want to make shakshuka and pasta this week...",
    tired: "e.g. I was going to make pasta with tomatoes and spinach...",
  };

  const modeLabels = {
    fridge: "my fridge",
    shopping: "shopping list",
    tired: "skip cooking tonight",
  };

  const hasResult = fridgeResult || shoppingResult || tiredResult || selectedRecipe || loading;

  return (
    <main style={{ backgroundColor: "var(--green-dark)", minHeight: "100vh" }}>

      {/* HERO — full width */}
      <div style={{
        background: "linear-gradient(to bottom, rgba(20,40,22,0.45) 0%, var(--green-dark) 100%), url('/hero.jpg') center/cover no-repeat",
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 0 40px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "0 32px", textAlign: "center" }}>
          <div style={{
            fontSize: "clamp(56px, 10vw, 112px)",
            fontWeight: 700,
            color: "var(--yellow)",
            fontFamily: "Georgia, serif",
            letterSpacing: -2,
            lineHeight: 1,
          }}>
            ReRooted.
          </div>
          <div style={{ fontSize: 16, color: "var(--soft)", marginTop: 8, letterSpacing: "0.02em" }}>
            cook smart. waste less.
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 32px 80px" }}>

        {/* MODE TABS */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          {(["fridge", "shopping", "tired"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); reset(); }}
              style={{
                padding: "8px 20px",
                borderRadius: 99,
                border: "1.5px solid var(--yellow)",
                background: mode === m ? "var(--yellow)" : "transparent",
                color: mode === m ? "var(--green-dark)" : "var(--yellow)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>

        {/* TWO COLUMN LAYOUT ON DESKTOP */}
        <div style={{
          display: "grid",
          gridTemplateColumns: hasResult ? "1fr 1fr" : "1fr",
          gap: 40,
          alignItems: "start",
        }}>

          {/* LEFT — INPUT (always visible) */}
          <div>
            {!selectedRecipe && (
              <>
                <div style={{ fontSize: 15, color: "var(--soft)", marginBottom: 12 }}>
                  {mode === "fridge" && "what ingredients do you have?"}
                  {mode === "shopping" && "what do you want to cook this week?"}
                  {mode === "tired" && "what were you going to make?"}
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholders[mode]}
                  rows={5}
                  style={{
                    width: "100%",
                    background: "var(--green-deeper)",
                    border: "none",
                    borderRadius: 16,
                    padding: "16px 18px",
                    color: "var(--cream)",
                    fontSize: 14,
                    resize: "none",
                    fontFamily: "sans-serif",
                    lineHeight: 1.6,
                  }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    marginTop: 14,
                    width: "100%",
                    background: loading ? "var(--muted)" : "var(--yellow)",
                    color: "var(--green-dark)",
                    border: "none",
                    borderRadius: 99,
                    padding: "15px",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    letterSpacing: "0.02em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {loading ? (
                    <>
                      <span className="pulse-dot">●</span>
                      <span>{LOADING_MESSAGES[loadingMsgIdx]}</span>
                    </>
                  ) : mode === "fridge" ? "find recipes" : mode === "shopping" ? "build my list" : "find alternatives"}
                </button>
                <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 16 }}>
                  reduce food waste · save money · eat better
                </div>
              </>
            )}

            {/* RECIPE DETAIL on left when selected */}
            {selectedRecipe && (
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, color: "var(--cream)", marginBottom: 8, fontFamily: "Georgia, serif" }}>
                  {selectedRecipe.name}
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                  {[selectedRecipe.time, ...(selectedRecipe.tags || [])].map((tag) => (
                    <span key={tag} style={{
                      background: "#2d5a1b", color: "var(--yellow)",
                      fontSize: 11, padding: "4px 12px", borderRadius: 99, fontWeight: 500,
                    }}>{tag}</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>steps</div>
                {selectedRecipe.steps?.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: "var(--yellow)", color: "var(--green-dark)",
                      fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1,
                    }}>{i + 1}</div>
                    <div style={{ fontSize: 14, color: "var(--soft)", lineHeight: 1.7 }}>{step}</div>
                  </div>
                ))}
                <div style={{ background: "var(--green-deeper)", borderRadius: 14, padding: "14px 16px", margin: "20px 0" }}>
                  <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>waste saved</div>
                  <div style={{ height: 7, borderRadius: 4, background: "var(--yellow)", width: "72%", marginBottom: 8 }} />
                  <div style={{ fontSize: 13, color: "var(--yellow)", fontWeight: 500 }}>
                    {selectedRecipe.wasteSaved} · {selectedRecipe.co2Saved} CO₂ saved
                  </div>
                </div>
                {selectedRecipe.missing?.length > 0 && (
                  <a href="https://bolt.eu/en-ee/market/" target="_blank" rel="noopener noreferrer" style={{
                    display: "block", width: "100%", background: "transparent",
                    color: "var(--yellow)", border: "1.5px solid var(--yellow)",
                    borderRadius: 99, padding: "13px", fontSize: 13,
                    fontWeight: 600, cursor: "pointer", marginBottom: 10,
                    textAlign: "center", textDecoration: "none",
                  }}>
                    missing {selectedRecipe.missing.slice(0, 2).join(", ")}? Bolt Market →
                  </a>
                )}
                <button onClick={() => setSelectedRecipe(null)} style={{
                  width: "100%", background: "transparent",
                  color: "var(--muted)", border: "1.5px solid var(--muted)",
                  borderRadius: 99, padding: "12px", fontSize: 13, cursor: "pointer",
                }}>← back to recipes</button>
              </div>
            )}
          </div>

          {/* RIGHT — RESULTS */}
          <div>

            {/* SKELETON LOADER */}
            {loading && (
              <div>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    background: "var(--green-deeper)", borderRadius: 16,
                    padding: "14px 16px", marginBottom: 12,
                    display: "flex", gap: 14, alignItems: "center",
                  }}>
                    <div className="skeleton-block" style={{
                      width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                      animationDelay: `${i * 0.18}s`,
                    }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
                      <div className="skeleton-block" style={{
                        height: 15, borderRadius: 6, width: "60%",
                        animationDelay: `${i * 0.18 + 0.08}s`,
                      }} />
                      <div className="skeleton-block" style={{
                        height: 11, borderRadius: 6, width: "40%",
                        animationDelay: `${i * 0.18 + 0.16}s`,
                      }} />
                      <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                        <div className="skeleton-block" style={{
                          height: 20, borderRadius: 99, width: 58,
                          animationDelay: `${i * 0.18 + 0.24}s`,
                        }} />
                        <div className="skeleton-block" style={{
                          height: 20, borderRadius: 99, width: 82,
                          animationDelay: `${i * 0.18 + 0.32}s`,
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FRIDGE RESULTS */}
            {fridgeResult && !selectedRecipe && (
              <div>
                {fridgeResult.expiring?.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                      use these first
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {fridgeResult.expiring.map((item) => (
                        <span key={item} style={{
                          background: "#3d2e00", color: "var(--amber)",
                          fontSize: 12, padding: "5px 12px", borderRadius: 99, fontWeight: 500,
                        }}>{item} expiring</span>
                      ))}
                    </div>
                  </div>
                )}
                {fridgeResult.recipes?.map((recipe, index) => (
                  <div key={recipe.name} onClick={() => setSelectedRecipe(recipe)} style={{
                    background: "var(--green-deeper)", borderRadius: 16,
                    padding: "14px 16px", marginBottom: 12, cursor: "pointer",
                    display: "flex", gap: 14, alignItems: "center",
                    transition: "opacity 0.15s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    <img
                      src={CARD_IMAGES[index % CARD_IMAGES.length]}
                      alt=""
                      style={{
                        width: 56, height: 56, borderRadius: 12,
                        objectFit: "cover", flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--cream)", marginBottom: 3 }}>{recipe.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>uses {recipe.usesCount} of your {recipe.totalIngredients} ingredients</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                        <span style={{ background: "#2d5a1b", color: "var(--yellow)", fontSize: 10, padding: "3px 10px", borderRadius: 99, fontWeight: 500 }}>{recipe.time}</span>
                        <span style={{ background: "#2d5a1b", color: "var(--yellow)", fontSize: 10, padding: "3px 10px", borderRadius: 99, fontWeight: 500 }}>saves {recipe.wasteSaved} waste</span>
                      </div>
                    </div>
                    <div style={{ color: "var(--yellow)", fontSize: 20 }}>→</div>
                  </div>
                ))}
                <button onClick={reset} style={{
                  marginTop: 6, width: "100%", background: "transparent",
                  color: "var(--muted)", border: "1.5px solid var(--muted)",
                  borderRadius: 99, padding: "12px", fontSize: 13, cursor: "pointer",
                }}>← start over</button>
              </div>
            )}

            {/* SHOPPING RESULT */}
            {shoppingResult && (
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--yellow)", marginBottom: 16, fontFamily: "Georgia, serif" }}>shopping list.</div>
                <div style={{ background: "var(--green-deeper)", borderRadius: 16, padding: "12px 16px", marginBottom: 14 }}>
                  {shoppingResult.items?.map((item) => (
                    <div key={item} onClick={() => toggleCheck(item)} style={{
                      display: "flex", gap: 12, alignItems: "center",
                      padding: "10px 0", borderBottom: "1px solid var(--green-mid)", cursor: "pointer",
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        border: "1.5px solid var(--yellow)",
                        background: checked.includes(item) ? "var(--yellow)" : "transparent",
                        flexShrink: 0,
                      }} />
                      <div style={{
                        fontSize: 14, color: "var(--soft)",
                        textDecoration: checked.includes(item) ? "line-through" : "none",
                      }}>{item}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "var(--green-deeper)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: "var(--yellow)", fontWeight: 500, marginBottom: 4 }}>
                    buying only what you need saves ~{shoppingResult.wasteSaved} food waste
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{shoppingResult.tip}</div>
                </div>
                <a href="https://bolt.eu/en-ee/market/" target="_blank" rel="noopener noreferrer" style={{
                  display: "block", width: "100%", background: "var(--yellow)",
                  color: "var(--green-dark)", border: "none",
                  borderRadius: 99, padding: "14px", fontSize: 14,
                  fontWeight: 700, cursor: "pointer", marginBottom: 10,
                  textAlign: "center", textDecoration: "none",
                }}>order on Bolt Market →</a>
                <a href="https://food.bolt.eu" target="_blank" rel="noopener noreferrer" style={{
                  display: "block", width: "100%", background: "transparent",
                  color: "var(--bolt-blue)", border: "1.5px solid var(--bolt-blue)",
                  borderRadius: 99, padding: "13px", fontSize: 13,
                  fontWeight: 600, textAlign: "center", textDecoration: "none", marginBottom: 10,
                }}>skip cooking? Bolt Food →</a>
                <button onClick={reset} style={{
                  width: "100%", background: "transparent",
                  color: "var(--muted)", border: "1.5px solid var(--muted)",
                  borderRadius: 99, padding: "12px", fontSize: 13, cursor: "pointer",
                }}>← start over</button>
              </div>
            )}

            {/* SKIP COOKING RESULT */}
            {tiredResult && (
              <div>
                <div style={{
                  fontSize: "clamp(28px, 5vw, 52px)",
                  fontWeight: 700,
                  fontFamily: "Georgia, serif",
                  color: "var(--yellow)",
                  lineHeight: 1.15,
                  marginBottom: 6,
                  letterSpacing: -1,
                }}>
                  support local tonight.
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
                  skip the supermarket. eat somewhere good.
                </div>

                <div style={{
                  background: "var(--green-deeper)", borderRadius: 16,
                  padding: "16px", display: "flex", gap: 14,
                  alignItems: "center", marginBottom: 14,
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=56&h=56&fit=crop"
                    alt=""
                    style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--cream)" }}>{tiredResult.restaurant}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{tiredResult.distance} · {tiredResult.match}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      <span style={{ background: "#2d5a1b", color: "var(--yellow)", fontSize: 10, padding: "3px 10px", borderRadius: 99 }}>local</span>
                      <span style={{ background: "#2d5a1b", color: "var(--yellow)", fontSize: 10, padding: "3px 10px", borderRadius: 99 }}>low packaging</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: "var(--green-deeper)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: "var(--yellow)", lineHeight: 1.6 }}>{tiredResult.sustainability}</div>
                </div>

                <a href="https://www.google.com/maps/search/local+restaurants+near+me" target="_blank" rel="noopener noreferrer" style={{
                  display: "block", width: "100%", background: "var(--yellow)",
                  color: "var(--green-dark)", border: "none", borderRadius: 99, padding: "15px",
                  fontSize: 15, fontWeight: 700, textAlign: "center",
                  textDecoration: "none", marginBottom: 10,
                }}>find local restaurants →</a>

                <a href="https://bolt.eu/en-ee/market/" target="_blank" rel="noopener noreferrer" style={{
                  display: "block", width: "100%", background: "transparent",
                  color: "var(--yellow)", border: "2px solid var(--yellow)", borderRadius: 99, padding: "14px",
                  fontSize: 14, fontWeight: 700, textAlign: "center",
                  textDecoration: "none", marginBottom: 12,
                }}>Bolt Market →</a>

                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 14, lineHeight: 1.5 }}>
                  * suggestions are illustrative — use the map link to find what&apos;s actually near you
                </div>

                <button onClick={reset} style={{
                  width: "100%", background: "transparent",
                  color: "var(--muted)", border: "1.5px solid var(--muted)",
                  borderRadius: 99, padding: "12px", fontSize: 13, cursor: "pointer",
                }}>← back</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
