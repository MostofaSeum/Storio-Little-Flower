import React from "react";
import { StorioSettingsResponse } from "@storio/template-sdk";

interface FooterProps {
  settings?: StorioSettingsResponse | null;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer
      id="contact"
      className="bg-topbar text-gray-300 pt-16 pb-8 px-4 sm:px-8 mt-auto border-t-4 border-accent-pink"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
        {/* Col 1: Branding & Mission */}
        <div className="space-y-4">
          <a href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-300 via-pink-400 to-sky-400 p-1.5 flex items-center justify-center">
              <img
                src="/icons/school.png"
                alt="School Logo"
                className="w-6 h-6 object-contain brightness-0 invert"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-fredoka">
              {settings?.site_title || "Little Flowers"}
            </span>
          </a>
          <p className="text-gray-400 text-xs leading-relaxed">
            {settings?.site_tagline ||
              "Inspiring Little Minds Every Day through creative exploration and caring guidance."}
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wide">
            Quick Exploration
          </h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <a href="/#about" className="hover:text-accent-pink transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="/#programs" className="hover:text-secondary-color transition-colors">
                Learning Programs
              </a>
            </li>
            <li>
              <a href="/#teachers" className="hover:text-accent-blue transition-colors">
                Our Teachers
              </a>
            </li>
            <li>
              <a href="/#gallery" className="hover:text-accent-green transition-colors">
                Photo Gallery
              </a>
            </li>
            <li>
              <a href="/admission" className="hover:text-accent-pink transition-colors">
                Admission Portal
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: School Hours */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wide">
            School Timing
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Playgroup: 8:30 AM - 11:30 AM
            <br />
            Nursery & KG: 8:00 AM - 12:30 PM
            <br />
            Office Hours: Mon - Fri (8:00 AM - 3:00 PM)
            <br />
            Weekend: Closed (Family Time!)
          </p>
        </div>

        {/* Col 4: Campus Contact Info */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wide">
            Contact Us
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            {settings?.mailing_address || "74 Blossom Street, Sunshine Valley"}
            <br />
            Phone: {settings?.phone_number || "+1 8 888 567.890.03"}
            <br />
            Email: {settings?.contact_email || "info@example.com"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>
          © {new Date().getFullYear()} {settings?.site_title || "Little Flowers"}. Built for Storio CMS.
        </p>
        <div className="flex space-x-6 text-gray-400">
          <a href="/privacy" className="hover:text-white">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-white">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
