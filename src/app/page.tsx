'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Scene from '@/components/3d/Scene';

export default function Home() {
  return (
    <MainLayout>
      <Scene />
      
      {/* Hero Section */}
      <section id="home" className="relative h-screen flex flex-col justify-center items-center text-center px-8">
        <div className="max-w-4xl bg-white/80 backdrop-blur-sm p-8 rounded-lg">
          <h1 className="text-5xl md:text-4xl font-semibold text-primary mb-6 tracking-tight leading-tight" style={{textShadow: '0px 1px 3px rgba(0, 0, 0, 0.15)'}}>
            Morphing Geometric Canvas
          </h1>
          <p className="text-xl md:text-lg text-text max-w-2xl leading-relaxed mb-8 mx-auto font-normal">
            An interactive 3D portfolio experience where geometry comes alive through your interactions
          </p>
          <button className="border-2 border-accent text-accent px-10 py-4 text-lg font-semibold hover:bg-accent hover:text-white transition-all duration-300">
            Explore Projects
          </button>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="relative min-h-screen flex flex-col justify-center items-center text-center px-8 py-16">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-lg">
          <h2 className="text-4xl md:text-3xl font-semibold text-primary mb-8 tracking-tight leading-tight" style={{textShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)'}}>
            Featured Projects
          </h2>
          <p className="text-xl md:text-lg text-text mb-16 leading-relaxed font-normal">
            Explore my work through interactive 3D objects. Click on any shape to learn more about the project.
          </p>
          
          {/* Project Grid (placeholder for 3D objects) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 border border-gray-200 hover:border-blue-600 transition-colors duration-300">
              <h3 className="text-2xl font-semibold text-primary mb-4 leading-tight">Project One</h3>
              <p className="text-base text-text mb-4 leading-relaxed font-normal">A cutting-edge web application built with modern technologies.</p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-gray-100 text-primary text-sm">React</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-900 text-sm">TypeScript</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-900 text-sm">Three.js</span>
              </div>
            </div>
            
            <div className="bg-white p-6 border border-gray-200 hover:border-accent transition-colors duration-300">
              <h3 className="text-2xl font-semibold text-primary mb-4 leading-tight">Project Two</h3>
              <p className="text-base text-text mb-4 leading-relaxed font-normal">An innovative mobile-first solution with seamless user experience.</p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-gray-100 text-primary text-sm">Next.js</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-900 text-sm">Tailwind</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-900 text-sm">Node.js</span>
              </div>
            </div>
            
            <div className="bg-white p-6 border border-gray-200 hover:border-accent transition-colors duration-300">
              <h3 className="text-2xl font-semibold text-primary mb-4 leading-tight">Project Three</h3>
              <p className="text-base text-text mb-4 leading-relaxed font-normal">A full-stack application with real-time features and modern design.</p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-gray-100 text-primary text-sm">Vue.js</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-900 text-sm">Python</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-900 text-sm">Docker</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="relative min-h-screen flex flex-col justify-center items-center text-center px-8 py-16">
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-lg">
          <h2 className="text-4xl md:text-3xl font-semibold text-primary mb-8 tracking-tight leading-tight" style={{textShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)'}}>
            About Me
          </h2>
          <p className="text-xl md:text-lg text-text mb-8 leading-relaxed font-normal">
            I&apos;m a passionate developer who believes in the power of geometric beauty and interactive experiences. 
            This portfolio itself is a testament to my philosophy: combining technical excellence with artistic vision.
          </p>
          <p className="text-xl md:text-lg text-text leading-relaxed font-normal">
            Through carefully crafted animations and user interactions, I create digital experiences that are both 
            functional and inspiring.
          </p>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="relative min-h-screen flex flex-col justify-center items-center text-center px-8 py-16">
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-lg">
          <h2 className="text-4xl md:text-3xl font-semibold text-primary mb-8 tracking-tight leading-tight" style={{textShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)'}}>
            Get In Touch
          </h2>
          <p className="text-xl md:text-lg text-text mb-8 leading-relaxed font-normal">
            Ready to bring your ideas to life? Let&apos;s create something extraordinary together.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-accent text-white px-10 py-4 text-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
              Send Message
            </button>
            <button className="border-2 border-gray-400 text-primary px-10 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
              Download CV
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
