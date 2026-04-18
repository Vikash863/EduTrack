import { Link } from 'react-router-dom';

export default function Landing() {
  const features = [
    { icon: '👥', title: 'Student Management', desc: 'Easy enrollment, tracking, and profile management' },
    { icon: '📚', title: 'Result Management', desc: 'Automated grading and GPA calculations' },
    { icon: '⏰', title: 'Attendance System', desc: 'Real-time attendance marking and reports' },
    { icon: '📊', title: 'Advanced Analytics', desc: 'Detailed insights and performance metrics' },
    { icon: '🔒', title: 'Secure Access', desc: 'Role-based authentication and encryption' },
    { icon: '📈', title: 'Performance Trends', desc: 'Track student progress over time' },
    { icon: '⚡', title: 'Fast & Reliable', desc: 'Lightning-fast API and database queries' },
    { icon: '✓', title: 'Fully Responsive', desc: 'Perfect on desktop, tablet, and mobile' },
  ];

  const benefits = [
    { icon: '✓', title: 'Save Time', desc: 'Automate repetitive tasks and focus on education' },
    { icon: '✓', title: 'Better Decisions', desc: 'Data-driven insights for institutional growth' },
    { icon: '✓', title: 'Enhanced Security', desc: 'Enterprise-grade security for sensitive data' },
    { icon: '✓', title: 'Seamless Integration', desc: 'Easy to integrate with existing systems' },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-950 text-white overflow-hidden'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation Header */}
      <header className='relative z-10 border-b border-blue-800/30 bg-slate-950/40 backdrop-blur-lg sticky top-0'>
        <nav className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <span className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'>📚 EduTrack</span>
          </div>
          <div className='hidden md:flex gap-6'>
            <a href='#features' className='text-slate-300 hover:text-blue-400 transition'>Features</a>
            <a href='#benefits' className='text-slate-300 hover:text-blue-400 transition'>Benefits</a>
            <a href='#why' className='text-slate-300 hover:text-blue-400 transition'>Why Us</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className='relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Left Content */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <div className='inline-block px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full text-sm font-semibold text-blue-300'>
                ✨ Modern Educational Management
              </div>
              <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold leading-tight'>
                Manage Your School
                <span className='block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent'>Effortlessly</span>
              </h1>
              <p className='text-xl text-slate-300 leading-relaxed'>
                Track students, manage results, monitor attendance, and gain actionable insights with our intelligent educational dashboard designed for modern institutions.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 pt-8'>
              <Link
                to='/register'
                className='group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105'
              >
                Get Started Free
                <span className='ml-2'>→</span>
              </Link>
              <Link
                to='/login'
                className='inline-flex items-center justify-center px-8 py-4 font-semibold text-white border-2 border-blue-400/50 rounded-lg hover:border-blue-400 hover:bg-blue-500/10 transition duration-300'
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-6 pt-8 border-t border-blue-800/30'>
              <div>
                <div className='text-3xl font-bold text-cyan-400'>50+</div>
                <div className='text-sm text-slate-400'>API Endpoints</div>
              </div>
              <div>
                <div className='text-3xl font-bold text-cyan-400'>100%</div>
                <div className='text-sm text-slate-400'>Secure</div>
              </div>
              <div>
                <div className='text-3xl font-bold text-cyan-400'>Real-time</div>
                <div className='text-sm text-slate-400'>Analytics</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className='relative hidden lg:block'>
            <div className='relative bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-800/50 rounded-2xl p-8 backdrop-blur-xl'>
              {/* Dashboard Preview Cards */}
              <div className='space-y-4'>
                <div className='bg-slate-900/60 rounded-lg p-4 border border-blue-700/30 hover:border-blue-500/50 transition'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span className='text-2xl'>👥</span>
                    <span className='font-semibold text-sm'>Student Management</span>
                  </div>
                  <div className='h-2 bg-blue-500/20 rounded-full overflow-hidden'>
                    <div className='h-full w-3/4 bg-gradient-to-r from-blue-500 to-cyan-400'></div>
                  </div>
                </div>
                <div className='bg-slate-900/60 rounded-lg p-4 border border-blue-700/30 hover:border-blue-500/50 transition'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span className='text-2xl'>📊</span>
                    <span className='font-semibold text-sm'>Performance Analytics</span>
                  </div>
                  <div className='h-2 bg-blue-500/20 rounded-full overflow-hidden'>
                    <div className='h-full w-4/5 bg-gradient-to-r from-cyan-500 to-blue-400'></div>
                  </div>
                </div>
                <div className='bg-slate-900/60 rounded-lg p-4 border border-blue-700/30 hover:border-blue-500/50 transition'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span className='text-2xl'>✓</span>
                    <span className='font-semibold text-sm'>Attendance Tracking</span>
                  </div>
                  <div className='h-2 bg-blue-500/20 rounded-full overflow-hidden'>
                    <div className='h-full w-2/3 bg-gradient-to-r from-green-500 to-cyan-400'></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='relative z-10 py-20 bg-slate-900/50 border-y border-blue-800/30'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4'>Powerful Features</h2>
            <p className='text-xl text-slate-400'>Everything you need to manage your institution effectively</p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {features.map((feature, idx) => (
              <div key={idx} className='group bg-slate-950/80 border border-blue-800/30 rounded-xl p-6 hover:border-blue-500/50 hover:bg-slate-900/90 transition duration-300'>
                <div className='text-4xl mb-4'>{feature.icon}</div>
                <h3 className='text-lg font-semibold mb-2'>{feature.title}</h3>
                <p className='text-slate-400 text-sm leading-relaxed'>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id='benefits' className='relative z-10 py-20 max-w-7xl mx-auto px-6'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-6'>
            <h2 className='text-4xl md:text-5xl font-bold'>Why Choose EduTrack?</h2>
            <p className='text-xl text-slate-300'>Transform how your institution manages educational data with our comprehensive, user-friendly platform.</p>
            
            {benefits.map((benefit, idx) => (
              <div key={idx} className='flex gap-4'>
                <div className='flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-400/50'>
                  <span className='font-bold text-lg'>{benefit.icon}</span>
                </div>
                <div>
                  <h3 className='font-semibold text-lg mb-1'>{benefit.title}</h3>
                  <p className='text-slate-400'>{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='relative'>
            <div className='bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-800/50 rounded-2xl p-8 backdrop-blur-xl'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-slate-900/60 rounded-lg p-6 border border-blue-700/30'>
                  <div className='text-3xl font-bold text-blue-400 mb-2'>500+</div>
                  <p className='text-sm text-slate-400'>Institutions</p>
                </div>
                <div className='bg-slate-900/60 rounded-lg p-6 border border-blue-700/30'>
                  <div className='text-3xl font-bold text-cyan-400 mb-2'>50K+</div>
                  <p className='text-sm text-slate-400'>Students Managed</p>
                </div>
                <div className='bg-slate-900/60 rounded-lg p-6 border border-blue-700/30'>
                  <div className='text-3xl font-bold text-green-400 mb-2'>99.9%</div>
                  <p className='text-sm text-slate-400'>Uptime</p>
                </div>
                <div className='bg-slate-900/60 rounded-lg p-6 border border-blue-700/30'>
                  <div className='text-3xl font-bold text-purple-400 mb-2'>24/7</div>
                  <p className='text-sm text-slate-400'>Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id='why' className='relative z-10 py-20 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-y border-blue-800/30'>
        <div className='max-w-4xl mx-auto px-6 text-center space-y-8'>
          <h2 className='text-4xl md:text-5xl font-bold'>Ready to Transform Your Institution?</h2>
          <p className='text-xl text-slate-300 max-w-2xl mx-auto'>
            Join hundreds of educational institutions that trust EduTrack for managing their student data and operations.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/register'
              className='inline-flex items-center justify-center px-8 py-4 font-semibold text-slate-950 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105'
            >
              Start Free Trial
            </Link>
            <Link
              to='/login'
              className='inline-flex items-center justify-center px-8 py-4 font-semibold text-white border-2 border-blue-400/50 rounded-lg hover:border-blue-400 hover:bg-blue-500/10 transition duration-300'
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='relative z-10 border-t border-blue-800/30 bg-slate-950/80 backdrop-blur-lg py-12'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid md:grid-cols-4 gap-8 mb-8'>
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <span className='text-lg font-bold'>📚 EduTrack</span>
              </div>
              <p className='text-slate-400 text-sm'>Smart educational management for modern institutions.</p>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Product</h4>
              <ul className='space-y-2 text-slate-400 text-sm'>
                <li><a href='#' className='hover:text-blue-400 transition'>Features</a></li>
                <li><a href='#' className='hover:text-blue-400 transition'>Pricing</a></li>
                <li><a href='#' className='hover:text-blue-400 transition'>Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Support</h4>
              <ul className='space-y-2 text-slate-400 text-sm'>
                <li><a href='#' className='hover:text-blue-400 transition'>Documentation</a></li>
                <li><a href='#' className='hover:text-blue-400 transition'>Help Center</a></li>
                <li><a href='#' className='hover:text-blue-400 transition'>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Legal</h4>
              <ul className='space-y-2 text-slate-400 text-sm'>
                <li><a href='#' className='hover:text-blue-400 transition'>Privacy</a></li>
                <li><a href='#' className='hover:text-blue-400 transition'>Terms</a></li>
                <li><a href='#' className='hover:text-blue-400 transition'>Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className='border-t border-blue-800/30 pt-8 text-center text-slate-400 text-sm'>
            <p>&copy; 2024 EduTrack. All rights reserved. Built with ❤️ for educators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
