import Link from 'next/link'

export default function LandingPage() {
  return (
    <main
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(24px, 5vw, 48px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/landing.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(30,70,15,0.50)',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          maxWidth: 800,
          width: '100%',
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 'clamp(64px, 12vw, 112px)',
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          ReRooted.
        </span>

        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 'clamp(14px, 2vw, 18px)',
            letterSpacing: '0.04em',
          }}
        >
          reduce food waste · support local · eat better
        </p>

        <Link
          href="/fridge"
          style={{
            display: 'inline-block',
            backgroundColor: '#ffffff',
            color: '#3A7D1E',
            padding: '16px 40px',
            borderRadius: 99,
            fontWeight: 700,
            fontSize: 16,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            marginTop: 8,
          }}
        >
          get started
        </Link>
      </div>
    </main>
  )
}
