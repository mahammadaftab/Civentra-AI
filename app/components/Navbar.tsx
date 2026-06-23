"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { name: "Platform", href: "#platform" },
  { name: "Agents", href: "#agents" },
  { name: "Solutions", href: "#solutions" },
  { name: "Technology", href: "#technology" },
  { name: "Dashboard", href: "#dashboard" },
  { name: "Documentation", href: "#documentation" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-brand-black/70 backdrop-blur-md border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue via-brand-violet to-brand-cyan flex items-center justify-center p-[1px]">
            <div className="w-full h-full bg-brand-black rounded-[7px] flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
              <span className="text-white font-bold text-sm">C</span>
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Civentra AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-brand-black px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl hover:bg-brand-dark transition-colors">
              Get Started
            </span>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
