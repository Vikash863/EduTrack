import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  FolderGit2,
  Bird,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white border-t border-white/10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
              <GraduationCap size={22} />
            </div>

            <h2 className="text-2xl font-bold tracking-wide">
              EduTrack
            </h2>
          </div>

          <p className="text-gray-400 leading-7 text-sm">
            Smart Student Result Management & Analytics Platform
            designed to simplify academic workflows with secure
            access, dashboards, and insights.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a
              href="#"
              className="bg-white/5 p-2 rounded-lg hover:bg-blue-600 transition"
            >
              <FolderGit2 size={18} />
            </a>

            {/* <a
              href="#"
              className="bg-white/5 p-2 rounded-lg hover:bg-blue-600 transition"
            >
              <Linkedin size={18} />
            </a> */}

            <a
              href="#"
              className="bg-white/5 p-2 rounded-lg hover:bg-blue-600 transition"
            >
              <Bird size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3 text-gray-400 text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-blue-400 transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard"
                className="hover:text-blue-400 transition"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/students"
                className="hover:text-blue-400 transition"
              >
                Students
              </Link>
            </li>

            <li>
              <Link
                to="/results"
                className="hover:text-blue-400 transition"
              >
                Results
              </Link>
            </li>
          </ul>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold mb-5">
            Features
          </h3>

          <ul className="space-y-3 text-gray-400 text-sm">
            <li>JWT Authentication</li>
            <li>Student Management</li>
            <li>Result Analytics</li>
            <li>Responsive Dashboard</li>
            <li>PDF Report Export</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-5">
            Contact
          </h3>

          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex items-center gap-3">
              <Mail
                size={16}
                className="text-blue-400"
              />
              support@edutrack.com
            </li>

            <li className="flex items-center gap-3">
              <Phone
                size={16}
                className="text-blue-400"
              />
              +91 98765 43210
            </li>

            <li className="flex items-start gap-3">
              <MapPin
                size={16}
                className="text-blue-400 mt-1"
              />
              India
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} EduTrack.
            All rights reserved.
          </p>

          <div className="flex gap-5">
            <a
              href="#"
              className="hover:text-blue-400 transition"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="hover:text-blue-400 transition"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;