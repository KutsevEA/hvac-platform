export default function SkeletonCard() {
  return (
    <div
      style={{
        minHeight: '400px',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Image placeholder */}
      <div
        className="animate-pulse"
        style={{
          height: '240px',
          backgroundColor: '#f0f0f0',
          borderRadius: '16px 16px 0 0',
          flexShrink: 0,
        }}
      />

      {/* Content placeholders */}
      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Badge placeholder */}
        <div
          className="animate-pulse"
          style={{
            height: '14px',
            width: '72px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            marginBottom: '8px',
          }}
        />

        {/* Title placeholder — 2 lines */}
        <div
          className="animate-pulse"
          style={{
            height: '14px',
            width: '100%',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            marginBottom: '8px',
          }}
        />
        <div
          className="animate-pulse"
          style={{
            height: '14px',
            width: '75%',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            marginBottom: '12px',
          }}
        />

        {/* Price placeholder */}
        <div
          className="animate-pulse"
          style={{
            height: '14px',
            width: '56px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            marginBottom: '8px',
          }}
        />

        {/* Description placeholder — 2 lines */}
        <div
          className="animate-pulse"
          style={{
            height: '14px',
            width: '100%',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            marginBottom: '8px',
          }}
        />
        <div
          className="animate-pulse"
          style={{
            height: '14px',
            width: '60%',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            marginBottom: '8px',
          }}
        />
      </div>

      {/* Footer placeholder */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid #f0f0f0',
          marginTop: 'auto',
        }}
      >
        <div
          className="animate-pulse"
          style={{
            height: '14px',
            width: '88px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  )
}
