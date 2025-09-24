"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-black/90 backdrop-blur-sm border-t border-neutral-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.jpeg"
                alt="Logo"
                width={28}
                height={28}
              />
              <h3 className="text-xl font-bold text-white">CivicVoice</h3>
            </div>
            <p className="text-neutral-300 max-w-md mb-6">
              Empowering citizens to report civic issues and enabling administrators 
              to efficiently manage and resolve community concerns through AI-powered validation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-neutral-300 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/about" className="text-neutral-300 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/join-us" className="text-neutral-300 hover:text-white transition-colors">Report Issue</Link></li>
            </ul>
          </div>

          {/* Admin & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Admin & Support</h4>
            <ul className="space-y-2">
              <li><Link href="/admin" className="text-neutral-300 hover:text-white transition-colors">Admin Login</Link></li>
              <li><Link href="/contact" className="text-neutral-300 hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="mailto:support@civicvoice.com" className="text-neutral-300 hover:text-white transition-colors">Technical Support</Link></li>
              <li><Link href="mailto:admin@civicvoice.com" className="text-neutral-300 hover:text-white transition-colors">Admin Access</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">
            © 2025 CivicVoice. All rights reserved. Built for Smart India Hackathon.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
            <Link href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
