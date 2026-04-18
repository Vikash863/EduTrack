import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='relative mt-auto border-t border-blue-800/30 bg-slate-950 backdrop-blur-lg py-12 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid md:grid-cols-4 gap-8 mb-8'>
          {/* Brand Section */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <span className='text-lg font-bold'>📚 EduTrack</span>
            </div>
            <p className='text-slate-400 text-sm leading-relaxed'>
              Smart educational management platform for modern institutions.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className='font-semibold text-white mb-4'>Product</h4>
            <ul className='space-y-2 text-slate-400 text-sm'>
              <li><a href='#features' className='hover:text-blue-400 transition'>Features</a></li>
              <li><a href='#benefits' className='hover:text-blue-400 transition'>Benefits</a></li>
              <li><a href='#why' className='hover:text-blue-400 transition'>Why Us</a></li>
              <li><Link to='/dashboard' className='hover:text-blue-400 transition'>Dashboard</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className='font-semibold text-white mb-4'>Support</h4>
            <ul className='space-y-2 text-slate-400 text-sm'>
              <li><a href='#' className='hover:text-blue-400 transition'>Documentation</a></li>
              <li><a href='#' className='hover:text-blue-400 transition'>Help Center</a></li>
              <li><a href='#' className='hover:text-blue-400 transition'>Contact Us</a></li>
              <li><a href='#' className='hover:text-blue-400 transition'>Report Issue</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className='font-semibold text-white mb-4'>Legal</h4>
            <ul className='space-y-2 text-slate-400 text-sm'>
              <li><a href='#' className='hover:text-blue-400 transition'>Privacy Policy</a></li>
              <li><a href='#' className='hover:text-blue-400 transition'>Terms of Service</a></li>
              <li><a href='#' className='hover:text-blue-400 transition'>Cookie Policy</a></li>
              <li><a href='#' className='hover:text-blue-400 transition'>Security</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-blue-800/30 pt-8'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <p className='text-slate-400 text-sm text-center md:text-left'>
              &copy; {currentYear} EduTrack. All rights reserved. Built with ❤️ for educators.
            </p>
            <div className='flex gap-6'>
              <a href='#' className='text-slate-400 hover:text-blue-400 transition text-sm'>Twitter</a>
              <a href='#' className='text-slate-400 hover:text-blue-400 transition text-sm'>LinkedIn</a>
              <a href='#' className='text-slate-400 hover:text-blue-400 transition text-sm'>GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;