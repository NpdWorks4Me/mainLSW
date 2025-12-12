"use client"
import { useEffect } from 'react'

// This very small client-side helper removes DOM attributes added by
// common browser extensions (like Zoom's `cz-shortcut-listen`) that cause
// hydration mismatches in development or CI logs. We intentionally remove a
// small, explicit list of attributes that are known to be innocuous but cause
// React hydration warnings because they're only present in the browser DOM.

export default function RemoveExtensionAttributes() {
  useEffect(() => {
    const toRemove = [
      'cz-shortcut-listen', // Zoom extension installs this on <body>
      // Add more attributes here as needed if they surface in logs
    ]

    // Remove attributes if they exist at mount; also set up a MutationObserver
    // to handle aggressive extensions that add them after mount.
    toRemove.forEach(attr => {
      try { document.body.removeAttribute(attr) } catch (err) { /* ignore */ }
    })

    const observer = new MutationObserver(mutations => {
      try {
        toRemove.forEach(attr => document.body.hasAttribute(attr) && document.body.removeAttribute(attr))
      } catch (err) { /* ignore */ }
    })

    observer.observe(document.body, { attributes: true, attributeFilter: toRemove })
    return () => observer.disconnect()
  }, [])

  return null
}
