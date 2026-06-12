"use client";

import { motion, AnimatePresence } from 'motion/react';
import { FaGlobe } from 'react-icons/fa6';

export function ExternalLinkModal({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-[300px] bg-[var(--bg-card)] border border-[var(--accent-border)] rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center z-10"
          >
            <div className="mx-auto w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--text-accent)] mb-3 animate-bounce">
              <FaGlobe size={16} />
            </div>

            <h3 className="font-cormorant text-[1.1rem] font-bold text-[var(--text-primary)] mb-1.5 leading-tight">
              Meninggalkan Halaman
            </h3>
            <p className="text-[0.74rem] text-[var(--text-muted)] font-montserrat leading-relaxed mb-4">
              Anda akan dialihkan ke situs eksternal di luar platform Hadits Tematik. Apakah Anda yakin?
            </p>

            <div className="flex items-center gap-2.5 font-montserrat text-[0.7rem]">
              <button
                onClick={onCancel}
                className="flex-1 py-2 px-3 border border-[var(--accent-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent)]/5 rounded-xl transition-all duration-300 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2 px-3 bg-[var(--accent)] text-[var(--text-on-accent)] hover:bg-[var(--accent-light)] hover:shadow-[0_4px_12px_rgba(212,140,70,0.2)] rounded-xl transition-all duration-300 font-semibold cursor-pointer"
              >
                Lanjutkan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
