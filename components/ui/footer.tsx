"use client";
import React from "react";

const Footer = () => {
  return (
    <footer style={{
      background: '#000',
      borderTop: '1px solid #1f1f1f',
      padding: '56px 24px 32px',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:wght@700&display=swap');
        .footer-inner {
          max-width: 760px;
          margin: 0 auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
        }
        .footer-brand {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -.01em;
          margin: 0 0 12px;
        }
        .footer-tagline {
          font-size: 13px;
          font-weight: 300;
          color: #555;
          line-height: 1.7;
          margin: 0;
          max-width: 260px;
        }
        .footer-heading {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #fff;
          margin: 0 0 16px;
        }
        .footer-links {
          list-style: none;
          margin: 0; padding: 0;
          display: flex; flex-direction: column; gap: 10px;
        }
        .footer-links a {
          font-size: 13px;
          font-weight: 300;
          color: #555;
          text-decoration: none;
          text-transform: capitalize;
          transition: color .15s;
        }
        .footer-links a:hover { color: #fff; }
        .footer-socials {
          display: flex; gap: 16px; margin: 0;
        }
        .footer-socials a {
          color: #444;
          transition: color .15s;
        }
        .footer-socials a:hover { color: #fff; }
        .footer-bottom {
          border-top: 1px solid #111;
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .footer-copy {
          font-size: 12px;
          font-weight: 300;
          color: #333;
          margin: 0;
        }
        .footer-dot {
          width: 4px; height: 4px;
          background: #222; border-radius: 50%;
        }
      `}</style>

      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <p className="footer-brand">TechDragon</p>
            <p className="footer-tagline">
              Pioneering code in the heart of the digital world. For innovators at the frontier of technology.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="footer-heading">Navigate</p>
            <ul className="footer-links">
              {["home", "about", "projects", "contact"].map(item => (
                <li key={item}>
                  <a href={`/${item === 'home' ? '' : item}`}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="footer-heading">Connect</p>
            <div className="footer-socials">
              {/* Twitter/X */}
              <a href="https://twitter.com" aria-label="Twitter">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              {/* GitHub */}
              <a href="https://github.com" aria-label="GitHub">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.29 1.08 2.85.82.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.92 0-1.08.38-1.96 1.01-2.65-.1-.25-.44-1.26.1-2.62 0 0 .83-.27 2.72 1.01a9.35 9.35 0 012.5-.34c.85 0 1.71.11 2.5.34 1.89-1.28 2.72-1.01 2.72-1.01.54 1.36.2 2.37.1 2.62.63.69 1.01 1.57 1.01 2.65 0 3.82-2.33 4.67-4.56 4.92.36.31.67.94.67 1.89v2.8c0 .28.16.59.67.5A10 10 0 0022 12 10 10 0 0012 2z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" aria-label="LinkedIn">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5S.02 4.881.02 3.5 1.13 1 2.5 1s2.48 1.119 2.48 2.5zM5 8H0v16h5V8zm7.982 0H8.014v16h4.969v-8.009c0-4.463 5.981-4.838 5.981 0V24H24v-9.636c0-7.364-8.383-7.092-11.018-.364V8z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} TechDragon. All rights reserved.</p>
          <div className="footer-dot" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;