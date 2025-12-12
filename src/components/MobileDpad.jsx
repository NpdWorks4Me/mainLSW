import React, { useEffect, useRef } from 'react';
// import nipplejs only on client runtime inside useEffect to avoid server-side errors

// A simple mobile joystick that emits direction changes
const MobileDpad = ({ onDirection }) => {
  const containerRef = useRef(null);
  const managerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    if (!containerRef.current) return;
    const opts = {
      zone: containerRef.current,
      mode: 'static',
      position: { left: '50%', top: '80%' },
      color: '#fff',
      size: 100,
    };
    let manager;
    (async () => {
      try {
        const mod = await import('nipplejs');
        const nipple = mod?.default || mod;
        manager = nipple.create(opts);
        managerRef.current = manager;
      } catch (err) {
      console.error('Failed to initialize nipplejs manager', err);
      }
    })();

    manager?.on('move', (evt, data) => {
      if (!data || !data.direction) return;
      const dir = data.direction.angle; // 'up','down','left','right'
      if (dir === 'up') onDirection({ x: 0, y: -1 });
      if (dir === 'down') onDirection({ x: 0, y: 1 });
      if (dir === 'left') onDirection({ x: -1, y: 0 });
      if (dir === 'right') onDirection({ x: 1, y: 0 });
    });
  manager?.on('end', () => {});

    return () => { mounted = false; manager?.destroy(); };
  }, [onDirection]);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none">
    <div className="dpad-zone pointer-events-auto" />
  </div>;
};

export default MobileDpad;
