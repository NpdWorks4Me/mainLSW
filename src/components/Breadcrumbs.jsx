
import React from 'react';
// Lightweight breadcrumb links — avoid Next.js Link to keep Vite build clean
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 overflow-x-auto">
      <ol className="flex items-center space-x-2 text-sm text-gray-400 whitespace-nowrap">
        <li>
          <a href="/" className="flex items-center hover:text-pink-400 transition-colors">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </a>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <li>
                {item.href ? (
                <a
                  href={item.href}
                  className="hover:text-pink-400 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-gray-200 font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
