'use client';

import React from 'react';
import Logo from '../ui/Logo';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-2 bg-base/80 backdrop-blur-sm border-b border-primary/10 md:px-8">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Logo className="text-primary" size="medium" />
          <h1 className="text-xl font-semibold text-primary tracking-tight">
            Lunahart
          </h1>
        </div>
        <div className="flex gap-3 md:gap-6">
          <a 
            href="#home" 
            className="text-text hover:text-accent font-semibold text-base transition-colors duration-300"
          >
            Home
          </a>
          <a 
            href="#projects" 
            className="text-text hover:text-accent font-semibold text-base transition-colors duration-300"
          >
            Projects
          </a>
          <a 
            href="#about" 
            className="text-text hover:text-accent font-semibold text-base transition-colors duration-300"
          >
            About
          </a>
          <a 
            href="#contact" 
            className="text-text hover:text-accent font-semibold text-base transition-colors duration-300"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;