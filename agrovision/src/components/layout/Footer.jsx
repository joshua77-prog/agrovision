import { Leaf, Share2, Users, Camera, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-brand-600 rounded-lg">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                AGRO<span className="text-brand-400">VISION</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-gray-400">
              Smart Insights for Healthier Crops. AI-powered disease detection and
              weather-based farming advisories for modern farmers.
            </p>
            <div className="flex gap-3 mt-5">
              {[Share2, Users, Camera, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-brand-600 hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              {['Dashboard', 'Disease Detection', 'Weather Advisory', 'Detection History', 'Disease Information'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-brand-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm">
              {['About AgroVision', 'How It Works', 'FAQ', 'Contact Us', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-brand-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2026 AgroVision. All rights reserved.</p>
          <p className="text-xs text-gray-600">
            AI predictions should be verified with agricultural experts.
          </p>
        </div>
      </div>
    </footer>
  );
}
