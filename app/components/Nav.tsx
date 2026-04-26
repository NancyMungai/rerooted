'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/fridge', label: 'my fridge' },
  { href: '/shopping', label: 'shopping' },
  { href: '/skip', label: 'skip cooking' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8DF', width: '100%', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 20, color: '#2D6A1F', textDecoration: 'none' }}>
          ReRooted.
        </Link>
        <div className="hidden sm:flex" style={{ gap: 6, alignItems: 'center' }}>
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: 16,
                fontWeight: l.href === pathname ? 600 : 500,
                color: l.href === pathname ? '#1A1A1A' : '#6B7B69',
                backgroundColor: l.href === pathname ? '#D4E84A' : 'transparent',
                textDecoration: 'none',
                borderRadius: 99,
                padding: '4px 14px',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        className="flex sm:hidden"
        style={{ borderTop: '1px solid #E2E8DF', padding: '6px 8px', gap: 4 }}
      >
        {LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '10px 8px',
              fontSize: 15,
              fontWeight: 600,
              color: l.href === pathname ? '#1A1A1A' : '#6B7B69',
              backgroundColor: l.href === pathname ? '#D4E84A' : 'transparent',
              borderRadius: 99,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
