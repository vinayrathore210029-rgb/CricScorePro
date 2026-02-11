import { Link, useLocation } from 'react-router-dom';
import {
    Trophy, Home, PlusCircle, Tv,
    Twitter, Facebook, Instagram, Linkedin,
    Menu, X
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/live', label: 'Watch Live', icon: Tv },
        { to: '/admin', label: 'Score Match', icon: PlusCircle, isButton: true },
    ];

    return (
        <div className="min-h-screen flex flex-col font-body bg-slate-50">

            {/* ---------------- NAVBAR ---------------- */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                            <Trophy size={20} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
                            CricScore<span className="text-slate-500 font-normal">Pro</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(link =>
                            link.isButton ? (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium shadow-lg hover:bg-primary-700 transition-all"
                                >
                                    <link.icon size={18} />
                                    {link.label}
                                </Link>
                            ) : (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`relative font-medium transition-colors ${location.pathname === link.to
                                            ? 'text-primary-600'
                                            : 'text-slate-600 hover:text-primary-600'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <link.icon size={18} />
                                        {link.label}
                                    </span>
                                    <span
                                        className={`absolute -bottom-1 left-0 h-0.5 bg-primary-600 transition-all ${location.pathname === link.to ? 'w-full' : 'w-0 hover:w-full'
                                            }`}
                                    />
                                </Link>
                            )
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-700"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-200 p-4">
                        <div className="flex flex-col gap-3">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-lg text-slate-700 hover:bg-slate-100"
                                >
                                    <link.icon size={18} />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* ---------------- MAIN ---------------- */}
            <main className="flex-1">
                {children}
            </main>

            {/* ================= PROFESSIONAL FOOTER ================= */}
            <footer className="relative bg-slate-950 text-slate-400 mt-auto overflow-hidden">

                {/* Top Gradient Border */}
                <div className="h-[2px] w-full bg-gradient-to-r from-primary-600 via-purple-500 to-primary-600" />

                <div className="container mx-auto px-6 py-16">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                        {/* Brand Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                    <Trophy size={20} />
                                </div>
                                <span className="text-xl font-bold text-white">
                                    CricScore<span className="text-primary-500 font-normal">Pro</span>
                                </span>
                            </div>

                            <p className="text-sm leading-relaxed mb-6">
                                Empowering grassroots cricket with live scoring,
                                analytics and professional tournament management.
                            </p>

                            <div className="flex gap-4">
                                {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center
                         hover:bg-primary-600 hover:text-white
                         transition-all duration-300"
                                    >
                                        <Icon size={16} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                            <ul className="space-y-3 text-sm">
                                {["Home", "Live Matches", "Tournaments", "Rankings", "About Us"].map((item, i) => (
                                    <li key={i}>
                                        <a href="#" className="hover:text-primary-400 transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Resources</h4>
                            <ul className="space-y-3 text-sm">
                                {["Help Center", "Privacy Policy", "Terms & Conditions", "Support"].map((item, i) => (
                                    <li key={i}>
                                        <a href="#" className="hover:text-primary-400 transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
                            <p className="text-sm mb-4">
                                Get match updates and tournament news directly in your inbox.
                            </p>

                            <div className="flex w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="flex-1 w-full min-w-0 bg-transparent px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                                />
                                <button className="bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors shrink-0">
                                    Subscribe
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
                        <p className="text-slate-500">
                            © {new Date().getFullYear()} CricScorePro. All rights reserved.
                        </p>

                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-primary-400 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-primary-400 transition-colors">Terms</a>
                            <a href="#" className="hover:text-primary-400 transition-colors">Cookies</a>
                        </div>
                    </div>

                </div>
            </footer>

        </div>
    );
}
