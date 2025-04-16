import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {/* Company Information */}
          <div>
            <h3 className="text-base font-semibold mb-2">About Geobuddy</h3>
            <p className="text-gray-400 text-xs">
              Experience safe and seamless tracking of property in Kenya
            </p>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-base font-semibold mb-2">Support</h3>
            <ul className="space-y-1">
              <li><a href="javascript:void(0)" className="text-gray-400 hover:text-white text-xs">Help Center</a></li>
              <li><a href="javascript:void(0)" className="text-gray-400 hover:text-white text-xs">FAQs</a></li>
              <li><a href="javascript:void(0)" className="text-gray-400 hover:text-white text-xs">Privacy Policy</a></li>
              <li><a href="javascript:void(0)" className="text-gray-400 hover:text-white text-xs">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Connect With Us - Using Lucide React Icons */}
          <div className="col-span-2 md:col-span-1 mt-4 md:mt-0">
            <h3 className="text-base font-semibold mb-2">Connect With Us</h3>
            <div className="flex space-x-4 mb-3">
              <a href="javascript:void(0)" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a href="javascript:void(0)" className="text-gray-400 hover:text-white" aria-label="Twitter">
                <Twitter size={18} strokeWidth={1.5} />
              </a>
              <a href="javascript:void(0)" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="javascript:void(0)" className="text-gray-400 hover:text-white" aria-label="LinkedIn">
                <Linkedin size={18} strokeWidth={1.5} />
              </a>
            </div>
            <div className="text-xs text-gray-400">
              <div className="flex items-center mb-1">
                <Phone size={14} className="mr-2" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center mb-1">
                <Mail size={14} className="mr-2" />
                <span>info@geobuddy.co.ke</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 pt-3 border-t border-gray-800 text-center text-gray-400 text-xs">
          <p>&copy; 2025 GeoBuddy Platform | All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;