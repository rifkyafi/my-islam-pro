"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FaGithub, FaEnvelope, FaGlobe, FaHeart, FaBookOpen, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import { ExternalLinkModal } from './ExternalLinkModal';

export function Footer() {
  const year = new Date().getFullYear();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleExternalClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    setPendingUrl(url);
    setIsOpen(true);
  };

  return (
    <footer className="relative bg-[var(--bg-secondary)] text-[var(--text-primary)] border-t border-[var(--accent-border-light)] overflow-hidden">
      {/* Background ambient elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent-border),transparent)]" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[radial-gradient(circle,rgba(212,140,70,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 py-10 md:py-12">
        {/* Top Row: Horizontal composition */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-12">
          
          {/* Left Part: Branding, Description */}
          <div className="flex flex-col gap-3 max-w-[480px]">
            <div className="flex items-center gap-3">
              <span className="font-neirizi text-[2.2rem] text-[var(--text-accent)] leading-none select-none">حديث</span>
              <div className="flex flex-col leading-none">
                <span className="font-cormorant text-[1.15rem] font-bold tracking-[0.5px]">Hadits Tematik</span>
                <span className="text-[0.6rem] tracking-[2.5px] uppercase text-[var(--text-muted)] font-montserrat mt-1">My Islam Pro</span>
              </div>
            </div>
            <p className="text-[0.78rem] text-[var(--text-muted)] leading-[1.6] font-montserrat">
              Platform digital yang menyajikan ayat Al-Qur&apos;an dan hadits-hadits pilihan berbasis tema kehidupan sebagai panduan dan inspirasi harian.
            </p>
          </div>

          {/* Right Part: Navigation and Email + Socials */}
          <div className="flex flex-col gap-4 items-start lg:items-end w-full lg:w-auto">
            {/* Horizontal Nav */}
            <nav className="grid grid-cols-2 justify-items-end gap-x-12 gap-y-3 text-[0.8rem] font-montserrat">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/quran', label: 'Al-Qur\'an' },
                { href: '/hadis', label: 'Hadits Pilihan' },
                { href: '/dalil', label: 'Pencarian Dalil' },
              ].map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="text-[var(--text-muted)] hover:text-[var(--text-accent)] transition-colors duration-200 no-underline font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* Contact & Social Links */}
            <div className="flex flex-wrap items-center gap-6 mt-1 lg:mt-0">
              <a 
                href="mailto:rifkyafifu@gmail.com"
                onClick={(e) => handleExternalClick(e, 'https://mail.google.com/mail/?view=cm&fs=1&to=rifkyafifu@gmail.com&su=rifkyafifu@gmail.com')}
                className="inline-flex items-center gap-2.5 text-[0.78rem] text-[var(--text-accent)] hover:text-[var(--text-accent-bright)] transition-colors duration-200 font-montserrat font-semibold break-all cursor-pointer"
              >
                <FaEnvelope size={13} className="shrink-0" />
                <span>rifkyafifu@gmail.com</span>
              </a>
              
              {/* Vertical line separator between email and socials */}
              <div className="hidden sm:block w-px h-4 bg-[var(--accent-border)]" aria-hidden="true" />

              <div className="flex items-center gap-3">
                <a 
                  href="https://github.com/rifkyafi" 
                  onClick={(e) => handleExternalClick(e, 'https://github.com/rifkyafi')}
                  className="w-7 h-7 rounded-full border border-[var(--accent-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-300"
                  aria-label="GitHub Repository"
                >
                  <FaGithub size={14} />
                </a>
                <a 
                  href="https://instagram.com/rifkyafii__" 
                  onClick={(e) => handleExternalClick(e, 'https://www.instagram.com/rifkyafii__')}
                  className="w-7 h-7 rounded-full border border-[var(--accent-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram size={14} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/rifky-afiifurrohmaan-45722932a" 
                  onClick={(e) => handleExternalClick(e, 'https://www.linkedin.com/in/rifky-afiifurrohmaan-45722932a')}
                  className="w-7 h-7 rounded-full border border-[var(--accent-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={14} />
                </a>
                <a 
                  href="https://my-islam-pro.vercel.app" 
                  onClick={(e) => handleExternalClick(e, 'https://my-islam-pro.vercel.app')}
                  className="w-7 h-7 rounded-full border border-[var(--accent-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-300"
                  aria-label="Website"
                >
                  <FaGlobe size={13} />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-[linear-gradient(90deg,transparent,var(--accent-border-light),transparent)]" />

        {/* Bottom Bar: Copyright & Reference Sources */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[0.72rem] font-montserrat text-[var(--text-muted)]">
          <p>© {year} Hadits Tematik. Hak Cipta Dilindungi.</p>
          
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <FaBookOpen className="text-[var(--text-accent)] shrink-0" size={11} />
              <span>Rujukan: Kutubut Tis&apos;ah &amp; Kemenag RI</span>
            </div>
            <span className="hidden md:inline text-[var(--accent-border)]" aria-hidden="true">•</span>
            <p className="flex items-center gap-1.5">
              Dibuat dengan 
              <FaHeart className="text-rose-500 animate-pulse" size={11} />
              untuk umat Muslim
            </p>
          </div>
        </div>
      </div>

      <ExternalLinkModal
        isOpen={isOpen}
        onConfirm={() => {
          if (pendingUrl) {
            window.open(pendingUrl, '_blank', 'noopener,noreferrer');
          }
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
      />
    </footer>
  );
}
