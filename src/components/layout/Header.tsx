'use client';

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-8 py-8 bg-base/80 backdrop-blur-sm border-b border-primary/10 md:px-16">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-primary tracking-tight">
          Portfolio
        </h1>
        <div className="flex gap-4 md:gap-8">
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