export function isSupabaseUrl(url) {
  try {
    const u = new URL(url);
    return u.host.includes('supabase.co') || u.host.includes('supabaseusercontent.com');
  } catch (e) { return false; }
}

export function responsiveSrcSet(url, widths = [400, 800, 1200]) {
  // Many image CDNs accept a ?width= param; Supabase storage with image CDN (imgix/proxy) often does.
  // Fall back to returning the same URL if we can't confidently produce variants.
  if (!url) return '';

  if (isSupabaseUrl(url)) {
    return widths.map(w => `${url}?width=${w} ${w}w`).join(', ');
  }

  // If the URL already contains query params, try appending width param safely
  try {
    const u = new URL(url);
    return widths.map(w => `${u.origin}${u.pathname}?width=${w} ${w}w`).join(', ');
  } catch (e) {
    return `${url} 800w`;
  }
}

export function defaultSizes() {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';
}
