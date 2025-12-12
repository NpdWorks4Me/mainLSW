import React from 'react';
import { Link } from 'react-router-dom';

const DesktopFooter = () => {
  const footerLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Contact', href: '/about#contact' }
  ];

  return (
    <footer className="py-6 px-8 mt-12">
      <div className="glass-card font-inter p-6">
        <div className="flex flex-col items-center space-y-4">
          <nav className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
            {footerLinks.map(link => (
              <Link
                key={link.name}
                to={link.href}
                target={link.href.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="text-base text-foreground/80 font-medium transition-colors hover:text-pink-300 p-2"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <p className="text-sm text-foreground/60">
            © 2025 LittleSpaceWorld. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;