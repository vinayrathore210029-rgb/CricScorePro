import { Link, useLocation } from 'react-router-dom';
import { Trophy, Home, PlusCircle, Tv, ExternalLink, Mail, Shield, FileText, Twitter, Facebook, Instagram, Linkedin, Github, Menu, X } from 'lucide-react';
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
        <div className="min-h-screen flex flex-col relative font-body text-slate-900 bg-slate-50">
            <div className="animated-bg fixed inset-0 z-[-1]" />

            {/* --- Sticky Navbar --- */}
            <nav className="navbar-glass border-b border-border transition-all duration-300">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-green flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Trophy size={20} fill="currentColor" strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-bold font-heading tracking-tight group-hover:text-primary-600 transition-colors">
                            CricScore<span className="text-muted font-normal">Pro</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            link.isButton ? (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="btn btn-primary shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <link.icon size={18} className="mr-2" />
                                    {link.label}
                                </Link>
                            ) : (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`relative font-medium text-base transition-colors duration-300 group ${location.pathname === link.to ? 'text-primary-600' : 'text-text-secondary hover:text-primary-600'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <link.icon size={18} className={`transition-transform duration-300 group-hover:scale-110 ${location.pathname === link.to ? 'text-primary-600' : 'text-muted group-hover:text-primary-600'}`} />
                                        {link.label}
                                    </span>
                                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-600 transition-all duration-300 ease-out ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                                        }`} />
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-text-secondary hover:text-primary-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md border-b border-border p-4 shadow-xl z-50 animate-enter">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${location.pathname === link.to ? 'bg-primary-50 text-primary-600' : 'text-text-secondary hover:bg-gray-50'
                                        }`}
                                >
                                    <link.icon size={20} />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* --- Main Content --- */}
            <main className="grow w-full relative z-10">
                {children}
            </main>

            {/* --- Premium Footer --- */}
            <footer className="bg-white border-t border-border mt-auto relative z-10 pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                                    <Trophy size={16} />
                                </div>
                                <span className="text-xl font-bold font-heading">CricScorePro</span>
                            </div>
                            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
                                The ultimate cricket scoring platform for tournaments, clubs, and casual matches. Experience pro-level stats and live tracking.
                            </p>
                            <div className="flex items-center gap-4">
                                <SocialLink href="#" icon={<Twitter size={18} />} />
                                <SocialLink href="#" icon={<Facebook size={18} />} />
                                <SocialLink href="#" icon={<Instagram size={18} />} />
                                <SocialLink href="#" icon={<Linkedin size={18} />} />
                            </div>
                        </div>

                        {/* Product Column */}
                        <div>
                            <h4 className="font-heading font-bold text-main mb-6">Product</h4>
                            <ul className="space-y-4 text-sm text-text-secondary">
                                <li><Link to="/live" className="hover:text-primary-600 transition-colors">Live Scorer</Link></li>
                                <li><Link to="/tournaments" className="hover:text-primary-600 transition-colors">Tournaments</Link></li>
                                <li><Link to="/features" className="hover:text-primary-600 transition-colors">Features</Link></li>
                                <li><Link to="/pricing" className="hover:text-primary-600 transition-colors">Pricing</Link></li>
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div>
                            <h4 className="font-heading font-bold text-main mb-6">Resources</h4>
                            <ul className="space-y-4 text-sm text-text-secondary">
                                <li><a href="#" className="hover:text-primary-600 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-primary-600 transition-colors">API Reference</a></li>
                                <li><a href="#" className="hover:text-primary-600 transition-colors">Community</a></li>
                                <li><a href="#" className="hover:text-primary-600 transition-colors">Blog</a></li>
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div>
                            <h4 className="font-heading font-bold text-main mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-text-secondary">
                                <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-primary-600 transition-colors">Cookie Policy</a></li>
                                <li><a href="#" className="hover:text-primary-600 transition-colors">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
                        <p>© 2024 CricScore Pro. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2 hover:text-primary-600 cursor-pointer transition-colors">
                                <Mail size={14} /> support@cricscore.pro
                            </span>
                            <span className="w-1 h-1 bg-border rounded-full hidden md:block" />
                            <span className="flex items-center gap-2 hover:text-success cursor-pointer transition-colors">
                                <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> System Operational
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function SocialLink({ href, icon }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-white hover:text-primary-600 hover:border-primary-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
            {icon}
        </a>
    );
}
