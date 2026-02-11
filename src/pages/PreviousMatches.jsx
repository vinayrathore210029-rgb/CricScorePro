import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import { Clock, Trophy, ChevronRight } from 'lucide-react';

export default function PreviousMatches() {
    const { matches } = useMatch();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    const completedMatches = matches
        .filter(m => m.status === 'completed')
        .reverse();

    const filteredMatches = filter === 'all'
        ? completedMatches
        : completedMatches.filter(m => m.winner?.toLowerCase().includes(filter.toLowerCase())); // Simplified filter logic

    return (
        <div className="container py-8 animate-enter">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Clock className="text-primary" size={32} />
                Match Results History
            </h1>

            {filteredMatches.length > 0 ? (
                <div className="space-y-4">
                    {filteredMatches.map((match) => (
                        <div key={match.id} className="card p-0 overflow-hidden hover:border-primary transition-all group">
                            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                {/* Match Info & Date */}
                                <div className="flex flex-col gap-1 w-full md:w-auto">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                                        {match.name || 'Friendly Match'}
                                    </span>
                                    <div className="text-sm text-muted">
                                        {new Date(match.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Teams & Scores */}
                                <div className="flex-1 w-full md:w-auto flex items-center justify-center gap-8">
                                    <div className={`text-right ${match.winner === match.teamA.name ? 'font-bold text-success' : ''}`}>
                                        <div className="text-xl">{match.teamA.name}</div>
                                        <div className="font-mono text-2xl">
                                            {match.score.teamA.runs}/{match.score.teamA.wickets}
                                            <span className="text-sm text-muted font-normal ml-1">({match.score.teamA.overs})</span>
                                        </div>
                                    </div>

                                    <div className="text-muted font-bold text-sm bg-[var(--bg-main)] px-2 py-1 rounded">VS</div>

                                    <div className={`text-left ${match.winner === match.teamB.name ? 'font-bold text-success' : ''}`}>
                                        <div className="text-xl">{match.teamB.name}</div>
                                        <div className="font-mono text-2xl">
                                            {match.score.teamB.runs}/{match.score.teamB.wickets}
                                            <span className="text-sm text-muted font-normal ml-1">({match.score.teamB.overs})</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Result & Action */}
                                <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-[var(--border)] pt-4 md:pt-0 md:pl-6">
                                    <div className="flex items-center gap-2 text-primary font-semibold bg-primary/10 px-3 py-1 rounded-lg">
                                        <Trophy size={16} />
                                        <span>Winner: {match.winner}</span>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/match-result/${match.id}`)}
                                        className="btn btn-outline text-sm flex items-center gap-2 group-hover:bg-primary group-hover:text-white transition-colors"
                                    >
                                        Full Scorecard <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[var(--bg-card)] rounded-xl border border-dashed border-[var(--border)]">
                    <Clock size={48} className="mx-auto text-muted mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-muted">No Match History</h3>
                    <p className="text-muted/70">Complete matches will appear here.</p>
                </div>
            )}
        </div>
    );
}
