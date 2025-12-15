import React from 'react';

// A small wrapper around React.lazy that exposes a .preload() method which
// triggers the dynamic import. Useful to start loading a route chunk early
// (for example on idle) while keeping the component lazy for rendering.
export default function lazyWithPreload(factory) {
  const LazyComponent = React.lazy(factory);
  LazyComponent.preload = factory;
  return LazyComponent;
}
