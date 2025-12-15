
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 overflow-x-auto">
      <ol className="flex items-center space-x-2 text-sm text-gray-400 whitespace-nowrap">
        <li>
          <Link to="/" className="flex items-center hover:text-pink-400 transition-colors">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <li>
                {item.href ? (
                // Use internal SPA navigation for same-origin paths; leave external links as anchors
                (item.href.startsWith('/') || item.href.startsWith('#')) ? (
                  <Link to={item.href} className="hover:text-pink-400 transition-colors">{item.label}</Link>
                ) : (
                  <a href={item.href} className="hover:text-pink-400 transition-colors" rel="noopener noreferrer">{item.label}</a>
                )
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
