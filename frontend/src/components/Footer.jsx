import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center py-4 mt-auto">
      <p>© {new Date().getFullYear()} EduTrack. All rights reserved.</p>
    </footer>
  );
};

export default Footer;