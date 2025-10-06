"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="relative bg-black text-white py-12 px-6 border-t border-blue-600/30 overflow-hidden">
      {/* Galaxy background effects */}
      <div className="absolute bottom-0 right-0 galaxy-container w-[400px] h-[400px]">
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-gradient-to-r from-yellow-200/30 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-gradient-to-r from-blue-800/15 via-purple-800/20 to-transparent rounded-full rotate-45 blur-xl animate-slow-spin"></div>
        <div className="absolute bottom-0 right-10 w-[350px] h-[350px] bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-transparent rounded-full -rotate-45 blur-xl animate-slow-spin-reverse"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-blue-400 tracking-tight">TechDragon</h3>
          <p className="text-gray-100 text-sm">
            Pioneering code in the heart of the digital galaxy. For innovators orbiting the stars of technology.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Navigate</h4>
          <ul className="space-y-2 text-gray-200">
            {["home", "about", "projects", "contact"].map((item) => (
              <li key={item}>
                <a href={`#${item}`} className="hover:text-blue-400 transition-colors capitalize">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social / Connect */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Connect</h4>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="https://twitter.com" className="text-gray-200 hover:text-blue-400 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a href="https://github.com" className="text-gray-200 hover:text-blue-400 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.29 1.08 2.85.82.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.92 0-1.08.38-1.96 1.01-2.65-.1-.25-.44-1.26.1-2.62 0 0 .83-.27 2.72 1.01a9.35 9.35 0 012.5-.34c.85 0 1.71.11 2.5.34 1.89-1.28 2.72-1.01 2.72-1.01.54 1.36.2 2.37.1 2.62.63.69 1.01 1.57 1.01 2.65 0 3.82-2.33 4.67-4.56 4.92.36.31.67.94.67 1.89v2.8c0 .28.16.59.67.5A10 10 0 0022 12 10 10 0 0012 2z" />
              </svg>
            </a>
            <a href="https://linkedin.com" className="text-gray-200 hover:text-blue-400 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5S.02 4.881.02 3.5 1.13 1 2.5 1s2.48 1.119 2.48 2.5zM5 8H0v16h5V8zm7.982 0H8.014v16h4.969v-8.009c0-4.463 5.981-4.838 5.981 0V24H24v-9.636c0-7.364-8.383-7.092-11.018-.364V8z" />
              </svg>
            </a>
          </div>
         
        </div>
      </div>

      {/* Bottom Line */}
      <div className="relative mt-8 pt-6 border-t border-blue-600/30 text-center text-gray-200 text-sm">
        <p>© 2025  All Rights Reserved</p>
      </div>

      {/* Inline styles for animation */}
      <style jsx>{`
        .galaxy-container {
          position: absolute;
          overflow: hidden;
        }
        @keyframes slow-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes slow-spin-reverse {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }
        .animate-slow-spin {
          animation: slow-spin 40s linear infinite;
        }
        .animate-slow-spin-reverse {
          animation: slow-spin-reverse 50s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
