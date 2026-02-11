import { Link } from 'react-router-dom';
import { Tv, Edit3, ArrowRight, Trophy, Calendar, Clock } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center py-12 gap-10">
            <div className="text-center space-y-4 max-w-2xl animate-enter">
                <h1 className="text-4xl md:text-6xl font-bold gradient-text-primary">
                    Professional Cricket Scoring
                </h1>
                <p className="text-xl text-muted">
                    Real-time scoring, detailed stats, and premium experience for local tournaments.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl animate-enter" style={{ animationDelay: '0.2s' }}>
                <Link to="/live" className="card group hover-border-primary p-8 flex flex-col items-center text-center gap-4 animate-float">
                    <div className="p-4 rounded-full bg-primary-soft text-primary group-hover:scale-110 transition-transform shadow-sm">
                        <Tv size={48} />
                    </div>
                    <h2 className="text-2xl font-bold">Watch Live</h2>
                    <p className="text-muted">Follow real-time scores of ongoing matches as a viewer.</p>
                    <div className="mt-auto text-primary flex items-center gap-2 font-semibold group-hover:translate-x-1 transition-transform">
                        Browse Matches <ArrowRight size={16} />
                    </div>
                </Link>

                <Link to="/upcoming" className="card group hover-border-cyan p-8 flex flex-col items-center text-center gap-4 animate-float" style={{ animationDelay: '0.3s' }}>
                    <div className="p-4 rounded-full bg-cyan-soft text-cyan group-hover:scale-110 transition-transform shadow-sm">
                        <Calendar size={48} />
                    </div>
                    <h2 className="text-2xl font-bold">Upcoming Matches</h2>
                    <p className="text-muted">Check schedule for future tournament games and fixtures.</p>
                    <div className="mt-auto text-cyan flex items-center gap-2 font-semibold group-hover:translate-x-1 transition-transform">
                        View Schedule <ArrowRight size={16} />
                    </div>
                </Link>

                <Link to="/previous" className="card group hover-border-yellow p-8 flex flex-col items-center text-center gap-4 animate-float" style={{ animationDelay: '0.4s' }}>
                    <div className="p-4 rounded-full bg-yellow-soft text-yellow group-hover:scale-110 transition-transform shadow-sm">
                        <Clock size={48} />
                    </div>
                    <h2 className="text-2xl font-bold">Previous Matches</h2>
                    <p className="text-muted">Explore history, detailed scorecards, and player stats.</p>
                    <div className="mt-auto text-yellow flex items-center gap-2 font-semibold group-hover:translate-x-1 transition-transform">
                        View History <ArrowRight size={16} />
                    </div>
                </Link>

                <Link to="/admin" className="card group hover-border-accent p-8 flex flex-col items-center text-center gap-4 animate-float" style={{ animationDelay: '0.5s' }}>
                    <div className="p-4 rounded-full bg-accent-soft text-accent group-hover:scale-110 transition-transform shadow-sm">
                        <Edit3 size={48} />
                    </div>
                    <h2 className="text-2xl font-bold">Create Scorecard</h2>
                    <p className="text-muted">Start a new match, manage teams, and update scores live.</p>
                    <div className="mt-auto text-accent flex items-center gap-2 font-semibold group-hover:translate-x-1 transition-transform">
                        Start Scoring <ArrowRight size={16} />
                    </div>
                </Link>

                <Link to="/tournament/new" className="card group hover-border-purple p-8 flex flex-col items-center text-center gap-4 animate-float" style={{ animationDelay: '0.6s' }}>
                    <div className="p-4 rounded-full bg-purple-soft text-purple group-hover:scale-110 transition-transform shadow-sm">
                        <Trophy size={48} />
                    </div>
                    <h2 className="text-2xl font-bold">Organize Series</h2>
                    <p className="text-muted">Create tournaments, generate fixtures, and track points table.</p>
                    <div className="mt-auto text-purple flex items-center gap-2 font-semibold group-hover:translate-x-1 transition-transform">
                        New Tournament <ArrowRight size={16} />
                    </div>
                </Link>
            </div>
        </div>
    );
}
