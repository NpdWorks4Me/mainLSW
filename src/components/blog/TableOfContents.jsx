import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List } from 'lucide-react';

const TableOfContents = ({ contentRef }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;

    const headingElements = Array.from(
      contentRef.current.querySelectorAll('h2, h3')
    );

    const generatedIds = new Set();
    const headingData = headingElements.map((heading) => {
      // Only generate ID if the heading doesn't already have one
      if (!heading.id) {
        let baseId = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        let id = baseId;
        let counter = 1;

        // Ensure uniqueness of the ID
        while (generatedIds.has(id)) {
          id = `${baseId}-${counter}`;
          counter++;
        }
        generatedIds.add(id);
        heading.id = id; // Assign the unique ID to the DOM element
      } else {
        generatedIds.add(heading.id);
      }

      return {
        id: heading.id,
        text: heading.textContent,
        level: heading.tagName.toLowerCase(),
      };
    });

    setHeadings(headingData);
  }, [contentRef]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            // No break, we want the last intersecting one for scrolling down
          }
        }
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0.1 }
    );

    const headingElements = contentRef.current ? Array.from(contentRef.current.querySelectorAll('h2, h3')) : [];
    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
    };
  }, [contentRef, headings]);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Adjust for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  if (headings.length === 0) return null;

  const tocContent = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="sidebar-glass-card p-4"
    >
      <h3 className="font-bold text-lg text-shimmer mb-4">On this page</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className={`toc-item ${heading.level === 'h3' ? 'pl-4' : ''}`}>
            <button
              onClick={() => handleScrollTo(heading.id)}
              className={`text-left w-full transition-all duration-200 text-sm ${activeId === heading.id
                  ? 'text-pink-400 font-semibold scale-105'
                  : 'text-gray-400 hover:text-white hover:translate-x-1'
                }`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <>
      {/* Desktop TOC */}
      {/* This section will be conditionally rendered based on whether the TableOfContents is desired */}
      {/* <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto">
          {tocContent}
        </div>
      </aside> */}

      {/* Mobile TOC */}
      {/* <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-purple-600/80 backdrop-blur-sm text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <List className="w-6 h-6" />
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 right-0 w-64 max-h-[70vh] overflow-y-auto"
            >
              {tocContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div> */}
    </>
  );
};

export default TableOfContents;