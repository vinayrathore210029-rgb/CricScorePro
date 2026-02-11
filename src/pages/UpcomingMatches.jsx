import { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { useMatch } from '../context/MatchContext';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function UpcomingMatches() {
    const { tournaments } = useTournament();
    const [searchTerm, setSearchTerm] = useState('');

    const upcomingFixtures = tournaments.flatMap(t =>
        t.fixtures.filter(f => f.status === 'scheduled').map(f => ({ ...f, tournamentName: t.name }))
    ).filter(match =>
        match.teamA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.teamB.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.tournamentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-8 animate-enter">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Calendar className="text-primary" size={32} />
                Upcoming Matches
            </h1>

            <div className="mb-8 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
                <input
                    type="text"
                    placeholder="Search teams or tournaments..."
                    className="input w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {upcomingFixtures.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingFixtures.map((match, i) => (
                        <div key={i} className="card p-6 border-l-4 border-l-[var(--accent)] hover:shadow-lg transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted bg-[var(--bg-main)] px-2 py-1 rounded">
                                    {match.tournamentName}
                                </span>
                                <div className="p-2 rounded-full bg-[var(--bg-main)] text-[var(--accent)]">
                                    <Clock size={16} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xl font-bold mb-4">
                                <div className="text-center w-1/3 break-words">{match.teamA}</div>
                                <div className="text-sm font-medium text-muted bg-[var(--bg-main)] px-2 py-1 rounded-full">VS</div>
                                <div className="text-center w-1/3 break-words">{match.teamB}</div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center gap-2 text-sm text-muted">
                                <MapPin size={14} />
                                <span>TBD Venue</span>
                            </div>

                            <button className="btn btn-outline w-full mt-4 group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                                Set Reminder
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[var(--bg-card)] rounded-xl border border-dashed border-[var(--border)]">
                    <Calendar size={48} className="mx-auto text-muted mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-muted">No Upcoming Matches</h3>
                    <p className="text-muted/70">Check back later for new tournament schedules.</p>
                </div>
            )}
        </div>
    );
}
