export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: '#1a1712',
      }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer half-solid arc */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="#9c8654"
          strokeWidth="2"
          strokeDasharray="0 0 145 145"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Outer half-dashed arc */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="#9c8654"
          strokeWidth="2"
          strokeDasharray="6 10"
          strokeLinecap="round"
          opacity="0.25"
          transform="rotate(180 50 50)"
        />
        {/* Diffusion ring */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#9c8654"
          strokeWidth="0.5"
          opacity="0.12"
        />
        {/* Node dot at top */}
        <circle cx="50" cy="4" r="3" fill="#9c8654" opacity="0.7" />
        {/* Top cardinal ray */}
        <line
          x1="50"
          y1="14"
          x2="50"
          y2="4"
          stroke="#9c8654"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Center circles with staggered pulse */}
        <style>{`@keyframes lumen-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18);opacity:1}}`}</style>
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="#9c8654"
          strokeWidth="0.5"
          opacity="0.15"
          style={{
            transformOrigin: '50px 50px',
            animation: 'lumen-pulse 3s ease-in-out infinite',
          }}
        />
        <circle
          cx="50"
          cy="50"
          r="22"
          fill="none"
          stroke="#9c8654"
          strokeWidth="0.8"
          opacity="0.25"
          style={{
            transformOrigin: '50px 50px',
            animation: 'lumen-pulse 3s ease-in-out 0.3s infinite',
          }}
        />
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="#9c8654"
          opacity="0.9"
          style={{
            transformOrigin: '50px 50px',
            animation: 'lumen-pulse 3s ease-in-out 0.6s infinite',
          }}
        />
      </svg>
    </div>
  );
}
