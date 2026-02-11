import { Link } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import { Tv, Plus, ArrowRight, Activity } from 'lucide-react';

export default function WatchLive() {
    const { matches } = useMatch();
    const liveMatches = matches.filter(m => m.status === 'live');

    if (liveMatches.length === 0) {
        return (
            <div className="container py-20 text-center animate-enter max-w-lg mx-auto">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100 shadow-inner">
                    <Tv size={40} className="text-gray-300" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-3">No Matches Live</h2>
                <p className="text-muted text-lg leading-relaxed mb-8">
                    There are currently no matches being played. Start a new match or check back later!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/admin" className="btn btn-primary px-8 py-3 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30">
                        <Plus size={20} className="mr-2" /> Start New Match
                    </Link>
                    <Link to="/upcoming" className="btn bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-8 py-3 shadow-sm">
                        Upcoming Fixtures
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8 animate-enter">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
                    <span className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                    Live Matches
                </h1>
                <span className="text-sm font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100 flex items-center gap-2">
                    <Activity size={14} /> {liveMatches.length} Active
                </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveMatches.map(match => (
                    <Link key={match.id} to={`/admin/live/${match.id}`} className="group card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-red-500 overflow-hidden">
                        <div className="p-5 border-b border-border bg-gradient-to-r from-red-50/50 to-transparent flex justify-between items-start">
                            <div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-red-600 text-xs font-black uppercase tracking-wider shadow-sm border border-red-100 animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> Live Now
                                </span>
                                <div className="text-xs font-semibold text-gray-400 mt-2 ml-1">
                                    {match.type || 'T20'} • {match.overs} Overs
                                </div>
                            </div>
                            {match.battingTeam && (
                                <div className="text-right">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Batting</span>
                                    <span className="font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded text-sm">
                                        {match[match.battingTeam]?.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Team A Score */}
                            <div className="flex justify-between items-center group/team">
                                <div>
                                    <div className={`font-heading font-bold text-xl ${match.battingTeam === 'teamA' ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {match.teamA?.name}
                                        {match.battingTeam === 'teamA' && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary-500" />}
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium">Yet to bat</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-3xl font-bold tracking-tight text-gray-900">
                                        {match.score?.teamA?.runs}/{match.score?.teamA?.wickets}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {match.score?.teamA?.overs} Ov
                                    </div>
                                </div>
                            </div>

                            {/* Divider with VS */}
                            <div className="relative flex items-center justify-center">
                                <hr className="w-full border-border" />
                                <span className="absolute bg-white px-2 text-xs font-bold text-gray-300 uppercase">VS</span>
                            </div>

                            {/* Team B Score */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className={`font-heading font-bold text-xl ${match.battingTeam === 'teamB' ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {match.teamB?.name}
                                        {match.battingTeam === 'teamB' && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary-500" />}
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium">Target: {match.score?.teamA?.runs ? match.score.teamA.runs + 1 : '-'}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-3xl font-bold tracking-tight text-gray-900">
                                        {match.score?.teamB?.runs}/{match.score?.teamB?.wickets}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {match.score?.teamB?.overs} Ov
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 border-t border-border flex justify-between items-center group-hover:bg-primary-50/50 transition-colors">
                            <span className="text-sm font-semibold text-gray-500 group-hover:text-primary-600 transition-colors">
                                View Full Scorecard
                            </span>
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-primary-200 group-hover:text-primary-600 transition-all group-hover:translate-x-1">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
