import { ImageResponse } from 'next/og';
import { WORK_STATUS } from '@/lib/config';
 
export const runtime = 'edge'
export const alt = 'Ramesh Maharjan - Full-Stack Engineer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#121310',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'monospace',
          border: '16px solid #161714',
        }}
      >
        {/* Background Grid Pattern Simulation */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(#2C2E29 2px, transparent 2px), linear-gradient(90deg, #2C2E29 2px, transparent 2px)',
            backgroundSize: '64px 64px',
            opacity: 0.3,
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
          <div
            style={{
              color: '#38BDF8',
              fontSize: 28,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            [ OPERATIONAL SYSTEM: READY ]
          </div>
          
          <h1
            style={{
              fontSize: 84,
              color: '#F4F3EE',
              fontWeight: 900,
              lineHeight: 1.1,
              marginTop: 0,
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}
          >
            Ramesh
            <br />
            Maharjan<span style={{ color: '#E3C849' }}>.</span>
          </h1>
          
          <div
            style={{
              fontSize: 32,
              color: '#A6A89F',
              maxWidth: '85%',
              marginTop: 20,
            }}
          >
            Full-Stack Engineer & Creative Technologist
          </div>
        </div>

        {/* Footer Metrics */}
        <div
          style={{
            display: 'flex',
            borderTop: '2px solid #2C2E29',
            paddingTop: '32px',
            justifyContent: 'space-between',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#666860', fontSize: 20, marginBottom: 8, textTransform: 'uppercase' }}>Location</span>
            <span style={{ color: '#E3C849', fontSize: 24, fontWeight: 'bold' }}>Kathmandu, Nepal</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#666860', fontSize: 20, marginBottom: 8, textTransform: 'uppercase' }}>Focus</span>
            <span style={{ color: '#E3C849', fontSize: 24, fontWeight: 'bold' }}>Resilient Backend & Tactical UIs</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#666860', fontSize: 20, marginBottom: 8, textTransform: 'uppercase' }}>Status</span>
            <span style={{ color: WORK_STATUS.colorHex, fontSize: 24, fontWeight: 'bold' }}>{WORK_STATUS.available ? 'Available' : 'Engaged'}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
