import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto rounded-xl">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 small-font">
              <span className=" text-white p-1.5 rounded-3xl bg-gradient-to-br from-orange-500 to-purple-600 ">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg=">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
                {/* <svg className="w-13 h-13 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7v10M9 7a2 2 0 012 2v2a2 2 0 01-2 2M15 7v10" />
                </svg> */}
              </span>
              FoodHub
            </h3>
            <p className="text-sm text-gray-300 max-w-xs small-font">
              Delicious meals delivered to your door. Experience the best culinary delights from the comfort of your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm small-font">Quick Links</h4>
            <ul className="space-y-2 text-sm small-font">
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
              <li><Link to="/#about" className="hover:text-orange-400 transition-colors">About Us</Link></li>
              <li><Link to="/#menu" className="hover:text-orange-400 transition-colors">Menu</Link></li>
              <li><Link to="/#contact" className="hover:text-orange-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm small-font">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                <FiGithub size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 small-font">
          <p>&copy; {new Date().getFullYear()} FoodHub Restaurant System. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
